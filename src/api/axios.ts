// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
//   withCredentials: true, // agar cookie-based auth hai
// });

// // JWT token localStorage se bhejna (tumhare auth ke hisaab se adjust karo)
// api.interceptors.request.use((config:any) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;



import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  withCredentials: true, // agar cookie bhi use hoti hai
});

// hk_token localStorage se → Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;