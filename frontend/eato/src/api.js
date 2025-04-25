import axios from "axios";
import { setAuthToken, clearAuthToken } from "./services/api";

const API = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API,
});

// Login function
export async function login(email, password) {
  try {
    const response = await API.post('/login', { email, password });
    const token = response.data.token;

    clearAuthToken(); // Clear old token
    setAuthToken(token); // Store the new token in localStorage

    return token;
  } catch (err) {
    console.error('Login error:', err.response?.data?.msg || err.message);
    throw new Error(err.response?.data?.msg || 'Login failed');
  }
}

export default API;
