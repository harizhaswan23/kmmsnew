import api from "./http";

export const getClasses = async () => {
  const res = await api.get("/classes");
  return res.data;
};
