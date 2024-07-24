import gkeepapi
import os

def authenticate(email, password):
    keep = gkeepapi.Keep()
    success = keep.login(email, password)
    if not success:
        raise Exception("Failed to authenticate with Google Keep.")
    return keep

def get_notes(keep):
    return keep.all()

if __name__ == "__main__":
    # Example usage
    email = os.getenv('GOOGLE_EMAIL')
    password = os.getenv('GOOGLE_PASSWORD')

    keep = authenticate(email, password)
    notes = get_notes(keep)

    for note in notes:
        print(note.title)