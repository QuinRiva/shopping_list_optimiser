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

def update_note_items(note, items):
    if isinstance(note, gkeepapi.node.List):
        # Clear existing items
        for item in note.items:
            item.delete()
        
        # Add new items
        for item in items:
            note.add(item['name'], False)  # Add unchecked items
    else:
        # For non-list notes, simply set the text
        note.text = "\n".join([item['name'] for item in items])
    note.save()

def get_note_by_title(keep, title):
    notes = keep.find(query=title)
    for note in notes:
        if note.title == title:
            return note
    return None

if __name__ == "__main__":
    master_token = os.getenv('GOOGLE_MASTER_TOKEN')
    if not master_token:
        print("Error: GOOGLE_MASTER_TOKEN environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    data = json.loads(sys.argv[1])
    backlog_title = os.getenv('BACKLOG_TITLE', 'Backlog')
    next_shop_title = os.getenv('NEXT_SHOP_TITLE', 'Next Shop List')

    if not backlog_title or not next_shop_title:
        print("Error: BACKLOG_TITLE and NEXT_SHOP_TITLE environment variables must be set.", file=sys.stderr)
        sys.exit(1)

    try:
        keep = authenticate_with_token(master_token)

        backlog_note = get_note_by_title(keep, backlog_title)
        next_shop_note = get_note_by_title(keep, next_shop_title)

        if backlog_note:
            update_note_items(backlog_note, data['backlog'])
        else:
            backlog_note = keep.createList(backlog_title, [(item['name'], False) for item in data['backlog']])

        if next_shop_note:
            update_note_items(next_shop_note, data['next_shop'])
        else:
            next_shop_note = keep.createList(next_shop_title, [(item['name'], False) for item in data['next_shop']])

        keep.sync()
        print("Google Keep updated successfully")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
