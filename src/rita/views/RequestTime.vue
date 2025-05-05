<template>
  <div class="wrapper">
    <!-- 進度指示條 -->
    <div class="progress-bar">
      <div class="progress-step active">
        <span class="circle">1</span>
        時間類型
      </div>
      <span class="progress-arrow">></span>
      <div class="progress-step">
        <span class="circle">2</span>
        被照顧者資訊
      </div>
      <span class="progress-arrow">></span>
      <div class="progress-step">
        <span class="circle">3</span>
        服務地點
      </div>
    </div>

    <!-- 左右布局 -->
    <div class="container">
      <!-- 左邊區塊 -->
      <div class="main-section">
        <div class="card-section">
          <h3>居家/醫院看護需求單</h3>
          <!-- 時間類型 -->
          <div class="form-item">
            <label>時間類型</label>
            <div class="radio-group">
              <input
                type="radio"
                id="continuous"
                name="time-type"
                value="continuous"
                v-model="form.timeType"
                @change="showTimeOptions('continuous')"
              />
              <label for="continuous">連續時間</label>
              <input
                type="radio"
                id="multi"
                name="time-type"
                value="multi"
                v-model="form.timeType"
                @change="showTimeOptions('multi')"
              />
              <label for="multi">多時段預訂</label>
            </div>
          </div>

          <!-- 連續時間選項 -->
          <div
            id="continuous-time"
            class="time-options"
            :class="{ 'block': form.timeType === 'continuous', 'hidden': form.timeType !== 'continuous' }"
          >
            <div class="form-row">
              <div class="form-item">
                <label>服務開始 日期/時間</label>
                <input type="date" v-model="form.continuous.startDate" required />
                <input type="time" v-model="form.continuous.startTime" required />
              </div>
              <div class="form-item">
                <label>服務結束 日期/時間</label>
                <input type="date" v-model="form.continuous.endDate" required />
                <input type="time" v-model="form.continuous.endTime" required />
              </div>
            </div>
          </div>

          <!-- 多時段預訂選項 -->
          <div
            id="multi-time"
            class="time-options"
            :class="{ 'block': form.timeType === 'multi', 'hidden': form.timeType !== 'multi' }"
          >
            <div class="form-row">
              <div class="form-item">
                <label>服務開始 日期</label>
                <input type="date" v-model="form.multi.startDate" required />
              </div>
              <div class="form-item">
                <label>服務結束 日期</label>
                <input type="date" v-model="form.multi.endDate" required />
              </div>
            </div>
            <div class="form-item">
              <label>其他設定 *可複選</label>
              <div class="checkbox-group">
                <label v-for="day in days" :key="day" class="checkbox-item">
                  <input type="checkbox" :value="day" v-model="form.multi.repeatDays" />
                  {{ day }}
                </label>
              </div>
            </div>
            <div class="form-item">
              <label>固定每天的時間（幾點到幾點）</label>
              <div v-for="(slot, index) in form.multi.timeSlots" :key="index" class="form-row time-slot">
                <input
                  type="time"
                  v-model="slot.startTime"
                  placeholder="服務開始"
                  class="form-item"
                />
                <input
                  type="time"
                  v-model="slot.endTime"
                  placeholder="服務結束"
                  class="form-item"
                />
                <button @click="form.multi.timeSlots.splice(index, 1)" class="remove-btn">
                  移除
                </button>
              </div>
              <div class="add-time-slot" @click="addTimeSlot">＋新增時間</div>
            </div>
          </div>

          <button
            class="submit-btn"
            :class="{ 'disabled': !isFormComplete }"
            :disabled="!isFormComplete"
            @click="submitForm"
          >
            確認並繼續
          </button>
        </div>
      </div>

      <!-- 右邊區塊 -->
      <div class="sidebar">
  <div class="card-section">
    <h3>預約流程指南</h3>
    <p style="color: gray;">為了保障您的權益並提升媒合效率，平台將以以下步驟協助您預約服務：</p>
    <ol style="margin-top: 1rem;">
      <li><strong>填寫需求單</strong><br>讓看護能快速了解您的照護需求。</li>
      <li><strong>資訊分享</strong><br>您的預約資訊（不含個人資料）將提供給合適的看護進行初步評估。</li>
      <li><strong>進一步聯繫</strong><br>若看護有意願接案，即可進行合約確認及付款程序。</li>
    </ol>
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppointmentStore } from '@/stores/AppointmentStore';

const form = ref({
  timeType: 'continuous',
  continuous: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  },
  multi: {
    startDate: '',
    endDate: '',
    repeatDays: [],
    timeSlots: [{ startTime: '', endTime: '' }],
  },
});

const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

const appointmentStore = useAppointmentStore();
const router = useRouter();

