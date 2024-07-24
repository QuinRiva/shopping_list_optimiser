import os
from pathlib import Path
from dotenv import load_dotenv

def check_env_file():
    env_path = Path('.') / '.env'
    if not env_path.exists():
        print(f"Error: .env file not found at {env_path}")
        return False
    print(f".env file found at {env_path}")
    return True

def check_env_variables():
    required_vars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'MONGODB_URI']
    missing_vars = [var for var in required_vars if var not in os.environ]
    if missing_vars:
        print(f"Error: Missing environment variables: {', '.join(missing_vars)}")
        return False
    print("All required environment variables are set.")
    return True

def validate_env_variables():
    print("Checking .env file...")
    if not check_env_file():
        return

    load_dotenv()  # Load environment variables from .env file

    print("Checking environment variables...")
    if not check_env_variables():
        return

    print("Environment configuration is correct.")

if __name__ == "__main__":
    validate_env_variables()