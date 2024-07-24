import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShoppingList.css';

const ShoppingList = () => {
  const [titles, setTitles] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  const [nextShopItems, setNextShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(localStorage.getItem('backlogTitle') || '');
  const [nextShopTitle, setNextShopTitle] = useState(localStorage.getItem('nextShopTitle') || '');
  const [listFetched, setListFetched] = useState(false);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await axios.get('/api/google-keep/titles');
        console.log("Fetched titles: ", response.data);
        const filteredTitles = Array.isArray(response.data) ? response.data.filter(title => title.trim() !== '') : [];
        setTitles(filteredTitles);
      } catch (error) {
        console.error("Error fetching titles: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    if (selectedTitle) {
      fetchLists(selectedTitle, nextShopTitle);
    }
  }, [selectedTitle, nextShopTitle]);

  const fetchLists = async (backlogTitle, nextShopTitle) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/google-keep/lists', {
        params: {
          backlogTitle,
          nextShopTitle
        }
      });
      console.log("Fetched lists: ", response.data);
      setBacklogItems(response.data.backlog);
      setNextShopItems(response.data.next_shop);
      setListFetched(true);
    } catch (error) {
      console.error("Error fetching lists: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setSelectedTitle(title);
    localStorage.setItem('backlogTitle', title);
    fetchLists(title, nextShopTitle); // Fetch the new lists when title changes
  };

  const handleMoveToBacklog = (index) => {
    const item = nextShopItems[index];
    setNextShopItems(nextShopItems.filter((_, i) => i !== index));
    setBacklogItems([...backlogItems, item]);
  };

  const handleMoveToNextShopList = (index) => {
    const item = backlogItems[index];
    setBacklogItems(backlogItems.filter((_, i) => i !== index));
    setNextShopItems([...nextShopItems, item]);
  };

  const pushToGoogleKeep = async () => {
    try {
      await axios.post('/api/google-keep/update', { backlog: backlogItems, next_shop: nextShopItems });
      alert('Shopping list updated in Google Keep!');
      localStorage.setItem('nextShopTitle', 'Next Shop List');
    } catch (error) {
      console.error('Error updating Google Keep:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shopping-list">
      <h1>Shopping List</h1>
      <label>Select a list for testing: </label>
      <select value={selectedTitle} onChange={handleTitleChange}>
        <option value="" disabled>Select a list</option>
        {titles.map((title, index) => (
          <option key={index} value={title}>{title}</option>
        ))}
      </select>
      {listFetched && (
        <>
          <h2>Next Shop List</h2>
          <ul>
            {nextShopItems.map((item, index) => (
              <li key={index}>
                <div className="item-details">
                  {item.name}
                </div>
                <div className="item-actions">
                  <button onClick={() => handleMoveToBacklog(index)}>Move to Backlog</button>
                </div>
              </li>
            ))}
          </ul>
          <h2>Backlog</h2>
          <ul>
            {backlogItems.map((item, index) => (
              <li key={index}>
                <div className="item-details">
                  {item.name}
                </div>
                <div className="item-actions">
                  <button onClick={() => handleMoveToNextShopList(index)}>Move to Next Shop List</button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={pushToGoogleKeep}>Push to Google Keep</button>
        </>
      )}
    </div>
  );
};

export default ShoppingList;
