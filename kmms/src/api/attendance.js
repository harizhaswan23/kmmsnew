import http from "./http";
import api from "./http";

export const getAttendance = async () => {
  const res = await api.get("/attendance");
  return res.data;
};

// GET attendance for specific date
export const getAttendanceByDate = async (date) => {
  const res = await http.get(`/attendance/${date}`);
  return res.data;
};

// MARK attendance
export const markAttendanceApi = async (studentId, data) => {
  const res = await http.post(`/attendance/${studentId}`, data);
  return res.data;
};
