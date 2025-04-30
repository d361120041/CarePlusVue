<template>
  <div class="register-container">
    <h2>註冊成為照顧者</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Email：</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>密碼：</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>姓名：</label>
        <input v-model="caregiverName" type="text" required />
      </div>
      <!-- 你之後可以自己加更多欄位（性別、生日、電話等） -->

      <button type="submit">註冊</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import auth from '@/api/auth' // ✅ 改這裡
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const caregiverName = ref('')
const message = ref('')

const handleRegister = async () => {
  try {
    await auth.register({   // ✅ 呼叫要加 auth.
      email: email.value,
      password: password.value,
      caregiverName: caregiverName.value,
      gender: '男',
      birthday: '1990-01-01',
      phone: '0912345678',
      nationality: '台灣',
      languages: '中文',
      yearOfExperience: 1,
      serviceCity: '台北市',
      serviceDistrict: '中正區',
      description: '自我介紹',
      photoPath: '/images/default.png',
      hourlyRate: 300,
      halfDayRate: 1000,
      fullDayRate: 2000
    })
    message.value = '註冊成功！請到信箱完成驗證 ✅'
    setTimeout(() => {
      router.push('/caregiver-login')
    }, 3000)
  } catch (error) {
    message.value = error.response?.data || '註冊失敗！'
  }
}
</script>


<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.message {
  margin-top: 10px;
  color: green;
}
</style>
