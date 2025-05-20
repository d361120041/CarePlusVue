<template>
    <div class="admin-login">
      <div class="login-box">
        <h2>系統管理員登入</h2>
  
        <!-- 帳號欄位 -->
        <input v-model="email" type="email" placeholder="帳號" />
        <p v-if="emailError" class="error">{{ emailError }}</p>
  
        <!-- 密碼欄位 -->
        <input v-model="password" type="password" placeholder="密碼" />
        <p v-if="passwordError" class="error">{{ passwordError }}</p>
  
        <!-- 通用錯誤 -->
        <p v-if="generalError" class="error">{{ generalError }}</p>
  
        <!-- 登入按鈕 -->
        <button @click="login">登入</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useCaregiverAuth } from "@/stores/useCaregiverAuth";
  
  const email = ref("");
  const password = ref("");
  const emailError = ref("");
  const passwordError = ref("");
  const generalError = ref("");
  
  const router = useRouter();
  const authStore = useCaregiverAuth();
  
  onMounted(() => {
    if (authStore.token && authStore.role === "ADMIN") {
      router.push("/admin");
    }
  });
  
  const login = async () => {
    emailError.value = "";
    passwordError.value = "";
    generalError.value = "";
  
    if (!email.value.trim()) {
      emailError.value = "請輸入帳號（Email）";
      return;
    }
  
    if (!password.value.trim()) {
      passwordError.value = "請輸入密碼";
      return;
    }
  
    try {
      await authStore.login(email.value, password.value);
  
      if (authStore.role === "ADMIN") {
        router.push("/admin");
      } else {
        generalError.value = "此帳號非超級使用者，請改用照顧者登入";
      }
    } catch (error) {
      generalError.value = "帳號或密碼錯誤";
    }
  };
  
  </script>
  
  <style scoped>
  .admin-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('@/assets/yuuhou/admin-bg.jpg'); /* 換成你自己的管理者圖片 */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .login-box {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 350px;
  }
  
  .login-box h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  input {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  </style>