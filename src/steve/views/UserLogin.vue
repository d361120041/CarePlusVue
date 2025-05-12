<template>
  <div class="btn-group mb-3">
    <button
      class="btn"
      :class="currentTab === 'courses' ? 'btn-fav' : 'btn-outline-fav'"
      @click="currentTab = 'courses'"
    >
      課程
    </button>
    <button
      class="btn"
      :class="currentTab === 'employees' ? 'btn-fav' : 'btn-outline-fav'"
      @click="currentTab = 'employees'"
    >
      照護者
    </button>
  </div>
</template>

<script setup>
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
    // 登入成功後自動跳轉到先前想去的頁面（若有）
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    sessionStorage.removeItem("redirectAfterLogin");

    const target = redirectPath || "/";
    router.push(target).then(() => {
      window.location.reload();
    });
  } catch (error) {
    if (error.response && error.response.data) {
      alert("登入失敗：" + error.response.data);
    } else {
      alert("登入失敗（無法連線後端）");
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
.btn-fav {
  background-color: #4db6ac;
  color: #fff;
  border: 1px solid #4db6ac;
}

.btn-fav:hover {
  background-color: #3ba99e;
  border-color: #3ba99e;
}

.btn-outline-fav {
  background-color: transparent;
  color: #4db6ac;
  border: 1px solid #4db6ac;
}

.btn-outline-fav:hover {
  background-color: #e6f5f3;
}

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
  background-color: #4db6ac;
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
  gap: 1rem;
  background-color: #3e9bdc;
}
.extra-buttons .forgot {
  gap: 1rem;
  background-color: #ff9999;
}
</style>
