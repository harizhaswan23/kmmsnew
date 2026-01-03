import api from "./http";

export const getTeachers = async () => {
  const res = await api.get("/teachers");
  return res.data;
};

export const addTeacher = async (teacher) => {
  const res = await api.post("/teachers", teacher);
  return res.data;
};

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};
