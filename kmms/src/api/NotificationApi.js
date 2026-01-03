import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL + '/api' });

export const fetchNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.post(`/notifications/${id}/read`);
export const markAllRead = () => api.post('/notifications/read-all');
