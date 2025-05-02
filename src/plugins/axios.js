import axios from "axios";

const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 攔截從後端傳回的所有403狀態
myAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log("interceptors error", error);
    if (
      error.response &&
      error.response.status &&
      error.response.status === 403
    ) {
      window.location.href = "/403";
    }
    return Promise.reject(error);
  }
);

//yuuhou的新增
myAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 你自己的 JWT 儲存位置
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
//yuuhou的修改

export default myAxios;
