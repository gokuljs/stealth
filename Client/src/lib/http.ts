// src/api.js
import axios from 'axios';
import { env } from './environment';

const http = axios.create({
  baseURL: env.VITE_API_BASE_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important for session-based auth
});

export default http;
