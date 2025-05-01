<template>
  <div class="register-container">
    <h2>註冊成為照顧者</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label><span class="required">*</span> Email</label>
        <input v-model="email" type="email" required />
        <div v-if="emailExists" class="error">此信箱已被註冊</div>
      </div>
      <div>
        <label><span class="required">*</span> 密碼</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label><span class="required">*</span> 姓名</label>
        <input v-model="caregiverName" type="text" required />
      </div>
      <div>
        <label><span class="required">*</span> 性別</label>
        <select v-model="gender" required>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>
      <div>
        <label><span class="required">*</span> 生日</label>
        <input v-model="birthday" type="date" required />
      </div>
      <div>
        <label><span class="required">*</span> 電話</label>
        <input v-model="phone" type="text" maxlength="10" pattern="^[0-9]{10}$" required title="請輸入10位數字的電話號碼" />
      </div>
      <div>
        <label><span class="required">*</span> 國籍</label>
        <select v-model="nationality" required>
          <option value="中華民國">中華民國</option>
          <option value="其他">其他</option>
        </select>
        <div v-if="nationality === '其他'">
          <input v-model="customNationality" type="text" placeholder="請輸入您的國籍" />
        </div>
      </div>
      <div>
        <label><span class="required">*</span> 語言</label>
        <select v-model="languages" required>
          <option value="中文">中文</option>
          <option value="英文">英文</option>
        </select>
      </div>
      <div>
        <label><span class="required">*</span> 年資（年）</label>
        <input v-model.number="yearOfExperience" type="number" min="0" required />
      </div>
      <div>
        <label><span class="required">*</span> 服務縣市</label>
        <select v-model="serviceCity" @change="onCityChange" required>
          <option disabled value="">請選擇縣市</option>
          <option v-for="(districts, city) in cityDistricts" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <div>
        <label><span class="required">*</span> 服務區域</label>
        <select v-model="serviceDistrict" required>
          <option disabled value="">請選擇區域</option>
          <option v-for="district in currentDistricts" :key="district" :value="district">{{ district }}</option>
        </select>
      </div>
      <div>
        <label><span class="required">*</span> 自我介紹</label>
        <textarea v-model="description" rows="3" required />
      </div>
      <div>
        <label><span class="required">*</span> 每小時收費</label>
        <input v-model.number="hourlyRate" type="number" min="0" required />
      </div>
      <div>
        <label><span class="required">*</span> 半天收費</label>
        <input v-model.number="halfDayRate" type="number" min="0" required />
      </div>
      <div>
        <label><span class="required">*</span> 全天收費</label>
        <input v-model.number="fullDayRate" type="number" min="0" required />
      </div>

      <button type="submit">註冊</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import auth from '@/api/auth'

const router = useRouter()

const email = ref('')
const emailExists = ref(false)
const password = ref('')
const caregiverName = ref('')
const gender = ref('男')
const birthday = ref('1990-01-01')
const phone = ref('')
const nationality = ref('中華民國')
const customNationality = ref('')
const languages = ref('中文')
const yearOfExperience = ref(0)
const serviceCity = ref('')
const serviceDistrict = ref('')
const description = ref('')
const hourlyRate = ref(300)
const halfDayRate = ref(1000)
const fullDayRate = ref(2000)
const message = ref('')

const cityDistricts = {
  台北市: ['中正區', '大同區', '中山區', '萬華區', '信義區'],
  新北市: ['板橋區', '新莊區', '三重區', '淡水區'],
  台中市: ['西區', '北區', '南區', '東區']
}
const currentDistricts = computed(() => cityDistricts[serviceCity.value] || [])
const onCityChange = () => (serviceDistrict.value = '')

// ✅ 即時檢查信箱是否存在
watch(email, async (newEmail) => {
  emailExists.value = false
  if (newEmail && newEmail.includes('@')) {
    try {
      const { data } = await axios.get('/api/auth/check-email', { params: { email: newEmail } })
      emailExists.value = data.exists
    } catch (err) {
      console.error('檢查信箱錯誤', err)
    }
  }
})

const handleRegister = async () => {
  if (emailExists.value) {
    message.value = '❌ 此信箱已被註冊，請使用其他信箱'
    return
  }

  try {
    await auth.register({
      email: email.value,
      password: password.value,
      caregiverName: caregiverName.value,
      gender: gender.value,
      birthday: birthday.value,
      phone: phone.value,
      nationality: nationality.value === '其他' ? customNationality.value : nationality.value,
      languages: languages.value,
      yearOfExperience: yearOfExperience.value,
      serviceCity: serviceCity.value,
      serviceDistrict: serviceDistrict.value,
      description: description.value,
      photoPath: '/images/default.png',
      hourlyRate: hourlyRate.value,
      halfDayRate: halfDayRate.value,
      fullDayRate: fullDayRate.value
    })

    message.value = '註冊成功！請到信箱完成驗證 ✅'
    setTimeout(() => {
      router.push('/verify-reminder')
    }, 3000)
  } catch (error) {
    message.value = error.response?.data || '註冊失敗！'
  }
}
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
.register-container div {
  margin-bottom: 10px;
}
.required {
  color: red;
  margin-right: 4px;
}
.error {
  color: red;
  font-size: 0.9rem;
}
.message {
  margin-top: 10px;
  color: green;
}
</style>
