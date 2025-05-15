<template>
  <div class="wrapper">
    <h2 class="section-title">📝 我的訂單紀錄</h2>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <p>資料加載中，請稍候...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="appointments.length === 0" class="empty-state">
  <p class="empty-message">等待是一種美德，下一位需要您照顧的客戶，或許正在路上。</p>
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

// 狀態變數
const appointments = ref([]);
const isLoading = ref(true);
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
  } finally {
    isLoading.value = false;
  }
};

const startNewAppointment = () => {
  router.push('/request/location');
};

onMounted(fetchAppointments);
</script>

<style scoped>
/* ✅ 外層容器 */
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ✅ 標題樣式 */
.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
  text-align: center;
}

/* ✅ Loading 狀態 */
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1.2rem;
}

/* ✅ 空狀態區塊 */
.empty-state {
  text-align: center;
  margin: 40px auto;
  padding: 2rem 1.5rem;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.empty-message {
  font-size: 1.25rem;
  color: #475569;
  font-weight: 500;
}

/* ✅ 訂單網格 */
.appointment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* ✅ 訂單卡片 */
.appointment-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.appointment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  border-color: #d1d5db;
}

/* ✅ 卡片標題 */
.card-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

/* ✅ 資訊群組 */
.info-group {
  padding: 0.75rem 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.75rem;
}

/* ✅ 資訊項目 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 1rem;
  color: #1e293b;
  text-align: right;
  font-weight: 500;
}

/* ✅ 區塊副標題 */
.section-subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: #475569;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* ✅ 隱藏預設空白 SVG */
.empty-icon {
  display: none;
}

/* ✅ 按鈕樣式 */
.action-button {
  background-color: #007bff;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.2s;
}

.action-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

/* ✅ 行動按鈕可視化 */
.action-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
}

</style>
