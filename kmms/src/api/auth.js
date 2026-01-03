import http from "./http";  // your axios instance

export async function loginUser(data) {
  const res = await http.post("/auth/login", data);
  return res.data;
}
