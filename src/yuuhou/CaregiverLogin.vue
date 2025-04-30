<template>
  <div class="login">
    <h2>員工登入</h2>

    <!-- ✅ 輸入欄位 -->
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="密碼" />

    <!-- ✅ 登入按鈕 -->
    <button @click="login">登入</button>

    <!-- ✅ 額外功能按鈕 -->
    <div class="extra-buttons">
      <button class="register" @click="goRegister">註冊照顧者</button>
      <button class="forgot" @click="goForgot">忘記密碼</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/useAuth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuth()

const login = async () => {
  try {
    await authStore.login(email.value, password.value) // ✅ 呼叫 Pinia login 自動打API

    alert('✅ 登入成功！')

    if (authStore.role === 'ADMIN') {
      router.push('/admin/dashboard') 
    } else if (authStore.role === 'CAREGIVER') {
      router.push('/caregiver') 
    } else {
      router.push('/') // 其他身份回首頁
    }
  } catch (error) {
    console.error(error)
    alert('❌ 帳號或密碼錯誤')
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
  margin-bottom: 1rem;
}

/* ✅ 額外按鈕樣式 */
.extra-buttons {
  display: flex;
  justify-content: space-between;
}

.extra-buttons .register {
  background-color: #007bff;
}
.extra-buttons .forgot {
  background-color: #6c757d;
}
</style>
