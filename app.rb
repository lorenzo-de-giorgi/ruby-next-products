require "sinatra"
require "sinatra/json"
require "sequel"
require "bcrypt"
require "json"
require "rack/cors"
require "mail"
require "securerandom"
require 'dotenv/load'

# CORS Policy per autorizzare il front-end ad effettuare chiamate verso questo endpoint(http://localhost:4567)
use Rack::Cors do
  allow do
    origins 'http://localhost:3000'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 600
  end
end

# Configurazione connessione al Database
DB = Sequel.connect(
  adapter: 'postgres',
  host: 'localhost',
  database: 'products_db',
  user: 'postgres',
  password: '15122004'
)

# Controllo l'esistenza e creo la tabella "users"
DB.create_table?(:users) do
  primary_key :id
  String :username, null: false, unique: true
  String :email, null: false, unique: true
  String :password_hash, null: false
  String :name, null: false
  String :surname, null: false
  Date :date_of_birth, null: false
  String :reset_token, null: true
  DateTime :reset_sent_at, null: true
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

# Controllo l'esistenza e creo la tabella "product_types"
DB.create_table?(:product_types) do
  primary_key :id
  String :type, null: false, size: 40
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

# Controllo l'esistenza e creo la tabella "products"
DB.create_table?(:products) do
  primary_key :id
  foreign_key :user_id, :users, null: false, on_delete: :cascade
  foreign_key :product_type_id, :product_types, null: false, on_delete: :cascade
  String :name, null: false, size: 50
  String :description, null: false, size: 255
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

# aggiunti cami per resettare password
# DB.alter_table(:users) do
#   add_column :reset_password, String
#   add_column :reset_sent_at, DateTime
# end

# DB.alter_table(:products) do
#   drop_constraint(:products_product_type_id_key, if_exists: true)
# end

# Definizione dei modelli
class User < Sequel::Model
  one_to_many :products

  def authenticate(password)
    BCrypt::Password.new(self.password_hash) == password
  end
end

class ProductType < Sequel::Model
  one_to_many :product
end

class Product < Sequel::Model
  many_to_one :user
  many_to_one :product_type
end

# Rotta per la registrazione
post '/register' do
  begin
    data = JSON.parse(request.body.read)
    username = data["username"]
    email = data["email"]
    password = data["password"]
    name = data["name"]
    surname = data["surname"]
    date_of_birth = data["date_of_birth"]

    if [username, password, name, surname, date_of_birth].any?(&:nil?)
      halt 400, { error: "Compila tutti i campi richiesti" }.to_json
    end

    if password.length < 8
      halt 400, json(error: "La password deve essere di lunghezza maggiore di 8 caratteri")
    elsif password !~ /[A-Z]/
      halt 400, json(error: "La password deve contenere almeno una lettera maiuscola")
    elsif password !~ /[\W_]/
      halt 400, json(error: "La password deve avere almeno un carattere speciale")
    end

    hashed_password = BCrypt::Password.create(password)

    user = User.new(
      username: username,
      email: email,
      password_hash: hashed_password,
      name: name,
      surname: surname,
      date_of_birth: date_of_birth
    )
    user.save
    status 201
    content_type :json
    { message: "Registrazione avvenuta con successo." }.to_json

  rescue Sequel::UniqueConstraintViolation
    halt 409, { error: "Nome utente o email già in uso." }.to_json
  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

# Rotta per il login
post '/login' do
  begin
    data = JSON.parse(request.body.read)
    username = data["username"]
    password = data["password"]

    halt 400, json(error: "Username e password sono richiesti") if username.nil? || password.nil?

    user = User.where(username: username).first
    if user&.authenticate(password)
      status 200
      json(message: "Login avvenuto con successo")
    else
      halt 401, json(error: "Username o password non validi")
    end

  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end  
end

# Rotta per ottenere i tipi di prodotto
get '/product_types' do
  begin
    product_types = DB[:product_types].all
    content_type :json
    status 200
    product_types.to_json

  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end  
end

# Rotta per ottenere i dati di un utente specifico
get '/user/:id' do
  begin
    user_id = params[:id].to_i

    # Trova l'utente tramite l'ID
    user = User[user_id]

    # Se l'utente non esiste, restituisce un errore 404
    if user.nil?
      halt 404, { error: "Utente non trovato" }.to_json
    end

    # Restituisce i dettagli dell'utente
    status 200
    {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      surname: user.surname,
      date_of_birth: user.date_of_birth
    }.to_json

  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end


# rotta per modificare dati utente
put '/update_profile/:id' do
  begin
    user_id = params[:id].to_i
    data = JSON.parse(request.body.read)

    # Recupera i dati che l'utente vuole modificare
    username = data["username"]
    email = data["email"]
    name = data["name"]
    surname = data["surname"]
    date_of_birth = data["date_of_birth"]
    password = data["password"]

    # Recupera l'utente dal database
    user = User[user_id]

    # Verifica se l'utente esiste
    if user.nil?
      halt 404, { error: "Utente non trovato" }.to_json
    end

    # Verifica che almeno un campo da aggiornare sia presente
    if [username, email, name, surname, date_of_birth, password].all?(&:nil?)
      halt 400, { error: "Nessun campo fornito per l'aggiornamento" }.to_json
    end

    # Aggiorna i campi che sono stati forniti
    user.update(
      username: username || user.username,
      email: email || user.email,
      name: name || user.name,
      surname: surname || user.surname,
      date_of_birth: date_of_birth || user.date_of_birth
    )

    # Se viene fornita una nuova password, aggiorna l'hash della password
    if password
      if password.length < 8
        halt 400, json(error: "La password deve essere di lunghezza maggiore di 8 caratteri")
      elsif password !~ /[A-Z]/
        halt 400, json(error: "La password deve contenere almeno una lettera maiuscola")
      elsif password !~ /[\W_]/
        halt 400, json(error: "La password deve avere almeno un carattere speciale")
      end
      hashed_password = BCrypt::Password.create(password)
      user.update(password_hash: hashed_password)
    end

    status 200
    {
      message: "Profilo aggiornato con successo",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        date_of_birth: user.date_of_birth
      }
    }.to_json

  rescue Sequel::UniqueConstraintViolation
    halt 409, { error: "Nome utente o email già in uso." }.to_json
  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

