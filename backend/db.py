import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Get the URI from Railway variables
uri = os.getenv("MONGO_URI")

# Connect to the client
client = MongoClient(uri)

# Use the square bracket notation to fix the "No default database" error
# Replace 'iads' with your actual DB name if it's different
db = client['iads'] 

users = db['users']
reports = db['reports']