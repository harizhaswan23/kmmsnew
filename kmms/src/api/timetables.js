import api from "./http";

export const getTimetables = async (params = {}) => {
  const res = await api.get("/timetables", { params });
  return res.data;
};

export const createTimetable = async (data) => {
  const res = await api.post("/timetables", data);
  return res.data;
};

export const updateTimetable = async (id, data) => {
  const res = await api.put(`/timetables/${id}`, data);
  return res.data;
};

export const deleteTimetable = async (id) => {
  const res = await api.delete(`/timetables/${id}`);
  return res.data;
};
