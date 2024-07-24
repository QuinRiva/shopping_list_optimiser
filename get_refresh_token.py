import gkeepapi
import os

def get_refresh_token(email, password):
    keep = gkeepapi.Keep()
    try:
        keep.authenticate(email, password)
        print("Login successful")
        token = keep.getMasterToken()
        return token
    except gkeepapi.exception.LoginException as e:
        raise Exception("Failed to authenticate with Google Keep. Check your credentials.") from e

if __name__ == "__main__":
    email = input("Enter your Google email: ")
    password = input("Enter your Google password: ")

    try:
        refresh_token = get_refresh_token(email, password)
        print(f"Refresh Token: {refresh_token}")
    except Exception as e:
        print(f"Error: {e}")
