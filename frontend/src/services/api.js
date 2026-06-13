// frontend/src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "../config";

// --------------------------------------------------------------
// 1. Axios instance (from previous version)
// --------------------------------------------------------------
if (!API_BASE_URL) {
  console.error("❌ ERROR: API_BASE_URL is missing in config.js");
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor – attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --------------------------------------------------------------
// 2. Helper functions (using apiClient)
// --------------------------------------------------------------
const apiGet = async (path) => {
  const res = await apiClient.get(path);
  return res.data;
};

const apiPost = async (path, data, config = {}) => {
  const res = await apiClient.post(path, data, config);
  return res.data;
};

// --------------------------------------------------------------
// 3. Specific API endpoints (unchanged from previous version)
// --------------------------------------------------------------

// ---------- AUTHENTICATION ----------
export const register = async ({ username, email, password }) => {
  const data = await apiPost("/auth/register", { username, email, password });
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

export const login = async ({ email, password }) => {
  const data = await apiPost("/auth/login", { email, password });
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getCurrentUser = async () => {
  const data = await apiGet("/me");
  return data.user;
};

// ---------- MEDIA ----------
export const fetchMedia = async () => {
  const data = await apiGet("/media");
  return data.items || [];
};

export const uploadMedia = async ({ file, title, description, uploaderId }) => {
  if (!file) throw new Error("No file selected");
  const form = new FormData();
  form.append("media", file);
  form.append("title", title || "Untitled");
  form.append("description", description);
  form.append("uploaderAccountId", uploaderId);
  return apiPost("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
};

export const viewMedia = async ({ mediaId, viewerAccountId }) => {
  return apiPost("/view", { mediaId, viewerAccountId });
};

// ---------- QUIZ ----------
export const submitQuiz = async ({ userId, quizId, answers }) => {
  return apiPost("/answer", { userId, quizId, answers });
};

// ---------- GAME ----------
export const submitGame = async ({ userId, gameId, score }) => {
  return apiPost("/game/complete", { userId, gameId, score });
};

// ---------- DONATION ----------
export const submitDonation = async ({ donorId, amount, currency }) => {
  return apiPost("/donate", { donorId, amount, currency });
};

// ---------- REFERRAL ----------
export const submitReferral = async ({ referrerId, newUserId }) => {
  return apiPost("/referral", { referrerId, newUserId });
};

// ---------- LEADERBOARD ----------
export const fetchLeaderboard = async () => {
  const data = await apiGet("/leaderboard");
  return data.items || [];
};

export const fetchUserBalance = async (userId) => {
  const data = await apiGet(`/leaderboard/userBalance/${userId}`);
  return data.balance || 0;
};

export const updateLeaderboard = async ({ userId, points }) => {
  return apiPost("/leaderboard/update", { userId, points });
};

export const updateUserBalance = async ({ userId, amount }) => {
  return apiPost("/leaderboard/updateBalance", { userId, amount });
};

// --------------------------------------------------------------
// 4. Generic fetch‑style function (default export)
//    Uses the same axios instance, but mimics the new version's API.
// --------------------------------------------------------------
const api = async (endpoint, options = {}) => {
  const method = options.method || "GET";
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await apiClient({
      url: endpoint,
      method,
      headers,
      data: options.body ? JSON.parse(options.body) : undefined,
      params: options.params,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    throw new Error(message);
  }
};

export default api;

// --------------------------------------------------------------
// 5. Default API object (for convenience)
// --------------------------------------------------------------
export const API = {
  register,
  login,
  logout,
  getCurrentUser,
  fetchMedia,
  uploadMedia,
  viewMedia,
  submitQuiz,
  submitGame,
  submitDonation,
  submitReferral,
  fetchLeaderboard,
  fetchUserBalance,
  updateLeaderboard,
  updateUserBalance,
  apiClient,
};