// apiClient.js (confirm clearly)
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log(baseURL)

const apiClient = axios.create({
  baseURL,
  withCredentials: true
});

export default apiClient;
