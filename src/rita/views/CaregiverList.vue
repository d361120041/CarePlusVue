<template>
  <div class="wrapper">
    <!-- 搜尋條件顯示 -->
    <div class="search-conditions card-section mb-6">
      <div class="flex justify-between items-center">
        <div class="conditions-container">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">您的搜尋條件</h3>
          <div class="condition-tags">
            <span class="condition-tag">
              <span class="label">服務地區：</span>
              <span class="value">
                {{ caregiverStore.filters.serviceCity || '未指定' }}
                {{ caregiverStore.filters.serviceDistrict ? ` - ${caregiverStore.filters.serviceDistrict}` : '' }}
              </span>
            </span>
            <span class="condition-tag">
              <span class="label">時間選擇：</span>
              <span class="value">
                <span v-if="appointmentStore.appointment.timeType === 'continuous'">
                  {{ formatDateTime(caregiverStore.filters.desiredStartTime) }} - 
                  {{ formatDateTime(caregiverStore.filters.desiredEndTime) }}（連續時間）
                </span>
                <span v-else>
                  {{ formatDate(appointmentStore.multi.startDate) }} - 
                  {{ formatDate(appointmentStore.multi.endDate) }}
                  （每日 {{ appointmentStore.multi.timeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ') }}，多時段預訂）
                </span>
              </span>
            </span>
          </div>
        </div>
        <button @click="goBackToSearch" class="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors">
          修改條件
        </button>
      </div>
    </div>

    <!-- 標頭 -->
    <div class="header flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800">搜尋結果，共 {{ sortedCaregivers.length }} 位看護</h3>
      <select v-model="sortOption" class="border p-2 rounded-md text-gray-600 focus:border-teal-600 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
        <option value="price">按價格排序</option>
        <option value="experience">按經驗年數排序</option>
      </select>
    </div>

    <!-- 無結果提示 -->
    <div v-if="sortedCaregivers.length === 0" class="text-center py-10 bg-white rounded-lg shadow-sm">
      <p class="text-lg text-gray-600 mb-2">很抱歉，沒有符合條件的看護！</p>
      <p class="text-sm text-gray-500">請調整您的搜尋條件後再試一次，或<a @click="goBackToSearch" class="text-teal-600 underline cursor-pointer ml-1">返回搜尋頁面</a>。</p>
    </div>

    <!-- 看護卡片網格 -->
    <div class="caregiver-grid">
      <div
        class="caregiver-card"
        v-for="caregiver in sortedCaregivers"
        :key="caregiver.caregiverId"
        @click="goToCaregiverDetail(caregiver.caregiverId)"
      >
        <img
          class="caregiver-image"
          :src="caregiver.photoPath || 'https://finalimagesbucket.s3.amazonaws.com/default-placeholder.jpg'"
          :alt="`看護 ${caregiver.caregiverName}`"
        />
        <div class="caregiver-info">
          <h3 class="text-lg font-semibold text-teal-600">{{ caregiver.caregiverName }}</h3>
          <div class="info-row text-sm text-gray-600">
            <span>性別：{{ caregiver.gender }}</span>
            <span>國籍：{{ caregiver.nationality || '未知' }}</span>
            <span>語言：{{ caregiver.languages || '未知' }}</span>
          </div>
          <p class="text-sm text-gray-600">經驗年數：{{ caregiver.yearOfExperience }} 年</p>
          <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ caregiver.description || '尚無詳細介紹' }}</p>
          <p class="text-lg font-bold text-teal-600 mt-2">總價格：{{ calculateTotalPrice(caregiver).toLocaleString() }} 元</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCaregiverStore } from '@/stores/caregiverStore';
import { useAppointmentStore } from '@/stores/AppointmentStore';

const router = useRouter();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();

// 排序選項
const sortOption = ref('price');

// 排序後的看護列表
const sortedCaregivers = computed(() => {
  const list = [...caregiverStore.caregivers];
  if (sortOption.value === 'price') {
    list.sort((a, b) => calculateTotalPrice(a) - calculateTotalPrice(b));
  } else if (sortOption.value === 'experience') {
    list.sort((a, b) => b.yearOfExperience - a.yearOfExperience);
  }
  return list;
});

