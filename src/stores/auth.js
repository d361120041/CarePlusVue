// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "@/plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    userName: "",
    storeReady: false, // ✅ 補上這一行！
  }),
  actions: {
    // 檢查使用者是否已登入
    async checkAuth() {
      try {
        const res = await axios.get("/user/profile");
        this.isAuthenticated = true;
        this.userName = res.data.userName;
      } catch {
        this.isAuthenticated = false;
        this.userName = "";
      }
    },
    // 登出
    async logout() {
      try {
        await axios.post("/user/logout");
      } catch {
        // 忽略錯誤
      } finally {
        this.isAuthenticated = false;
        this.userName = "";
      }
    },
  },
  persist: true,
});
