const getShoppingList = async (auth, listId) => {
  const keep = google.keep({ version: 'v1', auth });
  const note = await keep.notes.get({ name: `notes/${listId}` });
  const items = note.data.listItems || [];
  return items.map(item => item.text);
};

const updateShoppingList = async (auth, listId, items) => {
  const keep = google.keep({ version: 'v1', auth });
  const note = await keep.notes.get({ name: `notes/${listId}` });
  note.data.listItems = items.map(item => ({ text: item, checked: false }));
  await keep.notes.update({ name: `notes/${listId}`, requestBody: note.data });
};

module.exports = {
  authenticateGoogleKeep,
  getShoppingList,
  updateShoppingList,
};