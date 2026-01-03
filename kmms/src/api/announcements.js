import api from "./http";

export const getAnnouncements = async () => {
  const res = await api.get("/announcements");
  return res.data;
};

export const addAnnouncement = async (data) => {
  const res = await api.post("/announcements", data);
  return res.data;
};

export const deleteAnnouncement = async (id) => {
  const res = await api.delete(`/announcements/${id}`);
  return res.data;
};
