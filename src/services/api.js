export const login = async (credentials) => {
  const response = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
  }
  
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch('http://localhost:3001/users/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
  }
  
  return response.json();
};

export const getRandomWord = async (level) => {
  const token = localStorage.getItem('token');
  console.log("Sending request with token:", token); // Ajoutez ce log
  
  const response = await fetch(`http://localhost:3001/words/random?level=${level}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log("Response status:", response.status); // Ajoutez ce log
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch word: ${error}`);
  }
  
  return response.json();
};

export const updateUserScore = async (userId, newScore) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ score: newScore }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update score');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
};