<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2>🔒 忘記密碼</h2>
      <form @submit.prevent="handleForgotPassword">
        <input 
          v-model="email" 
          type="email" 
          placeholder="📩 請輸入您的 Email" 
          required 
        />
        <button type="submit">送出重設密碼連結</button>
      </form>

      <router-link to="/caregiverLogin">
        <button class="back-button">回到登入頁面</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'
import Swal from "sweetalert2"

const email = ref('')

const handleForgotPassword = async () => {
  try {
    await axios.post('/api/auth/forgot-password', {
      email: email.value
    })

    // ✅ 發送成功提示
    Swal.fire({
      title: "📧 郵件已發送",
      text: "如果該信箱存在，我們已寄出重設密碼信件！請檢查您的收件匣或垃圾郵件。",
      icon: "success",
      confirmButtonText: "了解",
      confirmButtonColor: "#3085d6",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    })

    // ✅ 清空輸入欄位
    email.value = ''
  } catch (error) {
    console.error(error)

    // ✅ 發送失敗提示
    Swal.fire({
      title: "❌ 發送失敗",
      text: error.response?.data || "發送失敗，請稍後再試。",
      icon: "error",
      confirmButtonText: "再試一次",
      confirmButtonColor: "#d33",
      showClass: {
        popup: "animate__animated animate__shakeX",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    })
  }
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.forgot-password-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.forgot-password-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.forgot-password-card h2 {
  font-size: 2rem;
  color: #305f72;
  margin-bottom: 20px;
}

.forgot-password-card input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 1.2rem;
  color: #333;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.forgot-password-card input:focus {
  border-color: #5aa9e6;
  box-shadow: 0 0 10px rgba(90, 169, 230, 0.4);
  outline: none;
}

.forgot-password-card button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, #5aa9e6, #82c0cc);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(90, 169, 230, 0.3);
  transition: background 0.3s, transform 0.2s;
}

.forgot-password-card button:hover {
  background: linear-gradient(90deg, #82c0cc, #5aa9e6);
  transform: scale(1.02);
}

.back-button {
  width: 100%;
  margin-top: 15px;
  padding: 15px;
  background-color: #aaa;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.back-button:hover {
  background-color: #888;
  transform: scale(1.02);
}
</style>
