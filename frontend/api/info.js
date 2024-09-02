import axios from 'axios';

const getUserInfo = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await axios.get('http://localhost:8000/api/users/info', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data.message || error.message);
  }
};

export default getUserInfo;
