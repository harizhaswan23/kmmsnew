import http from "./http";  // your axios instance
import api from "./http";

export async function loginUser(data) {
  const res = await http.post("/auth/login", data);
  return res.data;
};

export const updatePassword = async (data) => {
  const res = await api.put("/auth/update-password", data);
  return res.data;
};