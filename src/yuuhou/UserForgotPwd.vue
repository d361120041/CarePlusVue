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
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from '@/plugins/axios' // 直接用你的 axios 設定！
  
  const email = ref('')
  const message = ref('')
  
  const handleForgotPassword = async () => {
    try {
      await axios.post('/api/auth/forgot-password', {
        email: email.value
      })
      message.value = '✅ 如果該信箱存在，我們已寄出重設密碼信件！'
      email.value = '' // 清空表單
    } catch (error) {
      console.error(error)
      message.value = '❌ 發生錯誤，請稍後再試'
    }
  }
  </script>
  
  <style scoped>
  .forgot-password-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .message {
    margin-top: 10px;
    color: green;
  }
  </style>
  