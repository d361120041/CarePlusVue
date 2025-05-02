// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "@/plugins/axios";

//下面寫的就是發送通行證以及驗證的過程
//建立一個 叫做 auth 的 Pinia Store，它是用來「記住使用者登入狀態」的工具，
// 讓整個網站的任何元件都可以知道使用者有沒有登入、名字是什麼。
export const useAuthStore = defineStore("auth", {
  //設定一些「要被記住的資料」：
  // isAuthenticated: 目前是否有登入（預設是 false）
  // userName: 如果有登入，要記住使用者的名字
  // storeReady: 我們自己加的開關，代表「是否已經驗證過登入狀態」
  state: () => ({
    isAuthenticated: false,
    userName: "",
    storeReady: false,
  }),
  //「可以改變這些資料」的方法。
  actions: {
    // 每次幹任何事情都要檢查使用者是否已登入
    async checkAuth() {
      try {
        const res = await axios.get("/user/profile");
        //如果200 就改下面這些
        this.isAuthenticated = true;
        this.userName = res.data.userName;
      } catch {
        //如果失敗 就是下面這些
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

  // 請幫我把 state 裡的資料存在 localStorage
  // 這樣我重新整理頁面，isAuthenticated 和 userName 不會消失
  persist: true,
});
