<template>
  <div class="login">
    <h2>使用者登入</h2>

    <input v-model="userAccount" placeholder="帳號" />
    <input v-model="password" type="password" placeholder="密碼" />

    <button @click="login">登入</button>

    <div class="extra-buttons">
      <button class="register" @click="goRegister">註冊</button>
      <button class="forgot" @click="goForgot">忘記密碼</button>
    </div>
  </div>
</template>

<script setup>
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";
import { useAuthStore } from "@/stores/auth";

const userAccount = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();

const login = async () => {
  try {
    // 把使用者輸入的帳密丟給後端
    await axios.post("/user/login", {
      userAccount: userAccount.value,
      userPassword: password.value,
    });

    // 呼叫 Pinia auth store 裡的 checkAuth() 方法（可保留）
    await auth.checkAuth();

    // 導向首頁並強制刷新頁面
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    sessionStorage.removeItem("redirectAfterLogin");
    const target = redirectPath || "/";
    router.push(target).then(() => {
      window.location.reload();
    });
  } catch (error) {
    if (error.response && error.response.data) {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: error.response.data,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "無法連線後端",
      });
    }
  }
};

const goRegister = () => {
  router.push("/userregister");
};

const goForgot = () => {
  router.push("/forgotPassword");
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.login input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
}
button {
  width: 100%;
  padding: 0.6rem;
  background-color: #ff8c42;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

/* 額外功能按鈕 */
.extra-buttons {
  gap: 1rem;
  display: flex;
  justify-content: space-between;
}
.extra-buttons .register {
  background-color: #114425;
}
.extra-buttons .forgot {
  background-color: #6e6259;
}
</style>
