require "sinatra"
require "sinatra/json"
require "sequel"
require "bcrypt"
require "json"
require "rack/cors"

# CORS Policy per autorizzare il front-end ad effettuare chiamate verso questo endpoint(http://localhost:4567)
use Rack::Cors do
  allow do
    origins 'http://localhost:3000'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
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
  String :password_hash, null: false, unique: false
  String :name, null: false
  String :surname, null: false
  Date :date_of_birth, null: false
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
  # collegamento con l'id utente
  foreign_key :user_id, :users, null:false, on_delete: :cascade
  # collegamento con l'id del prodotto
  foreign_key :product_type_id, :product_types, null: false, unique: true, on_delete: :cascade
  String :name, null: false, size: 50
  String :description, null: false, size: 255
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

# Definisco i modelli
class User < Sequel::Model
  one_to_many :products

  def authenticate(password)
    BCrypt::Password.new(self.password_hash) == password
  end
end

class ProductType < Sequel::Model
  one_to_one :product
end

class Product < Sequel::Model
  many_to_one :user
  one_to_one :product_type
end

# Rotta per la registrazione
post '/register' do
  begin
    # Recupero il corpo della richiesta in JSON
    data = JSON.parse(request.body.read)
    # Recupero i dati dalla richiesta
    username = data["username"]
    email = data["email"]
    password = data["password"]  # Ensure password is retrieved
    name = data["name"]
    surname = data["surname"]
    date_of_birth = data["date_of_birth"]

    # Controllo se ci sono campi vuoti
    if [username, password, name, surname, date_of_birth].any?(&:nil?)
      halt 400, { error: "Compila tutti i campi richiesti" }.to_json
    end

    # Controllo validità password
    if password.length < 8
      halt 400, json(error: "La password deve essere di lunghezza maggiore di 8 carateeri")
      # controllo che ci sia almeno una lettera maiuscola
    elsif password !~ /[A-Z]/
      halt 400, json(error: "La password deve contenere almeno una lettera maiuscola")
      # controllo che ci sia almeno un carattere non alfanumerico
    elsif password !~ /[\W_]/
      halt 400, json(error: "La password deve avere almeno un carattere speciale")
    end

    # Hash della password
    hashed_password = BCrypt::Password.create(password)

    user = User.new(
      username: username,
      email: email,
      password_hash: hashed_password,  # Use the correct column name
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

    user = User.find(username: username)
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