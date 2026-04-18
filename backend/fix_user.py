from db import users
from utils import hash_password

# Update the existing user with correct fields
result = users.update_one(
    {'email': 'aestheticsagarsocial@gmail.com'},
    {'$set': {
        'password': hash_password('Test123456!'),
        'emailVerified': True
    }}
)
print(f'✅ Updated: {result.modified_count} document(s)')
