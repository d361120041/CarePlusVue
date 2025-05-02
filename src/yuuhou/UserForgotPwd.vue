<template>
  <div class="forgot-password-container">
    <h2>忘記密碼</h2>
    <form @submit.prevent="handleForgotPassword">
      <div>
        <label>Email：</label>
        <input v-model="email" type="email" required />
      </div>
      <button type="submit">送出重設密碼連結</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
    <router-link to="/caregiverLogin">
      <button class="back-button">回到登入頁面</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '@/plugins/axios'

const email = ref('')
const message = ref('')

const handleForgotPassword = async () => {
  try {
    await axios.post('/api/auth/forgot-password', {
      email: email.value
    })
    message.value = '✅ 如果該信箱存在，我們已寄出重設密碼信件！'
    email.value = ''
  } catch (error) {
    console.error(error)
    message.value = error.response?.data || '❌ 發送失敗，請稍後再試'
  }
}
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 20px;
  text-align: center;
}

input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.message {
  margin-top: 10px;
  color: green;
}

.back-button {
  margin-top: 1.5rem;
  background-color: #6c757d;
}
</style>
