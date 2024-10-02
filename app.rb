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

post '/login' do
  "Login Button"
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

post '/register' do
  "Register Button"
end