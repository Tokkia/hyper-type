import axios from 'axios';

export async function submitResult(username, wpm, accuracy, userId = null) {
  try {
    await axios.post('http://localhost:5000/api/results', {
      username,
      wpm,
      accuracy,
      userId
    });
    console.log('Result submitted successfully');
  } catch (err) {
    console.error('Error submitting result:', err);
  }
}

//Includes userId when available