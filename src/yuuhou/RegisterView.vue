<template>
  <div class="register-container">
    <h2>註冊成為照顧者</h2>
    <form @submit.prevent="handleRegister">
      <!-- ✅ 大頭貼預覽區塊 -->
      <div class="avatar-section" >
        <div class="avatar-wrapper"@click="triggerFileInput">
          <img :src="photoPreviewUrl || defaultAvatar"  class="avatar" @click.stop="triggerFileInput" />
          <div class="avatar-overlay" v-if="!photoPreviewUrl">+</div>
        </div>
        <input type="file" ref="fileInput" @change="handlePhotoChange" accept="image/*" style="display:none" />
        <div class="upload-button" @click.stop>
          <button @click="triggerFileInput" type="button">選擇大頭貼</button>
        </div>
      </div>
      <br>

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

// 表單資料
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

// 驗證碼
const verificationCode = ref('')
const showVerificationCodeInput = ref(false)

// 城市與區域
const cityDistricts = {
  台北市: ['中正區', '大同區', '中山區', '萬華區', '信義區'],
  新北市: ['板橋區', '新莊區', '三重區', '淡水區'],
  台中市: ['西區', '北區', '南區', '東區']
}
const currentDistricts = computed(() => cityDistricts[serviceCity.value] || [])
const onCityChange = () => (serviceDistrict.value = '')

// 大頭貼
const photoFile = ref(null)
const photoPreviewUrl = ref(null)

const MAX_WIDTH = 1680
const MAX_HEIGHT = 1680

const triggerFileInput = () => {
  document.querySelector("input[type='file']").click()
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const image = new Image()
  const objectUrl = URL.createObjectURL(file)

  image.onload = () => {
    if (image.width > MAX_WIDTH || image.height > MAX_HEIGHT) {
      message.value = `❌ 上傳失敗：圖片尺寸不能超過 ${MAX_WIDTH}x${MAX_HEIGHT}px`
      photoFile.value = null
      photoPreviewUrl.value = null
      URL.revokeObjectURL(objectUrl)
      return
    }

    photoFile.value = file
    photoPreviewUrl.value = objectUrl
  }

  image.src = objectUrl
}

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

// ✅ 改成發送驗證碼
// ✅ handleRegister 修改
// ✅ 修改 handleRegister，確保圖片會傳到後端
// ✅ 改用 Promise 包裝 FileReader
const handleRegister = async () => {
  if (emailExists.value) {
    message.value = '❌ 此信箱已被註冊，請使用其他信箱'
    return
  }

  // ✅ 檢查是否有上傳大頭貼
  if (!photoFile.value) {
    message.value = '❌ 請選擇大頭貼'
    return
  }

  try {
    // ✅ 轉換圖片為 Base64
    const base64Photo = await readFileAsBase64(photoFile.value)

    // ✅ 發送註冊請求
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
      hourlyRate: hourlyRate.value,
      halfDayRate: halfDayRate.value,
      fullDayRate: fullDayRate.value,
      base64Photo: base64Photo
    })

    // ✅ 跳轉到驗證頁面
    router.push({
      path: '/verify-code',
      query: { email: email.value }
    })

  } catch (error) {
    message.value = error.response?.data || '❌ 註冊失敗！'
  }
}

// ✅ 把 FileReader 包裝成 Promise
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}




// ✅ 確認驗證碼
const handleVerifyCode = async () => {
  try {
    const response = await axios.post('/api/auth/verify', {
      email: email.value,
      verificationCode: verificationCode.value
    })

    message.value = '✅ 驗證成功！您的帳號已啟用，可以登入囉！'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    message.value = error.response?.data || '驗證失敗！'
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

.avatar-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  /* ✅ 重點：等比例裁切填滿不變形 */
  border-radius: 50%;
  /* ✅ 加圓形（可選） */
  border: 2px solid #ccc;
}

.avatar-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  cursor: pointer;
  /* ✅ 預設背景避免破圖 */
}


.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  border-radius: 50%;
  opacity: 1;
  transition: opacity 0.2s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 0.9;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.upload-button {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background-color: #007bff;
  color: #fff;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 2;
  cursor: pointer;
}

.upload-button button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
}

.upload-button button:hover {
  text-decoration: underline;
}
</style>