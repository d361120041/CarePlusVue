<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <h2> 重設密碼</h2>
      <form @submit.prevent="handleResetPassword">
        <input 
          v-model="newPassword" 
          type="password" 
          placeholder="🔑 請輸入新密碼" 
          required 
        />
        <button type="submit">送出</button>
      </form>

      <router-link to="/caregiverLogin">
        <button class="back-button">回到登入頁面</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import Swal from "sweetalert2"

const newPassword = ref('')
const route = useRoute()
const router = useRouter()

const token = ref('')

onMounted(() => {
  token.value = route.query.token || ''
  if (!token.value) {
    Swal.fire({
      title: "❌ 無效的 Token",
      text: "找不到驗證 token，請重新點擊信件中的連結",
      icon: "error",
      confirmButtonText: "了解",
      confirmButtonColor: "#d33",
    })
  }
})

const handleResetPassword = async () => {
  if (!token.value) {
    Swal.fire({
      title: "❌ 無效的 Token",
      text: "請重新點擊信件中的連結。",
      icon: "error",
      confirmButtonText: "了解",
      confirmButtonColor: "#d33",
    })
    return
  }

  try {
    await axios.post('/api/auth/reset-password', {
      token: token.value,
      newPassword: newPassword.value
    })

    Swal.fire({
      title: "✅ 密碼重設成功！",
      text: "即將導回登入頁面。",
      icon: "success",
      confirmButtonText: "了解",
      confirmButtonColor: "#3085d6",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then(() => {
      router.push('/caregiverLogin')
    })

  } catch (error) {
    console.error(error)
    Swal.fire({
      title: "❌ 發生錯誤",
      text: error.response?.data || "請稍後再試。",
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
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.reset-password-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.reset-password-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.reset-password-card h2 {
  font-size: 2rem;
  color: #305f72;
  margin-bottom: 20px;
}

.reset-password-card input {
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

.reset-password-card input:focus {
  border-color: #5aa9e6;
  box-shadow: 0 0 10px rgba(90, 169, 230, 0.4);
  outline: none;
}

.reset-password-card button {
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

.reset-password-card button:hover {
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
