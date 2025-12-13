// frontend/src/api.js
import axios from "axios";

// Base API URL from environment variables
const API_BASE = process.env.REACT_APP_API_URL;

if (!API_BASE) {
  console.error("❌ ERROR: REACT_APP_API_URL is missing in .env file");
}

/* ------------------------------------------------------
 📰 HELPER FUNCTION
------------------------------------------------------ */
const apiGet = async (path) => {
  try {
    const res = await axios.get(`${API_BASE}${path}`);
    return res.data;
  } catch (err) {
    console.error(`❌ GET ${path} error:`, err.message);
    throw err;
  }
};

const apiPost = async (path, data, config = {}) => {
  try {
    const res = await axios.post(`${API_BASE}${path}`, data, config);
    return res.data;
  } catch (err) {
    console.error(`❌ POST ${path} error:`, err.message);
    throw err;
  }
};

/* ------------------------------------------------------
 📰 MEDIA ENDPOINTS
------------------------------------------------------ */
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

  return apiPost("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const viewMedia = async ({ mediaId, viewerAccountId }) => {
  return apiPost("/view", { mediaId, viewerAccountId });
};

/* ------------------------------------------------------
 ❓ QUIZ ENDPOINTS
------------------------------------------------------ */
export const submitQuiz = async ({ userId, quizId, answers }) => {
  return apiPost("/answer", { userId, quizId, answers });
};

/* ------------------------------------------------------
 🎮 GAME ENDPOINTS
------------------------------------------------------ */
export const submitGame = async ({ userId, gameId, score }) => {
  return apiPost("/game/complete", { userId, gameId, score });
};

/* ------------------------------------------------------
 💸 DONATION ENDPOINTS
------------------------------------------------------ */
export const submitDonation = async ({ donorId, amount, currency }) => {
  return apiPost("/donate", { donorId, amount, currency });
};

/* ------------------------------------------------------
 🧾 REFERRAL ENDPOINTS
------------------------------------------------------ */
export const submitReferral = async ({ referrerId, newUserId }) => {
  return apiPost("/referral", { referrerId, newUserId });
};

/* ------------------------------------------------------
 🏆 LEADERBOARD ENDPOINTS
------------------------------------------------------ */
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