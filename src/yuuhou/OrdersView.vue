<template>
  <div class="wrapper">
    <h2 class="section-title">📝 我的訂單紀錄</h2>

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
      <button @click="startNewAppointment" class="action-button" aria-label="開始新預約">
        開始預約
      </button>
    </div>

    <!-- Appointment list -->
    <div v-else class="appointment-grid">
      <div v-for="appointment in appointments" :key="appointment.appointmentId" class="appointment-card">
        <div class="card-header">
          <h5 class="card-title">
            訂單編號：{{ appointment.appointmentId ? `carePlus0522id${appointment.appointmentId}` : "未提供" }}
          </h5>
        </div>
        <div class="card-body">
          <div class="info-group">
              <div class="info-item">
                <span class="label">客戶姓名</span>
                <span class="value">{{ appointment.user.userName || "未提供" }}</span>
              </div>
              <div class="info-item">
                  <span class="label">價格</span>
                  <span class="value">{{ appointment.totalPrice ? `${appointment.totalPrice} 元` : "未提供" }}</span>
                </div>
                <div class="info-item">
                  <span class="label">生日</span>
                  <span class="value">{{ formatDate(appointment.patient.birthday) }}</span>
                </div>
          </div>

          <div class="info-group">
            <h6 class="section-subtitle">病患資訊</h6>
            <div class="info-item">
              <span class="label">姓名</span>
              <span class="value">{{ appointment.patient.name ||  "未提供" }}</span>
            </div>
            <div class="info-item">
              <span class="label">性別</span>
              <span class="value">{{ appointment.patients && appointment.patients.length > 0 && appointment.patients[0].gender === 1 ? '男性' : '女性' }}</span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import auth from '@/api/auth';
import { useRouter } from 'vue-router';

// 訂單資料
const appointments = ref([]);
const router = useRouter();

// 日期格式化函數
const formatDate = (datetimeString) => {
  if (!datetimeString) return "未提供";
  const date = new Date(datetimeString);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleString('zh-TW', options);
};

// 讀取登入中的照服員訂單紀錄
const fetchAppointments = async () => {
  try {
    const { data } = await auth.getMyAppointments();
    console.log("📄 訂單紀錄", data);
    appointments.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ 無法載入訂單紀錄", err);
    if (err.response && err.response.status === 401) {
      alert("❌ 登入憑證過期，請重新登入");
      window.location.href = "/caregiverLogin";
    } else {
      alert("❌ 無法載入資料，請重新登入");
    }
  }
};

const startNewAppointment = () => {
  router.push('/request/location');
};

onMounted(fetchAppointments);
</script>

<style scoped>
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
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

/* Info group */
.info-group {
  padding: 0.75rem 0;
  border-top: 1px solid #e5e7eb;
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
</style>
