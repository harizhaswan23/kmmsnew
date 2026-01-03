// src/api/students.js
import api from "./http";

export const getStudents = async () => {
  const res = await api.get("/students");
  return res.data;
};

export const addStudent = async (student) => {
  const res = await api.post("/students", student);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};

export const updateStudent = async (id, data) => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};
