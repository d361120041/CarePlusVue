<template>
  <div class="verify-container">
    <div class="verify-card">
      <h2>🔑 輸入驗證碼</h2>
      <p>✨ 我們已經發送驗證碼到您的信箱，請輸入驗證碼以完成註冊。</p>

      <input 
        v-model="verificationCode" 
        type="text" 
        placeholder="📩 請輸入驗證碼" 
        class="verify-input"
      />
      <button @click="handleVerifyCode" class="verify-button">確認</button>

      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import Swal from "sweetalert2";
const router = useRouter()
const route = useRoute()

const email = ref('')
const verificationCode = ref('')
const message = ref('')

// ✅ 取得 Email 從 URL 參數
onMounted(() => {
  email.value = route.query.email || ''
  if (!email.value) {
    message.value = '❌ 錯誤：找不到註冊 Email！'
  }
})

// ✅ 確認驗證碼
const handleVerifyCode = async () => {
  try {
    const response = await axios.post('/api/auth/verify', {
      email: email.value,
      verificationCode: verificationCode.value
    });

    // ✅ 驗證成功
    Swal.fire({
      title: "🎉 驗證成功！",
      text: "您的帳號已啟用，可以開始使用了！",
      icon: "success",
      confirmButtonText: "前往登入",
      confirmButtonColor: "#3085d6",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then(() => {
      router.push('/login-caregiver');
    });

  } catch (error) {
    // ✅ 驗證失敗
    Swal.fire({
      title: "⚠️ 驗證失敗",
      text: error.response?.data || "驗證碼錯誤，請重新嘗試。",
      icon: "error",
      confirmButtonText: "再試一次",
      confirmButtonColor: "#d33",
      showClass: {
        popup: "animate__animated animate__shakeX",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
};
</script>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.verify-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.verify-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.verify-card h2 {
  font-size: 2rem;
  color: #305f72;
  margin-bottom: 20px;
}

.verify-card p {
  font-size: 1rem;
  color: #63707d;
  margin-bottom: 30px;
  line-height: 1.6;
}

.verify-input {
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

.verify-input:focus {
  border-color: #5aa9e6;
  box-shadow: 0 0 10px rgba(90, 169, 230, 0.4);
  outline: none;
}

.verify-button {
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

.verify-button:hover {
  background: linear-gradient(90deg, #82c0cc, #5aa9e6);
  transform: scale(1.02);
}

.message {
  margin-top: 20px;
  color: #305f72;
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
