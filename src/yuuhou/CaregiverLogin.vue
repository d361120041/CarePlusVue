<template>
    <div class="login">
      <h2>照顧者登入</h2>
      <input v-model="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="密碼">
      <button @click="login">登入</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const router = useRouter()
  
  const login = () => {
    if (email.value === 'daniel@example.com' && password.value === '123456') {
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/caregiver')
    } else {
      alert('帳號或密碼錯誤')
    }
  }
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
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  