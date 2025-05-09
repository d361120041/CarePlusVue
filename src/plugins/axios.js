import axios from "axios";

const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 如果是取得照顧者照片
    if (config.url === "/api/caregivers/photo") {
      config.responseType = "blob";
    }

    return config;
  },
  (error) => Promise.reject(error)
);
//yuuhou的修改

export default myAxios;
