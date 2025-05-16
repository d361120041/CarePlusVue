<template>
  <div class="edit-service">
    <h2>服務地區與收費設定</h2>
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
  臺北市: ['中正區', '大同區', '中山區', '萬華區', '信義區'],
  新北市: ['板橋區', '新莊區', '三重區', '淡水區'],
  臺中市: ['西區', '北區', '南區', '東區']
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
/* =======================
   🌟 Main Container
======================= */
.edit-service {
  max-width: 650px;
  margin: 3rem auto;
  padding: 2rem;
  background: linear-gradient(145deg, #f0f4ff, #ffffff);
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e7ff;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* ✅ 背景裝飾 */
.edit-service::before {
  content: "";
  position: absolute;
  top: -20%;
  left: -20%;
  width: 200%;
  height: 200%;
  background: url('/path/to/your/map-pattern.png') repeat;
  opacity: 0.05;
  z-index: 0;
}

/* =======================
   📌 Header Styles
======================= */
.edit-service h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 28px;
  position: relative;
  z-index: 2;
  background: linear-gradient(145deg, #4a90e2, #5f6dc3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* =======================
   📄 Form Styles
======================= */
form {
  display: grid;
  gap: 20px;
  z-index: 2;
  position: relative;
}

/* ✅ 輸入框樣式 */
form input[type="number"],
form select {
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #d0d7ff;
  background-color: #f9faff;
  font-size: 14px;
  transition: border-color 0.3s, background-color 0.3s;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

/* ✅ 聚焦效果 */
form input:focus,
form select:focus {
  border-color: #4a90e2;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
}

/* ✅ 標籤樣式 */
form label {
  font-weight: bold;
  color: #555;
  font-size: 16px;
  margin-bottom: 8px;
}

/* ✅ 必填標記 */
.required {
  color: #e53935;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}

/* =======================
   🚀 Button Styles
======================= */
button[type="submit"] {
  background: linear-gradient(145deg, #4a90e2, #5f6dc3);
  color: #ffffff;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

button[type="submit"]:hover {
  background: linear-gradient(145deg, #5f6dc3, #4a90e2);
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(74, 144, 226, 0.3);
}

/* ✅ 點擊效果 */
button[type="submit"]:active {
  transform: scale(0.95);
  box-shadow: 0 5px 20px rgba(74, 144, 226, 0.5);
}

/* =======================
   ✅ Message Styles
======================= */
.message {
  margin-top: 1rem;
  color: #28a745;
  font-weight: bold;
  text-align: center;
  border-radius: 20px;
  padding: 10px 20px;
  background-color: #e6f7e6;
  animation: slideDown 0.3s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* ❌ 錯誤訊息 */
.message.error {
  background-color: #fbecec;
  color: #e53935;
}

/* 💥 Animation Styles */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
