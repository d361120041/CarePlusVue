// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "@/plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    userPhotoUrl: null, // ✅ 加入照片 URL
    storeReady: false,
  }),
  actions: {
    async checkAuth() {
      try {
        const res = await axios.get("/user/profile");
        this.isAuthenticated = true;
        this.user = res.data;
        await this.fetchUserPhoto(); // ✅ 登入時順便抓頭貼
      } catch {
        this.isAuthenticated = false;
        this.user = null;
        this.userPhotoUrl = null;
      }
    },
    async fetchUserPhoto() {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        const res = await fetch(`${baseUrl}/user/profile-picture`, {
          credentials: "include",
        });
        if (res.ok) {
          const blob = await res.blob();
          this.userPhotoUrl = URL.createObjectURL(blob); // ✅ 存到 state
        } else {
          this.userPhotoUrl = null;
        }
      } catch {
        this.userPhotoUrl = null;
      }
    },
    async logout() {
      try {
        await axios.post("/user/logout");
      } catch {}
      this.isAuthenticated = false;
      this.user = null;
      this.userPhotoUrl = null;
    },
  },
  persist: true,
});

//下面寫的就是發送通行證以及驗證的過程
//建立一個 叫做 auth 的 Pinia Store，它是用來「記住使用者登入狀態」的工具，
// 讓整個網站的任何元件都可以知道使用者有沒有登入、名字是什麼。
// export const useAuthStore = defineStore("auth", {
//   //設定一些「要被記住的資料」：
//   // isAuthenticated: 目前是否有登入（預設是 false）
//   // userName: 如果有登入，要記住使用者的名字
//   // storeReady: 我們自己加的開關，代表「是否已經驗證過登入狀態」
//   state: () => ({
//     isAuthenticated: false,
//     userName: "",
//     storeReady: false,
//   }),
//   //「可以改變這些資料」的方法。
//   actions: {
//     // 每次幹任何事情都要檢查使用者是否已登入
//     async checkAuth() {
//       try {
//         const res = await axios.get("/user/profile");
//         //如果200 就改下面這些
//         this.isAuthenticated = true;
//         this.userName = res.data.userName;
//       } catch {
//         //如果失敗 就是下面這些
//         this.isAuthenticated = false;
//         this.userName = "";
//       }
//     },
//     // 登出
//     async logout() {
//       try {
//         await axios.post("/user/logout");
//       } catch {
//         // 忽略錯誤
//       } finally {
//         this.isAuthenticated = false;
//         this.userName = "";
//       }
//     },
//   },

//   // 請幫我把 state 裡的資料存在 localStorage
//   // 這樣我重新整理頁面，isAuthenticated 和 userName 不會消失
//   persist: true,
// });
