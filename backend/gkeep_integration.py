import gkeepapi
import os
import json
import sys

def authenticate_with_token(master_token):
    keep = gkeepapi.Keep()
    try:
        keep.authenticate(None, master_token)
        return keep
    except gkeepapi.exception.LoginException as e:
        print(f"Error: Failed to authenticate with Google Keep. Check your token. {e}", file=sys.stderr)
        sys.exit(1)

def get_all_titles(keep):
    notes = keep.all()
    titles = [note.title for note in notes]
    return titles

def get_notes_by_title(keep, title):
    notes = keep.all()
    for note in notes:
        if note.title == title:
            return note
    return None

def extract_items(note):
    items = []
    for line in note.text.split('\n'):
        if line.strip():  # Avoid empty lines
            items.append({
                'name': line.strip(),
                'purchased': False  # Default purchased status, can be enhanced
            })
    return items

if __name__ == "__main__":
    master_token = os.getenv('GOOGLE_MASTER_TOKEN')
    action = os.getenv('ACTION', 'notes')
    
    try:
        keep = authenticate_with_token(master_token)

        if action == 'titles':
            titles = get_all_titles(keep)
            print(json.dumps(titles))
        else:
            backlog_title = os.getenv('BACKLOG_TITLE', 'Backlog')
            next_shop_title = os.getenv('NEXT_SHOP_TITLE', 'Next Shop List')
            backlog_note = get_notes_by_title(keep, backlog_title)
            next_shop_note = get_notes_by_title(keep, next_shop_title)

            backlog_items = extract_items(backlog_note) if backlog_note else []
            next_shop_items = extract_items(next_shop_note) if next_shop_note else []

            result = {
                'backlog': backlog_items,
                'next_shop': next_shop_items
            }

            print(json.dumps(result))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
