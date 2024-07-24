import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Preferences = ({ userId }) => {
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState({ originalItem: '', mappedItem: '' });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`/api/preferences/${userId}`);
        setPreferences(response.data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPreference({ ...newPreference, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/preferences', { userId, ...newPreference });
      setPreferences([...preferences, response.data]);
      setNewPreference({ originalItem: '', mappedItem: '' });
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  return (
    <div>
      <h1>Preferences</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="originalItem"
          placeholder="Original Item"
          value={newPreference.originalItem}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="mappedItem"
          placeholder="Mapped Item"
          value={newPreference.mappedItem}
          onChange={handleInputChange}
        />
        <button type="submit">Save Preference</button>
      </form>
      <ul>
        {preferences.map((preference, index) => (
          <li key={index}>{preference.originalItem} -> {preference.mappedItem}</li>
        ))}
      </ul>
    </div>
  );
};

export default Preferences;
