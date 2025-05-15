<template>
  <div class="wrapper">
    <h2 class="section-title">我的預約紀錄</h2>

    <!-- Empty state -->
    <div v-if="appointments.length === 0" class="empty-state">
      <svg
        class="empty-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <p class="empty-message">尚無預約紀錄。立即開始您的第一筆預約吧！</p>
      <button
        @click="startNewAppointment"
        class="action-button"
        aria-label="開始新預約"
      >
        開始預約
      </button>
    </div>

    <!-- Appointment list -->
    <div v-else class="appointment-grid">
      <div
        v-for="appointment in appointments"
        :key="appointment.appointmentId"
        class="appointment-card"
      >
        <div class="card-header">
          <h5 class="card-title">
            預約編號：{{
              appointment.appointmentId
                ? `carePlus0522id${appointment.appointmentId}`
                : "未提供"
            }}
          </h5>
          <!-- <span
            :class="['status-badge', getStatusClass(appointment.status)]"
          >
            {{ appointment.status }}
          </span> -->
        </div>
        <div class="card-body">
          <!-- Core appointment info -->
          <div class="info-group">
            <!-- <div class="info-item">
              <span class="label">預約時間</span>
              <span class="value">{{ formatDate(appointment.patient.birthday) }}</span>
            </div> -->
            <div class="info-item">
              <span class="label">價格:</span>
              <span class="value">{{ appointment.totalPrice ? `${appointment.totalPrice} 元` : "未提供" }}</span>
            </div>
            <div class="info-item">
              <span class="label">照服員:</span>
              <span class="value">{{ appointment.caregiver.caregiverName || "未提供" }}</span>
            </div>
          </div>

          <!-- Location info -->
          <div class="info-group">
            <h6 class="section-subtitle">{{ appointment.locationType === '醫院' ? '醫院資訊' : '居家資訊' }}</h6>
            <div v-if="appointment.locationType === '醫院'" class="info-item">
              <span class="label">名稱:</span>
              <span class="value">{{ appointment.hospitalName || "未提供" }}</span>
            </div>
            <div class="info-item">
              <span class="label">地址:</span>
              <span class="value">{{ appointment.locationType === '醫院' ? appointment.hospitalAddress : appointment.homeAddress || "未提供" }}</span>
            </div>
            <div v-if="appointment.locationType === '醫院'" class="info-item">
              <span class="label">病房:</span>
              <span class="value">{{ appointment.hospitalWardType }} {{ appointment.hospitalWardNumber || "" }} {{ appointment.hospitalBedNumber || "" }}</span>
            </div>
            <div v-if="appointment.locationType === '醫院'" class="info-item">
              <span class="label">科別:</span>
              <span class="value">{{ appointment.hospitalDepartment || "未提供" }}</span>
            </div>
            <div class="info-item">
              <span class="label">運送備註:</span>
              <span class="value">{{ appointment.locationType === '醫院' ? appointment.hospitalTransportNote : appointment.homeTransportNote || "無" }}</span>
            </div>
          </div>

          <!-- Patient info -->
          <div v-if="appointment.patientId?.length > 0" class="info-group">
            <h6 class="section-subtitle">病患資訊</h6>
            <div class="info-item">
              <span class="label">姓名</span>
              <span class="value">{{ appointment.patients[0]?.name || "未提供" }}</span>
            </div>
            <div class="info-item">
              <span class="label">性別</span>
              <span class="value">{{ appointment.patients[0]?.gender === 1 ? '男性' : '女性' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const userId = ref(null);
const appointments = ref([]);
const router = useRouter();
const authStore = useAuthStore();

const fetchAppointments = async () => {
  try {
    const res = await axios.get(`/api/appointment/user/${userId.value}`);
    appointments.value = res.data;
  } catch (err) {
    console.error('無法取得預約資料', err);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '未提供';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', '');
  } catch (error) {
    console.error('Invalid date format:', dateStr);
    return '無效日期';
  }
};

// const getStatusClass = (status) => {
//   switch (status) {
//     case '已確認':
//       return 'status-confirmed';
//     case '待付款':
//       return 'status-pending';
//     case '已取消':
//       return 'status-cancelled';
//     default:
//       return 'status-default';
//   }
// };

const startNewAppointment = () => {
  router.push('/request/location');
};

onMounted(async () => {

  console.log("User ID:", userId.value);
  // 檢查是否已經登錄
  if (!authStore.isAuthenticated) {
    router.push('/userlogin'); // 未登入，跳轉到登入頁
    return;
  }

  // 使用 userId 獲取預約資料
  userId.value = authStore.user.userId;
  await fetchAppointments();
});
</script>

<style scoped>
/* Global wrapper */
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Section title */
.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
}

/* Empty state */
.empty-state {
  background-color: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #475569;
  margin-bottom: 1.5rem;
}

.empty-message {
  font-size: 1.125rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.action-button:hover {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.action-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.3);
}

/* Appointment grid */
.appointment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
}

/* Appointment card */
.appointment-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.appointment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

/* Card header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

/* Status badge */
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-confirmed {
  background-color: #d1fae5;
  color: #047857;
}

.status-pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-default {
  background-color: #e5e7eb;
  color: #4b5563;
}

/* Card body */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Info group */
.info-group {
  padding: 0.75rem 0;
  border-top: 1px solid #e5e7eb;
}

.info-group:first-child {
  border-top: none;
  padding-top: 0;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 0.875rem;
  color: #1e293b;
  text-align: right;
}

/* Responsive design */
@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem 0.75rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .appointment-grid {
    grid-template-columns: 1fr;
  }

  .appointment-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
  }

  .empty-message {
    font-size: 1rem;
  }

  .action-button {
    font-size: 1rem;
    padding: 0.625rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 0.875rem;
  }

  .label, .value {
    font-size: 0.75rem;
  }

  .status-badge {
    font-size: 0.625rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>