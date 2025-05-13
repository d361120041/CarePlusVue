<template>

    <!-- 背景圖片 -->
    <div class="background-image"></div>
    <div class="container">
    <!-- 1. 預約流程 -->
    <div class="reservation-process card-section">
      <h2>輕鬆找到最適合的居家/醫院看護</h2>
      <div class="process-steps">
        <div class="step">
          <div class="step-circle">1</div>
          <div class="step-text">填寫需求並篩選護理人員</div>
        </div>
        <div class="step-text">→</div>
        <div class="step">
          <div class="step-circle">2</div>
          <div class="step-text">比較報價・確認評價</div>
        </div>
        <div class="step-text">→</div>
        <div class="step">
          <div class="step-circle">3</div>
          <div class="step-text">預約最適合的護理人員</div>
        </div>
      </div>
      <div class="process-buttons">
        <button class="search-btn" @click="scrollToRequestForm">搜尋人選</button>
        <button class="request-btn" @click="goToRequestTime">填寫需求單</button>
      </div>
    </div>

    <!-- 2. 填寫需求區塊 -->
    <div class="request-form card-section" ref="requestForm">
    <h3 class="text-lg font-semibold mb-4">馬上搜尋合適的居家/醫院看護</h3>
    <div class="form-row flex flex-wrap gap-4">
      <!-- 服務地區 -->
      <div class="form-group flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-teal-600 mb-1">服務地區（必填）</label>
        <div class="flex gap-2">
          <select
            v-model="form.city"
            @change="onCityChange"
            class="flex-1 p-2 border border-teal-600 rounded-md text-sm"
            required
          >
            <option value="">選擇城市</option>
            <option v-for="city in cities" :key="city.name" :value="city.name">
              {{ city.name }}
            </option>
          </select>
          <select
            v-model="form.district"
            :disabled="!form.city"
            class="flex-1 p-2 border border-teal-600 rounded-md text-sm"
          >
            <option value="">選擇區域</option>
            <option v-for="district in districts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>
      </div>
      <!-- 時間類型 -->
      <div class="form-group min-w-[200px]">
        <label class="block text-sm font-medium text-teal-600 mb-1">時間類型</label>
        <div class="radio-group flex gap-4 items-center">
          <label class="flex items-center text-base text-gray-700">
            <input
              type="radio"
              name="time-type"
              value="continuous"
              v-model="form.timeType"
              @change="showTimeOptions('continuous')"
              class="w-5 h-5 mr-2"
            />
            連續時間
          </label>
          <label class="flex items-center text-base text-gray-700">
            <input
              type="radio"
              name="time-type"
              value="multi"
              v-model="form.timeType"
              @change="showTimeOptions('multi')"
              class="w-5 h-5 mr-2"
            />
            多時段預訂
          </label>
        </div>
      </div>
    </div>

    <!-- 連續時間選項 -->
    <div
      id="continuous-time"
      class="time-options mt-4"
      :class="{ 'block': form.timeType === 'continuous', 'hidden': form.timeType !== 'continuous' }"
    >
      <div class="form-row flex flex-wrap gap-4">
        <div class="form-group flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-teal-600 mb-1">服務開始 日期/時間</label>
          <input
            type="date"
            v-model="form.continuous.startDate"
            class="w-full p-2 border border-teal-600 rounded-md text-sm mb-2"
            required
          />
          <input
            type="time"
            v-model="form.continuous.startTime"
            class="w-full p-2 border border-teal-600 rounded-md text-sm"
            required
          />
        </div>
        <div class="form-group min-w-[200px]">
          <label class="block text-sm font-medium text-teal-600 mb-1">服務結束 日期/時間</label>
          <input
            type="date"
            v-model="form.continuous.endDate"
            class="w-full p-2 border border-teal-600 rounded-md text-sm mb-2"
            required
          />
          <input
            type="time"
            v-model="form.continuous.endTime"
            class="w-full p-2 border border-teal-600 rounded-md text-sm"
            required
          />
        </div>
      </div>
    </div>

    <!-- 多時段預訂選項 -->
    <div
      id="multi-time"
      class="time-options mt-4"
      :class="{ 'block': form.timeType === 'multi', 'hidden': form.timeType !== 'multi' }"
    >
      <div class="form-row flex flex-wrap gap-4">
        <div class="form-group flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-teal-600 mb-1">服務開始 日期</label>
          <input
            type="date"
            v-model="form.multi.startDate"
            class="w-full p-2 border border-teal-600 rounded-md text-sm"
            required
          />
        </div>
        <div class="form-group min-w-[200px]">
          <label class="block text-sm font-medium text-teal-600 mb-1">服務結束 日期</label>
          <input
            type="date"
            v-model="form.multi.endDate"
            class="w-full p-2 border border-teal-600 rounded-md text-sm"
            required
          />
        </div>
      </div>
      <div class="form-group mt-4">
        <label class="block text-sm font-medium text-teal-600 mb-1">其他設定 *可複選</label>
        <div class="checkbox-group flex flex-wrap gap-2 mt-2">
          <label v-for="day in days" :key="day" class="flex items-center text-sm text-gray-700">
            <input
             type="checkbox"
              :value="day"
               :true-value="true"
               :false-value="false"
                v-model="form.multi.repeatDays[dayMap[day]]"
              class="mr-2"
