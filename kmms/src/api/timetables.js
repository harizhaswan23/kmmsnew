import api from "./http";

// ADMIN
export const createTimetable = (data) =>
  api.post("/timetables", data).then((res) => res.data);

export const getTimetableByClass = async (classId) => {
  const res = await api.get(`/timetables?classId=${classId}`);
  return res.data;
};



// TEACHER
export const getTeacherTimetable = async () => {
  const res = await api.get("/timetables/teacher");
  return res.data;
};


// PARENT
export const getParentTimetableToday = async () => {
  const res = await api.get("/timetables/parent/today");
  return res.data;
};