# Rotta per la creazione di un prodotto
post '/create_product' do
  begin
    data = JSON.parse(request.body.read)
    user_id = data["user_id"]
    product_type_id = data["product_type_id"]
    name = data["name"]
    description = data["description"]

    # Creazione del prodotto
    product = Product.new(
      user_id: user_id,
      product_type_id: product_type_id,
      name: name,
      description: description
    )
    product.save

    status 201
    {
      message: "Prodotto creato con successo",
      product: {
        id: product.id,
        user_id: product.user_id,
        product_type_id: product.product_type_id,
        name: product.name,
        description: product.description
      }
    }.to_json

  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

# Rotta per recuperare tutti i products
get '/products' do
  begin
    products = Product.eager(:product_type, :user).all.map do |product|
      {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.product_type&.type,
        user: product.user&.username,
        created_at: product.created_at
      }
    end
    content_type :json
    status 200
    products.to_json
  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

get '/products/:id' do
  begin

    product_id = params[:id].to_i
    product = Product.eager(:product_type, :user)[product_id]

    if product.nil?
      halt 404, { error: "Prodotto non trovato" }.to_json
    end

    # Restituisce i dettagli del prodotto
    {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.product_type&.type,
      user: product.user&.username,
      created_at: product.created_at
    }.to_json
    
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end  
end

put '/update_product/:id' do
  begin
    product_id = params[:id].to_i
    data = JSON.parse(request.body.read)

    user_id = data["user_id"]
    product_type_id = data["product_type_id"]
    name = data["name"]
    description = data["description"]

    product = Product[product_id]

    if product.nil?
      halt 404, { error: "Prodotto non trovato" }.to_json
    end

    product.update(
      user_id: user_id,
      product_type_id: product_type_id,
      name: name,
      description: description
    )

    status 200
    {
      message: "Prodotto aggiornato con successo",
      product: {
        id: product.id,
        user_id: product.user_id,
        product_type_id: product.product_type_id,
        name: product.name,
        description: product.description
      }
    }.to_json

  rescue Sequel::ValidationFailed => e
    halt 422, { error: "Validazione fallita: #{e.message}" }.to_json
  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

delete '/delete_product/:id' do
  begin
    product_id = params[:id].to_i

    product = Product[product_id]

    if product.nil?
      halt 404, { error: "Prodotto non trovato" }.to_json
    end

    product.delete
    status 204
  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

delete '/delete_user/:id' do
  begin
    user_id = params[:id].to_i

    user = User[user_id]

    if user.nil?
      halt 404, { error: "Utente non trovato" }.to_json
    end

    user.products.each(&:delete)

    user.delete

    status 200
    { message: "Account e prodotti eliminati con successo" }.to_json

  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

post '/request_password_reset' do
  begin

    data = JSON.parse(request.body.read)
    email = data["email"]

    user = User.where(email: email).first

    if user
      user.update(
        reset_token: SecureRandom.hex(10),
        reset_sent_at: Time.now
      )
    
      options = {
        address: ENV['SMTP_ADDRESS'],
        port: ENV['SMTP_PORT'],
        user_name: ENV['SMTP_USER_NAME'],
        password: ENV['SMTP_PASSWORD'],
        authentication: 'plain',
        enable_starttls_auto: true
      }

      Mail.defaults do
        delivery_method :smtp, options
      end

      Mail.deliver do
        to user.email
        from 'lorenzodegiorgi2004@gmail.com'
        subject 'Password Reset Request'
        body "To reset your password, click the link below:\n\nhttp://localhost:3000/update_password?token=#{user.reset_token}"
      end
      status 200
      { message: "Email inviata con successo." }.to_json
    else
      halt 404, { error: "Email non trovata." }.to_json
    end

  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end

post '/reset_password' do
  begin

    data = JSON.parse(request.body.read)
    token = data["token"]
    new_password = data["new_password"]

    user = User.where(reset_token: token).first

    if user && Time.now - user.reset_sent_at < 3600
      hashed_password = BCrypt::Password.create(new_password)
      user.update(
        password_hash: hashed_password,
        reset_token: nil,
        reset_sent_at: nil
      )
      status 200
      { message: "Password aggiornata con successo." }.to_json
    else
      halt 404, { error: "Token non valido o scaduto." }.to_json
    end

  rescue JSON::ParserError => e
    halt 400, { error: "Formato JSON non valido: #{e.message}" }.to_json
  rescue => e
    puts "Errore del server: #{e.message}"
    status 500
    content_type :json
    { error: "Errore del server: #{e.message}" }.to_json
  end
end