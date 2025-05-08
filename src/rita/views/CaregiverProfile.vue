<template>
  <div class="wrapper">
    <!-- 🔙 返回按鈕 -->
    <button
      @click="goBack"
      class="back-button flex items-center text-teal-600 hover:text-teal-700 transition-colors duration-200"
      aria-label="返回搜尋結果"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      返回搜尋結果
    </button>

    <!-- 👤 看護個人資料區塊 -->
    <div v-if="caregiver" class="caregiver-profile card-section">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- 左側：看護資訊 -->
        <div class="flex-1 space-y-8">
          <!-- 📸 看護照片 -->
          <div class="flex-shrink-0 relative">
            <img
              class="caregiver-image"
              :src="caregiver.photoPath || 'https://finalimagesbucket.s3.amazonaws.com/default-placeholder.jpg'"
              :alt="`看護 ${caregiver.caregiverName}`"
              loading="lazy"
            />
          </div>

          <!-- 🧾 姓名 -->
          <h1 class="text-3xl font-bold text-teal-700">{{ caregiver.caregiverName }}</h1>

          <!-- 📋 基本資訊 -->
          <div class="info-grid">
            <div class="info-item"><span class="label">性別</span><span class="value">{{ caregiver.gender || '未知' }}</span></div>
            <div class="info-item"><span class="label">國籍</span><span class="value">{{ caregiver.nationality || '未知' }}</span></div>
            <div class="info-item">
              <span class="label">語言</span>
              <span class="value">
                <template v-if="Array.isArray(caregiver?.languages)">
                  {{ caregiver.languages.join(', ') }}
                </template>
                <template v-else>
                  {{ caregiver?.languages || '未知' }}
                </template>
              </span>
            </div>
            <div class="info-item"><span class="label">經驗年數</span><span class="value">{{ caregiver.yearOfExperience }} 年</span></div>
            <div class="info-item"><span class="label">時薪</span><span class="value">{{ caregiver.hourlyRate ? `${caregiver.hourlyRate} 元/小時` : '未提供' }}</span></div>
            <div class="info-item"><span class="label">半日薪</span><span class="value">{{ caregiver.hourlyRate ? `${caregiver.halfDayRate} 元/小時` : '未提供' }}</span></div>
            <div class="info-item"><span class="label">日薪</span><span class="value">{{ caregiver.hourlyRate ? `${caregiver.fullDayRate} 元/小時` : '未提供' }}</span></div>
          </div>

          <!-- 📄 詳細介紹 -->
          <div>
            <h3 class="section-title">詳細介紹</h3>
            <p class="text-gray-600 mt-3 leading-relaxed">{{ caregiver.description || '尚無詳細介紹' }}</p>
          </div>

       <!--   <div v-if="caregiver?.caregiverLicenses?.length > 0">
            <h3 class="section-title">專業證照</h3>
            <ul class="mt-3 list-disc list-inside text-gray-600">
              <li v-for="license in caregiver.caregiverLicenses" :key="license.licenseId || license.licenseName">
                {{ license.licenseName || '未提供證照名稱' }}
              </li>
            </ul>
          </div>
          <div v-else>
            <h3 class="section-title">專業證照</h3>
            <p class="text-gray-600 mt-3">未提供相關證照資訊。</p>
          </div> -->
        </div>

        <!-- 分隔線 -->
        <div class="divider"></div>

        <!-- 右側：使用者輸入資訊 -->
        <div class="flex-1 space-y-6">
          <h3 class="section-title">您的需求</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">服務縣市</span>
              <span class="value">{{ appointmentStore.appointment.city || '未選擇' }}</span>
            </div>
            <div class="info-item">
              <span class="label">時間需求</span>
              <span class="value">{{ appointmentStore.appointment.timeRequirements || '未提供' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
          <h4 class="section-title">預估總價</h4>
          <p class="text-xl font-semibold text-teal-700">
            {{ appointmentStore.appointment.totalPrice !== null ? `${appointmentStore.appointment.totalPrice} 元` : '計算中...' }}
          </p>
        </div>

      <!-- ✅ 預約按鈕 -->
      <div class="mt-8">
        <button
          @click="confirmBooking"
          class="booking-button w-full flex justify-center items-center py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-all duration-200 transform hover:scale-105"
          aria-label="確認預約"
        >
          立即預約
        </button>
      </div>
    </div>

    <!-- ⏳ 載入狀態 -->
    <div v-else class="loading-state text-center py-12 bg-white rounded-lg shadow-sm">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      <p class="mt-4 text-lg text-gray-600">正在載入看護資料...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCaregiverStore } from '@/stores/caregiverStore';
import { useAppointmentStore } from '@/stores/AppointmentStore';
import myAxios from '@/plugins/axios';

const router = useRouter();
const route = useRoute();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();

const caregiver = ref(null);

// 計算預估總價
const estimatedTotalPrice = computed(async () => { // 將 computed 改為 async
  if (caregiver.value && caregiver.value.caregiverId) {
    console.log('Appointment Time Type in estimate:', appointmentStore.appointment.timeType);
    console.log('Continuous data in estimate:', appointmentStore.continuous);
    try {
      console.log('Fetching estimate price...');
      let amount = null;
      if (appointmentStore.appointment.timeType === 'continuous') {
        const continuous = appointmentStore.continuous;
        const startTimeStr = continuous.startTime ? `${continuous.startTime}:00` : null;
        const endTimeStr = continuous.endTime ? `${continuous.endTime}:00` : null;
        const startTimeParam = continuous.startDate && startTimeStr ? `${continuous.startDate}T${startTimeStr}` : null;
        const endTimeParam = continuous.endDate && endTimeStr ? `${continuous.endDate}T${endTimeStr}` : null;

        const res = await myAxios.get('/api/appointment/estimate/continuous', {
          params: {
            caregiverId: caregiver.value.caregiverId,
            startTime: startTimeParam,
            endTime: endTimeParam,
          },
        });
        amount = res.data;
      } else if (appointmentStore.appointment.timeType === 'multi') {
        const multi = appointmentStore.multi.multi;
        const timeSlots = multi.timeSlots.map(slot => ({
          startTime: slot.startTime ? `${slot.startTime}:00` : null,
          endTime: slot.endTime ? `${slot.endTime}:00` : null,
        }));

        const res = await myAxios.get('/api/appointment/estimate/multi', {
          params: {
            caregiverId: caregiver.value.caregiverId,
            startDate: multi.startDate,
            endDate: multi.endDate,
            repeatDays: multi.repeatDays,
            timeSlots: timeSlots,
          },
        });
        amount = res.data;
      }
      console.log('Estimate price fetched:', amount);
      appointmentStore.appointment.totalPrice = amount; // 更新 store 中的總價
      return amount !== null ? `${amount} 元` : '無法估價';
    } catch (error) {
      console.error('Failed to fetch estimate price in CaregiverProfile:', error);
      appointmentStore.appointment.totalPrice = null;
      return '無法估價';
    }
  }
  return '計算中...';
});

onMounted(async () => {
  const caregiverId = route.params.id;
  console.log('Caregiver ID from route:', caregiverId);

  if (caregiverStore.selectedCaregiver && caregiverStore.selectedCaregiver.caregiverId === parseInt(caregiverId)) {
    caregiver.value = caregiverStore.selectedCaregiver;
    console.log('Caregiver from store:', caregiver.value);
  } else if (caregiverId) {
    try {
      const response = await myAxios.get(`/api/caregivers/${caregiverId}`);
      caregiver.value = response.data;
      caregiverStore.selectCaregiver(response.data); // 更新 store
      console.log('Caregiver details fetched from API:', caregiver.value);
    } catch (error) {
      console.error('Failed to fetch caregiver details:', error);
      // 處理錯誤
    }
  } else {
    console.warn('No caregiver ID available.');
    // 處理沒有 ID 的情況
  }

  // 從 localStorage 加載 appointmentStore 的狀態
  appointmentStore.appointment.timeType = localStorage.getItem('timeType') || 'continuous';
  appointmentStore.continuous.startDate = localStorage.getItem('continuousStartDate') || '';
  appointmentStore.continuous.startTime = localStorage.getItem('continuousStartTime') || '';
  appointmentStore.continuous.endDate = localStorage.getItem('continuousEndDate') || '';
  appointmentStore.continuous.endTime = localStorage.getItem('continuousEndTime') || '';
  appointmentStore.multi.multi.startDate = localStorage.getItem('multiStartDate') || '';
  appointmentStore.multi.multi.endDate = localStorage.getItem('multiEndDate') || '';
  try {
    appointmentStore.multi.multi.repeatDays = JSON.parse(localStorage.getItem('multiRepeatDays') || '{}');
    appointmentStore.multi.multi.timeSlots = JSON.parse(localStorage.getItem('multiTimeSlots') || '[]');
  } catch (error) {
    console.error('Error parsing multi time data from localStorage:', error);
    // 處理錯誤，例如設置為預設值
    appointmentStore.multi.multi.repeatDays = {};
    appointmentStore.multi.multi.timeSlots = [];
  }

  if (caregiverStore.selectedCaregiver) {
    caregiver.value = caregiverStore.selectedCaregiver;
  } else {
    const storedCaregiver = localStorage.getItem('selectedCaregiver');
    if (storedCaregiver) {
      try {
        caregiver.value = JSON.parse(storedCaregiver);
      } catch (error) {
        console.error('Error parsing stored caregiver:', error);
        localStorage.removeItem('selectedCaregiver');
      }
    }
  }

  if (!caregiver.value) {
    const caregiverId = route.params.caregiverId;
    const foundCaregiver = caregiverStore.caregivers.find(c => c.caregiverId === caregiverId);
    if (foundCaregiver) {
      caregiver.value = foundCaregiver;
      caregiverStore.selectCaregiver(foundCaregiver);
      localStorage.setItem('selectedCaregiver', JSON.stringify(foundCaregiver));
    } else {
      console.warn(`找不到 ID 為 ${caregiverId} 的看護`);
      caregiver.value = {};
    }
  }
});

const goBack = () => {
  router.push('/caregivers/list');
};

const confirmBooking = () => {
  if (caregiver.value && caregiver.value.caregiverId) {
    appointmentStore.appointment.caregiverId = caregiver.value.caregiverId;
    router.push(`/request/time?caregiverId=${caregiver.value.caregiverId}`);
  } else {
    console.warn('無法確認預約，看護資料未載入。');
  }
};
</script>

<style scoped>
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card-section {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  transition: transform 0.3s ease;
}

.card-section:hover {
  transform: translateY(-4px);
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  background-color: #e5f4f5;
  border-radius: 8px;
  border: 1px solid #b0e0e6;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #d1ecee;
  color: #0f766e;
  transform: translateX(-2px);
}

.back-button:active {
  transform: scale(0.98);
}

.back-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #0f766e;
}

.back-button svg {
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-3px);
}

.caregiver-image {
  width: 100%;
  max-width: 320px;
  height: 240px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #f87171;
}

.status-badge.available {
  background-color: #34d399;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 1rem;
  color: #1f2937;
  margin-top: 0.25rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.booking-button {
  font-size: 1.125rem;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.booking-button:hover {
  background-color: #115e59;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.booking-button:active {
  transform: scale(0.98);
}

.booking-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #0f766e;
}

.divider {
  width: 1px;
  background-color: #e5e7eb;
  margin: 0 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem 1rem;
  }

  .card-section {
    padding: 1.5rem;
  }

  .caregiver-image {
    max-width: 100%;
    height: 200px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .divider {
    display: none;
  }

  .booking-button {
    font-size: 1rem;
  }
}
</style>