import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  biometricLogin: (data) => api.post('/auth/biometric-login', data),
  me: () => api.get('/auth/me'),
};

export const adminService = {
  login: (data) => api.post('/admin/login', data),
  createVoter: (data) => api.post('/admin/create-voter', data),
  getVoters: () => api.get('/admin/voters'),
  enrollBiometric: (data) => api.post('/admin/enroll-biometric', data),
  getLogs: () => api.get('/admin/logs'),
  createElection: (data) => api.post('/admin/elections', data),
  getElections: () => api.get('/admin/elections'),
  updateElectionStatus: (id, status) => api.patch(`/admin/elections/${id}`, { status }),
};

export const voteService = {
  castVote: (data) => api.post('/vote', data),
  getElections: () => api.get('/vote/elections'),
  getResults: (election_id) => api.get(`/vote/results/${election_id}`),
  getActiveElections: () => api.get('/vote/elections?status=active'),
  verifyReceipt: (transaction_id) => api.get(`/vote/verify/${transaction_id}`),
};

export default api;
