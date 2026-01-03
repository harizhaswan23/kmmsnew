import http from "./http";

// GET all activities
export const getActivities = async () => {
  const res = await http.get("/activities");
  return res.data;
};

// ADD new activity
export const addActivityApi = async (data) => {
  const res = await http.post("/activities", data);
  return res.data;
};

// DELETE activity
export const deleteActivityApi = async (id) => {
  const res = await http.delete(`/activities/${id}`);
  return res.data;
};
