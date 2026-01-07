import api from "./http";

export const getAttendance = async (date, classId) => {
  const res = await api.get(`/attendance?date=${date}&classId=${classId}`);
  return res.data;
};

export const saveAttendance = async (data) => {
  const res = await api.post("/attendance", data);
  return res.data;
};

// NEW FUNCTION
export const getMonthlyStats = async (classId, month) => {
  const res = await api.get(`/attendance/stats?classId=${classId}&month=${month}`);
  return res.data;
};