<template>
  <div class="profile-container">
    <h2>📝 編輯個人資料</h2>

    <!-- ✅ 大頭貼區塊 -->
    <div class="avatar-section">
      <img :src="photoPreviewUrl" alt="目前大頭貼" class="avatar" />
      <input type="file" @change="handlePhotoUpload" accept="image/*" />
    </div>

    <form @submit.prevent="handleSubmit">
      <div><label>姓名：</label><input v-model="form.caregiverName" required /></div>
      <div><label>性別：</label>
        <select v-model="form.gender" required>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>
      <div><label>生日：</label><input v-model="form.birthday" type="date" required /></div>
      <div><label>電話：</label><input v-model="form.phone" maxlength="10" required /></div>
      <div><label>國籍：</label>
        <select v-model="form.nationality">
          <option value="中華民國">中華民國</option>
          <option value="其他">其他</option>
        </select>
        <input v-if="form.nationality === '其他'" v-model="form.customNationality" placeholder="請輸入國籍" />
      </div>
      <div><label>語言：</label>
        <select v-model="form.languages">
          <option value="中文">中文</option>
          <option value="英文">英文</option>
        </select>
      </div>
      <div><label>年資：</label><input v-model.number="form.yearOfExperience" type="number" min="0" /></div>
      <div><label>自我介紹：</label><textarea v-model="form.description" rows="3" /></div>
      <button type="submit">儲存變更</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const form = ref({
  caregiverName: '', gender: '男', birthday: '', phone: '',
  nationality: '中華民國', customNationality: '',
  languages: '中文', yearOfExperience: 0, description: '',
  photoPath: ''
})
const photoPreviewUrl = ref('/yuuhou/images/default.png')
const message = ref('')

const fetchProfile = async () => {
  try {
    const { data } = await axios.get('/api/caregivers/me')
    form.value = { ...data }
    photoPreviewUrl.value = data.photoPath || '/yuuhou/images/default.png'
  } catch (err) {
    message.value = '⚠️ 無法載入個人資料'
  }
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const { data } = await axios.post('/api/caregivers/photo', formData)
    form.value.photoPath = data.photoPath
    photoPreviewUrl.value = data.photoPath
  } catch (err) {
    message.value = '❌ 上傳大頭貼失敗'
  }
}

const handleSubmit = async () => {
  try {
    const payload = {
      ...form.value,
      nationality: form.value.nationality === '其他' ? form.value.customNationality : form.value.nationality
    }
    await axios.put('/api/caregivers/me', payload)
    message.value = '✅ 資料更新成功！'
  } catch (err) {
    message.value = '❌ 儲存失敗'
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.avatar-section {
  text-align: center;
  margin-bottom: 1rem;
}
.avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}
.profile-container div {
  margin-bottom: 12px;
}
.message {
  margin-top: 1rem;
  color: green;
}
</style>
