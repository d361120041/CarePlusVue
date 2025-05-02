<template>
    <div class="reset-password-container">
      <h2>🔒 重設密碼</h2>
      <form @submit.prevent="handleResetPassword">
        <div>
          <label>新密碼：</label>
          <input v-model="newPassword" type="password" required />
        </div>
        <button type="submit">送出</button>
      </form>
  
      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from '@/plugins/axios'
  
  const newPassword = ref('')
  const message = ref('')
  const route = useRoute()
  const router = useRouter()
  
  const token = ref('')
  
  onMounted(() => {
    token.value = route.query.token || ''
    if (!token.value) {
      message.value = '❌ 找不到驗證 token，請重新點擊信件中的連結'
    }
  })
  
  const handleResetPassword = async () => {
    if (!token.value) {
      message.value = '❌ 無效的 token'
      return
    }
  
    try {
      await axios.post('/api/auth/reset-password', {
        token: token.value,
        newPassword: newPassword.value
      })
      message.value = '✅ 密碼重設成功！即將導回登入頁'
      setTimeout(() => {
        router.push('/caregiverLogin')
      }, 3000)
    } catch (error) {
      console.error(error)
      message.value = error.response?.data || '❌ 發生錯誤，請稍後再試'
    }
  }
  </script>
  
  <style scoped>
  .reset-password-container {
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
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .message {
    margin-top: 1rem;
    color: green;
  }
  </style>
  