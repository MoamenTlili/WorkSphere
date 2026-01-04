import axios from 'axios';

const API_URL = 'http://localhost:8000/api/check-content';

export const checkForHateSpeech = async (text, threshold = 0.5) => {
  try {
    const response = await axios.post(API_URL, {
      text,
      threshold
    });
    return response.data;
  } catch (error) {
    console.error('Error checking content:', error);
    throw error;
  }
};