// 檢查表單是否填寫完整
const isFormComplete = computed(() => {
  if (form.value.timeType === 'continuous') {
    return (
      form.value.continuous.startDate &&
      form.value.continuous.startTime &&
      form.value.continuous.endDate &&
      form.value.continuous.endTime
    );
  } else {
    // 檢查多時段預訂的必填字段
    const hasDates = form.value.multi.startDate && form.value.multi.endDate;
    const hasValidTimeSlots = form.value.multi.timeSlots.every(
      (slot) => slot.startTime && slot.endTime
    );
    return hasDates && hasValidTimeSlots;
  }
});

const showTimeOptions = (type) => {
  form.value.timeType = type;
};

const addTimeSlot = () => {
  form.value.multi.timeSlots.push({ startTime: '', endTime: '' });
};

const submitForm = () => {
  if (!isFormComplete.value) return;

  if (form.value.timeType === 'continuous') {
    const start = `${form.value.continuous.startDate}T${form.value.continuous.startTime}`;
    const end = `${form.value.continuous.endDate}T${form.value.continuous.endTime}`;
    appointmentStore.setTime('continuous', { startTime: start, endTime: end });
  } else {
    const payload = {
      startDate: form.value.multi.startDate,
      endDate: form.value.multi.endDate,
      repeatDays: form.value.multi.repeatDays,
      timeSlots: form.value.multi.timeSlots,
    };
    appointmentStore.setTime('multi', payload);
  }

  router.push('/request/patient');
};
</script>

<style scoped>
/* ============================== */
/* 全局樣式                       */
/* ============================== */
body {
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ============================== */
/* 進度條樣式                    */
/* ============================== */
.progress-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-left: 30px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #d1d5db;
}

.progress-step.active {
  color: #60a5fa;
}

.progress-step .circle {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #d1d5db;
}

.progress-step.active .circle {
  border-color: #60a5fa;
  color: #60a5fa;
}

.progress-arrow {
  color: #d1d5db;
  font-size: 1.25rem;
}

/* ============================== */
/* 布局容器樣式                  */
/* ============================== */
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.main-section {
  flex: 1;
  min-width: 600px;
}

.card-section {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 60px 30px;
}

.sidebar {
  flex: 0 0 300px;
  min-width: 280px;
}

.sidebar h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.sidebar h3::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><path d="M12 5.67v15.56m-7.78-7.78h15.56"/></svg>') no-repeat center;
  background-size: 24px;
}

.sidebar p {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.main-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

/* ============================== */
/* 表單元素樣式                  */
/* ============================== */
.form-item {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-item label {
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
}

.form-item input:not([type="radio"]):not([type="checkbox"]) {
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  color: #4b5563;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.form-item input[type="date"],
.form-item input[type="time"] {
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>') no-repeat right 0.75rem center;
  background-size: 16px;
}

.form-item input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.form-item .radio-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.form-item input[type="radio"] {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  cursor: pointer;
}

.form-item input[type="radio"]:checked {
  border-color: #60a5fa;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="#60a5fa" stroke-width="4"/></circle><circle cx="12" cy="12" r="6" fill="#60a5fa"/></svg>') center;
  background-size: 12px;
}

.form-item .radio-group label {
  font-size: 1rem;
  color: #4b5563;
  cursor: pointer;
}

.form-item .checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.form-item .checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.form-item input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.form-item input[type="checkbox"]:checked {
  background-color: #60a5fa;
  border-color: #60a5fa;
}

/* ============================== */
/* 時間選擇器樣式                */
/* ============================== */
.time-options {
  margin-top: 1.5rem;
}

.time-options.block {
  display: block;
}

.time-options.hidden {
  display: none;
}

.time-slot {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  align-items: center; /* 確保子元素垂直居中 */
}

.time-slot input[type="time"] {
  box-sizing: border-box;
  width: 120px; /* 固定寬度，確保一致性 */
  height: 32px; /* 與按鈕高度一致 */
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1; /* 統一基線 */
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>') no-repeat right 0.5rem center;
  background-size: 16px;
}

/* ============================== */
/* 按鈕樣式                      */
/* ============================== */
.time-slot .remove-btn {
  box-sizing: border-box;
  height: 32px; /* 與輸入框高度一致 */
  min-width: 60px;
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #EF4444;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1; /* 統一基線 */
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.time-slot .remove-btn:hover {
  background-color: #DC2626;
}

.add-time-slot {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #4DB6AC;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;
}

.add-time-slot:hover {
  color: #2A9287;
}

.submit-btn {
  display: block;
  margin: 2rem auto 0;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 5px;
  background-color: #4DB6AC;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #3a9d93;
}

.submit-btn.disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.submit-btn.disabled:hover {
  background-color: #d1d5db;
}

/* ============================== */
/* 表單行樣式                    */
/* ============================== */
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
</style>