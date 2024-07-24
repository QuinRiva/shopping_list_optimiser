const OpenAI = require('openai');
const loadGroceries = require('./loadGroceries');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const wildcardMatch = (keepItem, groceries) => {
  const results = groceries.filter(grocery => grocery.name.toLowerCase().includes(keepItem.toLowerCase()));
  console.log(`Wildcard matched results for "${keepItem}":`, results.map(result => result.name));
  return results;
};

const matchItems = async (keepItem) => {
  try {
    console.log(`Matching item: ${keepItem}`);
    const groceries = await loadGroceries();
    console.log(`Groceries loaded: ${groceries.length} items`);

    const wildcardMatchedItems = wildcardMatch(keepItem, groceries);

    if (wildcardMatchedItems.length === 0) {
      console.log(`No wildcard matches found for "${keepItem}"`);
      return [];
    }

    const itemsList = wildcardMatchedItems.map(item => `${item.name} (${item.category})`).join(', ');

    const prompt = `Match the following item to the best items in the database: "${keepItem}". Database items: ${itemsList}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.5,
    });

    const result = response.choices[0].message.content.trim().split('\n').map(item => item.trim());
    console.log(`GPT-3.5-turbo matched results for "${keepItem}":`, result);

    return result;
  } catch (error) {
    console.error('Error matching items:', error);
    return [];
  }
};

module.exports = matchItems;