// 格式化日期和時間
const formatDateTime = (dateTime) => {
  if (!dateTime) return '未指定';
  const date = new Date(dateTime);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// 格式化僅日期
const formatDate = (date) => {
  if (!date) return '未指定';
  const d = new Date(date);
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 計算總價格
const calculateTotalPrice = (caregiver) => {
  let totalHours = 0;

  if (appointmentStore.appointment.timeType === 'continuous') {
    // 連續時間計算
    const start = new Date(appointmentStore.continuous.startTime);
    const end = new Date(appointmentStore.continuous.endTime);
    totalHours = (end - start) / (1000 * 60 * 60); // 轉換為小時
  } else {
    // 多時段預訂計算
    const startDate = new Date(appointmentStore.multi.startDate);
    const endDate = new Date(appointmentStore.multi.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // 包含首尾

    // 計算每日工作天數（根據 repeatDays）
    let workingDays = days;
    if (appointmentStore.multi.repeatDays && appointmentStore.multi.repeatDays.length > 0) {
      workingDays = 0;
      const start = new Date(appointmentStore.multi.startDate);
      const end = new Date(appointmentStore.multi.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];
        if (appointmentStore.multi.repeatDays.includes(dayOfWeek)) {
          workingDays++;
        }
      }
    }

    // 計算每日小時數（根據 timeSlots）
    let dailyHours = 0;
    if (appointmentStore.multi.timeSlots && appointmentStore.multi.timeSlots.length > 0) {
      appointmentStore.multi.timeSlots.forEach(slot => {
        const startTime = new Date(`1970-01-01T${slot.startTime}:00`);
        const endTime = new Date(`1970-01-01T${slot.endTime}:00`);
        dailyHours += (endTime - startTime) / (1000 * 60 * 60);
      });
    }

    totalHours = dailyHours * workingDays; // 總小時數 = 每日小時數 × 工作天數
  }

  // 價格計算邏輯：半天 4 小時，全天 8 小時
  const hourlyRate = parseFloat(caregiver.hourlyRate);
  const halfDayRate = parseFloat(caregiver.halfDayRate);
  const fullDayRate = parseFloat(caregiver.fullDayRate);

  if (totalHours < 4) {
    return Math.round(totalHours * hourlyRate);
  } else if (totalHours < 8) {
    return halfDayRate;
  } else {
    const fullDays = Math.floor(totalHours / 8);
    const remainingHours = totalHours % 8;
    return Math.round((fullDays * fullDayRate) + (remainingHours * hourlyRate));
  }
};

// 跳轉到看護詳情頁面
const goToCaregiverDetail = (caregiverId) => {
  router.push(`/caregivers/${caregiverId}`);
};

// 返回搜尋頁面
const goBackToSearch = () => {
  router.push('/'); // 假設搜尋頁面是首頁
};
</script>

<style scoped>
/* 全局樣式 */
.wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
}

/* 篩選條件區塊 */
.filter-section {
  padding: 2rem; /* 增加內距，顯得更寬鬆 */
  background-color: #f9fafb; /* 淺灰背景 */
  border: 1px solid #d1e9e5; /* 使用淺主題色邊框，增加獨立性 */
  border-radius: 8px;
  margin-bottom: 3rem; /* 增加底部間距 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); /* 輕微陰影，突出層次 */
}

/* 篩選控制項 */
.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 保持舒適間距 */
}

/* 篩選組 */
.filter-group {
  display: flex;
  flex-direction: column;
}

/* 時間欄位 */
.time-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.time-fields .flex {
  gap: 1.5rem;
}

/* 分隔線 */
hr {
  border: 0;
  border-top: 2px solid #4DB6AC; /* 使用主題色，強化分隔 */
  margin: 3rem 0; /* 增加上下間距 */
  position: relative;
}

hr::before {
  content: '搜尋結果';
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff; /* 背景色與父介面一致 */
  padding: 0 1rem;
  color: #4DB6AC;
  font-size: 1rem;
  font-weight: 500;
}

/* 結果區塊 */
.results-section {
  padding-top: 2rem; /* 增加頂部間距 */
}

/* 標頭 */
.header h3 {
  color: #4DB6AC;
}

.header select {
  border: 1px solid #d1d5db;
  background-color: #fff;
  transition: border-color 0.2s ease;
  border-radius: 6px;
}

/* 看護網格 */
.caregiver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* 看護卡片 */
.caregiver-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.caregiver-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.caregiver-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.caregiver-info {
  padding: 1rem;
}

/* 資訊行 */
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.info-row span {
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  border-radius: 4px;
  font-size: 0.875rem;
}

/* 文字樣式 */
.caregiver-info h3 {
  color: #4DB6AC;
}

.caregiver-info p {
  color: #4b5563;
  line-height: 1.6;
}

/* 限制描述文字為兩行 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>