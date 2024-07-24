const loadGroceries = require('./utils/loadGroceries');

const testLoadGroceries = async () => {
  try {
    await loadGroceries();
  } catch (error) {
    console.error('Error loading groceries:', error);
  }
};

testLoadGroceries();
