<template>
  <div class="verify-container">
    <h2>🔑 輸入驗證碼</h2>
    <p>我們已經發送驗證碼到您的信箱，請輸入驗證碼完成註冊。</p>

    <input v-model="verificationCode" type="text" placeholder="請輸入驗證碼" />
    <button @click="handleVerifyCode">確認</button>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

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
    })

    message.value = '✅ 驗證成功！您的帳號已啟用，可以登入囉！'
    setTimeout(() => {
      router.push('/login-caregiver')
    }, 3000)
  } catch (error) {
    message.value = error.response?.data || '❌ 驗證失敗！'
  }
}
</script>

<style scoped>
.verify-container {
  max-width: 400px;
  margin: 3rem auto;
  text-align: center;
}
.message {
  margin-top: 10px;
  color: green;
}
</style>
