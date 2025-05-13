<template>
  <div class="edit-service">
    <h2>📍 服務地區與收費設定</h2>
    <form @submit.prevent="handleSave">
      <div>
        <label><span class="required"></span> 服務縣市</label>
        <select v-model="serviceSettings.serviceCity" @change="onCityChange" required>
          <option disabled value="">請選擇縣市</option>
          <option v-for="(districts, city) in cityDistricts" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>
      
      <div>
        <label><span class="required"></span> 服務區域</label>
        <select v-model="serviceSettings.serviceDistrict" required>
          <option disabled value="">請選擇區域</option>
          <option v-for="district in currentDistricts" :key="district" :value="district">
            {{ district }}
          </option>
        </select>
      </div>

      <div>
        <label>每小時收費：</label>
        <input v-model.number="serviceSettings.hourlyRate" type="number" />
      </div>
      <div>
        <label>半天收費：</label>
        <input v-model.number="serviceSettings.halfDayRate" type="number" />
      </div>
      <div>
        <label>全天收費：</label>
        <input v-model.number="serviceSettings.fullDayRate" type="number" />
      </div>
      <button type="submit">儲存設定</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const serviceSettings = ref({
  serviceCity: '',
  serviceDistrict: '',
  hourlyRate: 0,
  halfDayRate: 0,
  fullDayRate: 0,
})

const message = ref('')

// 縣市與區域資料
const cityDistricts = {
  台北市: ['中正區', '大同區', '中山區', '萬華區', '信義區'],
  新北市: ['板橋區', '新莊區', '三重區', '淡水區'],
  台中市: ['西區', '北區', '南區', '東區']
}

const currentDistricts = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/caregivers/me/service-settings')
    serviceSettings.value = res.data

    // 預先設定區域選單
    if (serviceSettings.value.serviceCity) {
      currentDistricts.value = cityDistricts[serviceSettings.value.serviceCity] || []
    }
  } catch (err) {
    message.value = '❌ 無法載入服務設定'
  }
})

const onCityChange = () => {
  const selectedCity = serviceSettings.value.serviceCity
  currentDistricts.value = cityDistricts[selectedCity] || []
  serviceSettings.value.serviceDistrict = ''
}

const handleSave = async () => {
  try {
    await axios.put('/api/caregivers/me/service-settings', serviceSettings.value)
    message.value = '✅ 更新成功！'
  } catch (err) {
    message.value = '❌ 更新失敗'
  }
}
</script>

<style scoped>
.edit-service {
  max-width: 600px;
  margin: 2rem auto;
}

.required {
  color: red;
}

.message {
  margin-top: 1rem;
  color: green;
}
</style>