/>
            {{ day }}
          </label>
        </div>
      </div>
      <div class="form-group mt-4">
        <label class="block text-sm font-medium text-teal-600 mb-1">固定每天的時間（幾點到幾點）</label>
        <div v-for="(slot, index) in form.multi.timeSlots" :key="index" class="time-slot flex gap-2 mt-2">
          <input
            type="time"
            v-model="slot.startTime"
            placeholder="服務開始"
            class="flex-1 p-2 border border-teal-600 rounded-md text-sm"
          />
          <input
            type="time"
            v-model="slot.endTime"
            placeholder="服務結束"
            class="flex-1 p-2 border border-teal-600 rounded-md text-sm"
          />
          <button
            @click="form.multi.timeSlots.splice(index, 1)"
            class="px-2 py-1 bg-red-500 text-white rounded-md text-sm"
          >
            移除
          </button>
        </div>
        <div
          class="add-time-slot mt-2 text-teal-600 underline cursor-pointer"
          @click="addTimeSlot"
        >
          ＋新增時間
        </div>
      </div>
    </div>
  <!-- 搜尋人選按鈕 -->
  <div class="form-group mt-6">
    <button
  @click="searchCaregivers"
  :disabled="!isFormComplete"
  class="search-button px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium"
>
  搜尋人選
</button>

  </div>
</div>

    <!-- 3. 介紹 -->
<div class="intro-section card-section">
  <h2 class="text-2xl font-semibold text-gray-800">居家/醫院看護</h2>
  <p class="text-base text-gray-600 max-w-2xl mx-auto">
    想尋找醫院或居家的短期看護、臨時看護嗎？Care+ 擁有超過數百位的看護，服務時間彈性，可選擇鐘點看護，或是半日 12 小時、全日 24 小時的照顧，服務範圍涵蓋全台，照服員人選自訂、價格透明、評價公開，您可依預算、需求自由挑選。
  </p>
</div>

   <!-- 4. 服務項目 -->
<div class="services-section card-section">
  <h2 class="text-2xl font-semibold text-gray-800">服務項目</h2>
  <div class="service-images">
    <img
      v-for="(image, index) in serviceImages"
      :key="index"
      :src="image"
      :alt="`服務圖片 ${index + 1}`"
      class="w-[300px] h-[200px] object-cover rounded-lg transition-transform duration-300 hover:scale-105"
    />
  </div>
  <div class="service-list">
    <div class="service-category">
      <h3 class="text-lg font-medium text-gray-700">一般服務</h3>
      <ul class="list-disc pl-5 text-gray-600">
        <li v-for="item in generalServices" :key="item" class="py-1">{{ item }}</li>
      </ul>
    </div>
    <div class="service-category">
      <h3 class="text-lg font-medium text-gray-700">專業服務</h3>
      <ul class="list-disc pl-5 text-gray-600">
        <li v-for="item in professionalServices" :key="item" class="py-1">{{ item }}</li>
      </ul>
    </div>
  </div>
