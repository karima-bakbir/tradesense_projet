import axios from 'axios';

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout to allow for slower responses
  withCredentials: true, // Important for authentication cookies/sessions
});

// Add request interceptor to include auth token and log requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    // Log more detailed error information for debugging
    if (error.request) {
      console.error('Request details:', {
        url: error.request.responseURL,
        method: error.request.method,
        status: error.request.status,
        statusText: error.request.statusText
      });
    }
    return Promise.reject(error);
  }
);

// User Authentication
export const registerUser = (userData) => {
  return api.post('/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/login', credentials);
};

export const getProfile = () => {
  return api.get('/profile');
};

// Challenges
export const createChallenge = (userId) => {
  return api.post('/challenge/create', { user_id: userId });
};

export const getChallenge = (challengeId) => {
  return api.get(`/challenge/${challengeId}`);
};

export const getAllChallenges = () => {
  return api.get('/challenges');
};

export const updateChallengeBalance = (challengeId, newBalance) => {
  return api.put(`/challenge/${challengeId}/update-balance`, { new_balance: newBalance });
};

export const getUserChallenges = (userId) => {
  return api.get(`/user/${userId}/challenges`);
};

export const getActiveChallenge = async (userId) => {
  const response = await api.get(`/user/${userId}/challenges`);
  const activeChallenge = response.data.challenges.find(challenge => challenge.status === 'active');
  return activeChallenge || null;
};

// Trades
export const createTrade = (tradeData) => {
  return api.post('/trade/create', tradeData);
};

export const getTrade = (tradeId) => {
  return api.get(`/trade/${tradeId}`);
};

export const getChallengeTrades = (challengeId) => {
  return api.get(`/challenge/${challengeId}/trades`);
};

// Real-time Prices
export const getPrice = (ticker) => {
  return api.get(`/api/price/${ticker}`);
};

export const getMultiplePrices = (tickers) => {
  return api.post('/api/prices', { tickers });
};

export const getPriceInfo = (ticker) => {
  return api.get(`/api/price/${ticker}/info`);
};

// AI Signals
export const getAISignal = async (ticker) => {
  try {
    const response = await api.get(`/ai/signals/${ticker}`);
    return response;
  } catch (error) {
    console.error(`Error fetching AI signal for ${ticker}:`, error);
    throw error;
  }
};

export const getMultipleAISignals = async (tickers) => {
  try {
    const response = await api.post('/ai/signals', { tickers });
    return response;
  } catch (error) {
    console.error('Error fetching multiple AI signals:', error);
    throw error;
  }
};

export const getPopularAISignals = async () => {
  try {
    const response = await api.get('/ai/signals/popular');
    return response;
  } catch (error) {
    console.error('Error fetching popular AI signals:', error);
    throw error;
  }
};

export const getDetailedRecommendation = async (ticker) => {
  try {
    const response = await api.get(`/ai/recommendations/${ticker}`);
    return response;
  } catch (error) {
    console.error(`Error fetching detailed recommendation for ${ticker}:`, error);
    throw error;
  }
};

// News
export const getFinancialNews = () => {
  return api.get('/api/news/financial');
};


export default api;