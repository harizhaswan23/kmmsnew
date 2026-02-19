import http from "./http";

export const submitLeaveRequest = async (payload) => {
  const res = await http.post("/sick-leave", payload);
  return res.data;
};

export const getMyLeaves = async () => {
  const res = await http.get("/sick-leave/my-leaves");
  return res.data;
};

export const getAllLeaves = async () => {
  const res = await http.get("/sick-leave/all");
  return res.data;
};

export const updateLeaveStatus = async (id, action) => {
  // action: 'approve' | 'reject'
  const res = await http.post(`/sick-leave/${id}/review`, { action });
  return res.data;
};
