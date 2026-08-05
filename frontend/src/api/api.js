export const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  return res;
};