</div>
    <!-- 5. Care 安心保證 -->
    <div class="assurance-section">
  <h2 class="text-2xl font-semibold text-gray-800">Care 安心保證</h2>
  <div class="assurance-items">
    <div class="assurance-item" v-for="item in assuranceItems" :key="item.title">
      <img :src="item.icon" :alt="`${item.title} 圖標`" class="w-12 h-12">
      <div>
        <h3 class="text-lg font-medium text-gray-700">{{ item.title }}</h3>
        <p class="text-base text-gray-600">{{ item.description }}</p>
      </div>
    </div>
  </div>
</div>
  </div>
</template>


<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted, computed } from 'vue'
import myAxios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { useCaregiverStore } from '@/stores/caregiverStore'
import { useAppointmentStore } from '@/stores/AppointmentStore'

const router = useRouter()
const store = useCaregiverStore()
const appointmentStore = useAppointmentStore()

// 🛠️ 改善後的 validateTime 函數
const validateTime = () => {
  // 取出連續時間表單數據
  const { startDate, startTime, endDate, endTime } = form.value.continuous;

  // 確保所有欄位都有值
  if (!startDate || !startTime || !endDate || !endTime) {
    Swal.fire({
      icon: 'warning',
      title: '時間不完整',
      text: '請完整填寫開始和結束時間',
      confirmButtonText: '確定',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // 將日期與時間組合為 Date 物件
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  // 確認開始時間在結束時間之前
  if (end <= start) {
    Swal.fire({
      icon: 'error',
      title: '時間錯誤',
      text: '結束時間必須晚於開始時間',
      confirmButtonText: '確定',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // 計算總分鐘數
  const diffInMinutes = (end - start) / 60000;
  
  // 確認時間至少 1 小時
  if (diffInMinutes < 60) {
    Swal.fire({
      icon: 'warning',
      title: '時間過短',
      text: '預約至少要 1 小時',
      confirmButtonText: '確定',
      confirmButtonColor: '#3085d6'
    });
    return false;
  }

  // 通過驗證
  return true;
};



//搜尋看護
const searchCaregivers = async () => {

  // 顯示搜尋中的 SweetAlert
  const swalLoading = Swal.fire({
    title: '搜尋中...',
    text: '請稍等，我們正在搜尋最適合的看護人選。',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })

  // ✅ 先檢查時間是否有效
  if (!validateTime()) return;
  const { city, district, continuous, multi, timeType } = form.value

  appointmentStore.setTime('continuous', continuous);
  appointmentStore.setTime('multi', { multi });
  appointmentStore.appointment.timeType = timeType;

// 確保連續或多時段至少填寫一個
  const continuousFilled = continuous.startDate && continuous.startTime && continuous.endDate && continuous.endTime;
  const multiFilled = multi.startDate && multi.endDate && multi.startTime && multi.endTime;;

  if (!(continuousFilled || multiFilled)) {
    Swal.fire({
      icon: 'warning',
      title: '缺少時間資訊',
      text: '請填寫連續時間或多時段的預約條件',
      confirmButtonText: '確定',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  // 確保城市和區域已選擇
  if (!city || !district) {
    Swal.fire({
      icon: 'warning',
      title: '缺少地區資訊',
      text: '請選擇服務城市和區域',
      confirmButtonText: '確定',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  // 新增多時段時間區間
const addTimeSlot = () => {
  form.value.multi.timeSlots.push({ startTime: '', endTime: '' })
}

// 轉換時間格式
const toLocalDateTimeString = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return ''
  return `${dateStr}T${timeStr}`
}

// 確認表單是否完整
const isFormComplete = computed(() => {
  const { continuous, multi } = form.value
  const continuousFilled = continuous.startDate && continuous.startTime && continuous.endDate && continuous.endTime
  const multiFilled = multi.startDate && multi.endDate && multi.timeSlots.length > 0
  return (continuousFilled || multiFilled) && form.value.city && form.value.district
})

//組合篩選條件
  const filters = {
  serviceCity: city,
  serviceDistrict: form.value.district === '全部區域' || !form.value.district ? null : form.value.district,
  desiredStartTime: timeType === 'continuous' ? toLocalDateTimeString(continuous.startDate, continuous.startTime) : toLocalDateTimeString(multi.startDate, multi.timeSlots[0].startTime),
  desiredEndTime: timeType === 'continuous' ? toLocalDateTimeString(continuous.endDate, continuous.endTime) : toLocalDateTimeString(multi.endDate, multi.timeSlots[multi.timeSlots.length - 1].endTime),
  gender: form.value.gender || null,
  nationality: form.value.nationality || null,
  languages: form.value.languages || null,
  hourlyRateMin: form.value.hourlyRateMin || null,
  hourlyRateMax: form.value.hourlyRateMax || null
}

// 確保這些值不為空字串或無效的格式
if (!filters.desiredStartTime || !filters.desiredEndTime) {
  alert('請填寫有效的開始時間與結束時間');
  return;
}

// 在這裡檢查過濾條件
console.log("過濾條件:", filters);

  try {
    const res = await myAxios.get('/api/appointment/caregiver/available', { params: filters })
    console.log("看護列表:", res.data)

    // `totalPrice`更新到 appointmentStore
  res.data.forEach(caregiver => {
    appointmentStore.setTotalPrice(caregiver.totalPrice);
  });

    store.setFilters(filters)
    store.setCaregivers(res.data)

    // 在導航到列表頁面前，儲存 appointmentStore 的時間相關狀態到 localStorage
    localStorage.setItem('timeType', appointmentStore.appointment.timeType);
    localStorage.setItem('continuousStartDate', appointmentStore.continuous.startDate);
    localStorage.setItem('continuousStartTime', appointmentStore.continuous.startTime);
    localStorage.setItem('continuousEndDate', appointmentStore.continuous.endDate);
    localStorage.setItem('continuousEndTime', appointmentStore.continuous.endTime);
    localStorage.setItem('multiStartDate', appointmentStore.multi.multi.startDate);
    localStorage.setItem('multiEndDate', appointmentStore.multi.multi.endDate);
    localStorage.setItem('multiTimeSlots', JSON.stringify(appointmentStore.multi.multi.timeSlots));

    router.push('/caregivers/list');

    // 關閉 SweetAlert
    swalLoading.close();

  } catch (err) {
    console.error('搜尋失敗', err)
    alert('搜尋失敗，請稍後再試')

    // 關閉 SweetAlert
    swalLoading.close();
  }
}

// 確認表單是否完整
const isFormComplete = computed(() => {
  const { continuous, multi } = form.value
  const continuousFilled = continuous.startDate && continuous.startTime && continuous.endDate && continuous.endTime
  const multiFilled = multi.startDate && multi.endDate && multi.timeSlots.length > 0
  return (continuousFilled || multiFilled) && form.value.city && form.value.district
})


// 自動滑到填寫區域
const scrollToRequestForm = () => {
  const requestForm = document.querySelector('.request-form.card-section')
  if (requestForm) requestForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goToRequestTime = () => {
  router.push('/request/time');
};

//表單數據
const form = ref({
  city: '',
  district: '',
  timeType: 'continuous',
  continuous: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  },
  multi: {
    startDate: '',
    endDate: '',
    repeatDays: { // 修改為物件
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    timeSlots: [{ startTime: '', endTime: '' }]
  }
})

const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const dayMap = {
  '星期一': 'monday',
  '星期二': 'tuesday',
  '星期三': 'wednesday',
  '星期四': 'thursday',
  '星期五': 'friday',
  '星期六': 'saturday',
  '星期日': 'sunday'
};
const cities = ref([])
const districts = ref([])

// 初始化城市和區域資料
onMounted(async () => {
  try {
    const res = await fetch('/data/TwCities.json')
    cities.value = await res.json()
  } catch (error) {
    console.error('Failed to load cities:', error)
  }
  form.value.timeType = 'continuous' // Ensure continuous is default
})

// 城市選擇變更
const onCityChange = () => {
  const city = cities.value.find(c => c.name === form.value.city)
  if (city) {
    districts.value = ['全部區域', ...city.districts]
  } else {
    districts.value = []
  }
  form.value.district = ''
}

// 顯示時間選項
const showTimeOptions = (type) => {
  form.value.timeType = type
}

// 新增多時段時間區間
const addTimeSlot = () => {
  form.value.multi.timeSlots.push({ startTime: '', endTime: '' })
}

const serviceImages = [
  '/images/service1.jpg',
  '/images/service2.jpg',
  '/images/service3.jpg'
]

const generalServices = [
  '代購物品',
  '備餐（限被照顧者及其伴侶）',
  '協助進食、用藥（按醫囑給藥）',
  '環境整理（限被照顧者及其伴侶）、洗衣（限被照顧者）',
  '身心靈陪伴及安全維護',
  '陪同外出或就醫'
]

const professionalServices = [
  '協助移位',
  '大小便處理',
  '管路清潔照護',
  '翻身拍背、簡易肢體關節活動',
  '身體清潔',
  '鼻胃管灌食'
]

const assuranceItems = [
  {
    title: '身份與證照審核把關',
    description: '所有服務者都通過台灣身份證、一年內良民證審核。專業項目須有合法證照才能提供服務。',
    icon: '/images/person.png'
  },
  {
    title: '真實評價機制',
    description: '所有服務者的評價均為真實評價，有助於減少風險。',
    icon: '/images/message.png'
  },
  {
    title: '即時訊息聯繫',
    description: '立即與服務者交換聯絡方式，或文字討論細節，降低不適任。',
    icon: '/images/comment.png'
  }
]
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: rgb(240, 240, 189)	; /* 米白背景 */
  margin: 0;
  padding: 0;
}
.container {
  max-width: 1300px;
  margin: 0 auto;
  margin-top: 300px; /* 原本是 150px padding，改為 margin-top */
  padding: 30px;
  position: relative; /* 確保背景圖片相對容器定位 */
}
h2, h3 {
  color: #4DB6AC; /* 藍綠色標題 */
}
/* 背景圖片 */
.background-image {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 570px; /* 覆蓋預約流程和填寫需求區塊的高度 */
  background-image: url('/images/young-asian-woman-taking-care.jpg');
  background-size: cover;
  background-position: center 52%;
  text-align: center;
  z-index: -1; /* 確保背景圖片在內容下方 */
}
/* 預約流程 */
.reservation-process {
  text-align: center;
  padding: 60px 30px;
  background-color: rgba(255, 255, 255, 0.9); /* 白色背景，略透明 */
  border-radius: 10px;
  margin-bottom: 10px; /* 減少間距 */
}

.reservation-process h2 {
  margin-top: 0;
  margin-bottom: 30px; /* 如果你想下方留點距離也可以這樣 */
  font-size: 32px;
}

.process-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-circle {
  width: 60px;
  height: 60px;
  background-color: #FF9999; /* 粉紅色 */
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-bottom: 15px;
}
.step-text {
  font-size: 20px;
  color: #333;
}
.process-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.process-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.request-btn {
  background-color: #FF9999;
  color: #fff;
}
.request-btn:hover {
  background-color: #e68989;
}
.search-btn {
  background-color: #4DB6AC;
  color: #fff;
}
.search-btn:hover {
  background-color: #3a9d93;
}
/* 填寫需求區塊 */
/* 表單容器 */
.request-form {
  background-color: rgba(255, 255, 255, 0.95); /* 提高透明度，增強背景對比 */
  padding: 2.5rem 2rem; /* 增加內距，提升呼吸感 */
  border-radius: 12px; /* 稍大的圓角，現代感更強 */
  margin-bottom: 1.5rem; /* 增加外距，與其他區塊分隔 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 微妙陰影，增加層次 */
}

/* 表單行 */
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem; /* 加大間距，減少擁擠感 */
  margin-bottom: 1rem; /* 確保行與行之間有適當分隔 */
}

/* 表單組 */
.form-group {
  display: flex;
  flex-direction: column;
  flex: 1; /* 讓組件自動填充可用空間 */
  min-width: 180px; /* 確保小螢幕上不會過窄 */
}

/* 標籤 */
.form-group label {
  font-size: 0.875rem; /* 14px，保持一致 */
  font-weight: 500; /* 中等字重，提升可讀性 */
  color: #4DB6AC;
  margin-bottom: 0.5rem; /* 統一間距 */
}

/* 輸入框和選擇框 */
.form-group select,
.form-group input:not([type="radio"]):not([type="checkbox"]) {
  width: 100%;
  padding: 0.75rem; /* 增加內距，提升點擊舒適度 */
  border: 1px solid #4DB6AC;
  border-radius: 6px; /* 稍大圓角，與容器一致 */
  font-size: 0.875rem; /* 14px，與標籤一致 */
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease; /* 平滑過渡 */
}

.form-group select:focus,
.form-group input:not([type="radio"]):not([type="checkbox"]):focus {
  outline: none;
  border-color: #2A9287; /* 深色變體，突出焦點 */
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2); /* 焦點光環 */
}

/* 單選框組 */
.radio-group {
  display: flex;
  align-items: center;
  gap: 2rem; /* 加大間距，減少擁擠 */
}

/* 單選框標籤 */
.radio-group label {
  display: flex;
  align-items: center;
  font-size: 1rem; /* 16px，適中大小 */
  color: #333;
  cursor: pointer; /* 明確點擊範圍 */
}

/* 單選框 */
.radio-group input[type="radio"] {
  width: 1.25rem; /* 20px，保持放大 */
  height: 1.25rem;
  margin-right: 0.5rem; /* 統一間距 */
  accent-color: #4DB6AC; /* 自訂單選框顏色 */
  cursor: pointer;
}

/* 時間選項 */
.time-options {
  display: none;
  margin-top: 1.5rem; /* 與上層分隔 */
}

.time-options.block {
  display: block;
}

/* 複選框組 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* 減小間距，緊湊但不擁擠 */
  margin-top: 0.5rem;
}

/* 複選框標籤 */
.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 0.875rem; /* 14px，與其他文字一致 */
  color: #333;
  cursor: pointer;
}

/* 複選框 */
.checkbox-group input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  margin-right: 0.375rem; /* 微調間距 */
  accent-color: #4DB6AC;
  cursor: pointer;
}

/* 時間段 */
.time-slot {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 統一間距 */
  margin-top: 0.75rem;
}

/* 時間段輸入框 */
.time-slot input[type="time"] {
  flex: 1; /* 自適應寬度 */
}

/* 移除按鈕 */
.time-slot button {
  padding: 0.625rem 1.25rem; 
  background-color: #EF4444; 
  color: #fff;
  border: none; 
  border-radius: 5px; 
  font-size: 0.875rem; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.time-slot button:hover {
  background-color: #DC2626; 
}

/* 新增時間連結 */
.add-time-slot {
  margin-top: 0.75rem;
  color: #4DB6AC;
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

/* 搜尋按鈕 */
.search-button {
  padding: 0.625rem 1.25rem;
  background-color: #4DB6AC;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 0.975rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-time-slot:hover {
  color: #2A9287; /* 深色變體，hover 反饋 */
}
.search-button:hover {
  background-color: #2A9287;
}

/* 介紹 */
.intro-section {
  text-align: center;
  padding: 3rem 2rem; /* 統一內距，增加呼吸感 */
  background-color: #ffffff; /* 純白背景，乾淨現代 */
  border-radius: 12px; /* 與表單一致的圓角 */
  margin-bottom: 1.5rem; /* 與表單一致的外距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 微妙陰影，提升層次 */
  max-width: 1000px; /* 限制最大寬度，防止過寬 */
  margin-left: auto;
  margin-right: auto; /* 居中顯示 */
}

.intro-section h2 {
  font-size: 1.5rem; /* 24px，突出但不過大 */
  font-weight: 600; /* 中等字重，現代感 */
  color: #1f2937; /* 深灰色，高對比 */
  margin-bottom: 1rem; /* 與段落分隔 */
}

.intro-section p {
  font-size: 1rem; /* 16px，標準閱讀大小 */
  line-height: 1.6; /* 增加行距，提升可讀性 */
  color: #4b5563; /* 稍深的灰色，柔和但清晰 */
  max-width: 640px; /* 限制文字寬度，符合閱讀舒適範圍 */
  margin: 0 auto; /* 居中 */
}
/* 服務項目 */
.services-section {
  padding: 3rem 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.services-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 2rem;
}

.service-images {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.service-images img {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  scroll-snap-align: start;
}

.service-list {
  display: flex;
  gap: 1.5rem; 
  flex-wrap: wrap;
  justify-content: center;
  max-width: 948px; /* 與圖片區域總寬度一致 */
  margin: 0 auto; /* 居中 */
}

.service-category {
  flex: 0 0 330px; /* 固定寬度，稍寬於圖片以容納文字 */
  min-width: 300px; 
}

.service-category h3 {
  font-size: 1.25rem; 
  font-weight: 600; 
  color: #1f2937; 
  margin-bottom: 1rem;
  position: relative;
}

.service-category h3::after {
  content: '';
  display: block;
  width: 80px;
  height: 2px;
  background-color: #4DB6AC; 
  margin: 0.5rem 0 0; 
}

.service-list ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  font-size: 1rem; /* 16px，提升可讀性 */
  color: #4b5563;
  line-height: 1.6; /* 稍增加行距 */
}

.service-list li {
  padding: 0.375rem 0; /* 增加垂直間距，減少擁擠 */
  transition: color 0.2s ease; /* 懸停效果 */
}

.service-list li:hover {
  color: #2A9287; /* 主題色的深色變體，增加互動 */
}
/* 安心保證 */
.assurance-section {
  padding: 3rem 2rem; /* 保留原始內距 */
  background: transparent; /* 移除白色背景 */
  margin-bottom: 1.5rem;
  max-width: 948px; /* 與服務項目對齊 */
  margin-left: auto;
  margin-right: auto;
}

.assurance-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.assurance-section h2::after {
  content: '';
  display: block;
  width: 200px;
  height: 2px;
  background-color: #4DB6AC;
  margin: 0.5rem auto 0;
}

.assurance-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem; /* 與服務項目一致 */
  justify-content: center; /* 水平居中，倒三角形 */
}

.assurance-item {
  flex: 0 0 300px; /* 固定寬度，與服務項目圖片對齊 */
  min-width: 300px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem; /* 保留卡片內距 */
  background-color: #beedd5; /* 保留綠色背景 */
  border-radius: 8px; /* 保留圓角 */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* 保留 hover 效果 */
}

.assurance-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.assurance-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.assurance-item h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.assurance-item p {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* 限制 .card-section 影響 */
.card-section:not(.assurance-section) {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 60px 30px;
  margin-bottom: 30px;
}

/* 統一卡片樣式 */
.card-section {
  background-color: #ffffff; 
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
  padding: 60px 30px;
  margin-bottom: 30px; 
}

</style>