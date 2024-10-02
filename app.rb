require "sinatra"
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
  String :username, null: false, unique: true, size: 75
  String :email, null: false, unique: true, size: 100
  String :password_hash, null: false, unique: false, size: 25
  String :name, null: false, size: 20
  String :surname, null: false, size: 30
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
  String :name, null: false, size: 50
  String :description, null: false, size: 255
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
end

# Definisco i modelli
class User < Sequel::Model
  one_to_many :products

  def password=(password)
    self.password_hash = BCrypt::Password.create(password)
  end

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
    # Recupero l'username dalla richiesta
    username = data["username"]
    # Recupero l'email dalla richiesta
    email = data["email"]
    # Recupero la password dalla richiesta
    password = data["password"]
    # Recupero il nome dalla richiesta
    name = data["name"]
    # Recupero il cognome dalla richiesta
    surname = data["surname"]
    # Recupero la data di nascita dalla richiesta
    date_of_birth = data["date_of_birth"]

    halt 400, json(error: "Tutti i campi devono essere compilati") if username.nil? || email.nil? || password.nil? || name.nil? || surname.nil? || date_of_birth.nil?

  rescue Sequel::UniqueConstraintViolation
    halt 409, json(error: "Nome utente già in uso")
  rescue => e
    status 500
    json(error: "Errore del server: #{e.message}")
  end
end

# Rotta per il login
post '/login' do
  "Login Button"
end