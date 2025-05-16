<template>
  <div class="wrapper">
    <div class="confirmation-card card-section">
      <h2 class="section-title">確認您的預約</h2>

      <!-- 顯示預約資料 -->
      <div class="info-grid">
        <div class="info-item">
          <span class="label">看護姓名</span>
          <span class="value">{{
            caregiverStore.selectedCaregiver?.caregiverName || "未選擇"
          }}</span>
        </div>

        <!-- <div class="info-item">
          <span class="label">看護ID</span>
          <span class="value">{{
            appointmentStore.appointment.caregiverId || "未指定"
          }}</span>
        </div> -->

        <div class="info-item">
          <span class="label">時間類型</span>
          <span class="value">{{
            appointmentStore.appointment.timeType === "continuous"
              ? "連續時間"
              : "多時段預約"
          }}</span>
        </div>

        <!-- 連續時間預約顯示 -->
        <div
          v-if="appointmentStore.appointment.timeType === 'continuous'"
          class="info-item"
        >
          <span class="label">服務時間</span>
          <span class="value">
            {{ formatDateTime(appointmentStore.continuous.startTime) }} 至
            {{ formatDateTime(appointmentStore.continuous.endTime) }}
          </span>
        </div>

        <!-- 多時段預約顯示 -->
        <div
          v-if="appointmentStore.appointment.timeType === 'multi'"
          class="info-item"
        >
          <span class="label">服務日期</span>
          <span class="value">
            {{ appointmentStore.multi.multi.startDate }} 至
            {{ appointmentStore.multi.multi.endDate }}
          </span>
        </div>

        <div class="info-item">
          <span class="label">病患資訊</span>
          <span class="value"
            >{{ appointmentStore.appointment.patientInfo.name || "未填寫" }} /
            {{
              appointmentStore.appointment.patientInfo.gender || "未填寫"
            }}</span
          >
        </div>

        <!-- 顯示疾病 -->
        <div class="info-item">
          <span class="label">疾病</span>
          <span class="value">
            {{
              appointmentStore.appointment.diseaseIds.length > 0
                ? appointmentStore.appointment.diseaseIds
                    .map((id) => appointmentStore.diseaseMap[id] || "未知")
                    .join("、")
                : "未填寫"
            }}
            {{ appointmentStore.appointment.diseaseOther || "" }}
          </span>
        </div>

        <!-- 顯示身體狀況 -->
        <div class="info-item">
          <span class="label">身體狀況</span>
          <span class="value">
            {{
              appointmentStore.appointment.physicalIds.length > 0
                ? appointmentStore.appointment.physicalIds
                    .map((id) => appointmentStore.physicalMap[id] || "未知")
                    .join("、")
                : "未填寫"
            }}
            {{ appointmentStore.appointment.physicalOther || "" }}
          </span>
        </div>

        <!-- 顯示服務項目 -->
        <div class="info-item">
          <span class="label">服務項目</span>
          <span class="value">
            {{
              appointmentStore.appointment.serviceIds.length > 0
                ? appointmentStore.appointment.serviceIds
                    .map((id) => appointmentStore.serviceMap[id] || "未知")
                    .join("、")
                : "未填寫"
            }}
            {{ appointmentStore.appointment.serviceOther || "" }}
          </span>
        </div>

        <!-- 詳細位置資訊 -->
        <div class="info-item">
          <span class="label">服務地點</span>
          <span class="value">
            {{
              appointmentStore.appointment.locationType === "居家"
                ? "居家"
                : "醫院"
            }}
          </span>
        </div>

        <!-- 醫院位置詳情 -->
        <div
          v-if="appointmentStore.appointment.locationType === '醫院'"
          class="info-item"
        >
          <span class="label">醫院名稱</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalName
          }}</span>

          <span class="label">醫院地址</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalAddress
          }}</span>

          <span class="label">病房類別</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalWardType
          }}</span>

          <span class="label">病房號</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalWardNumber
          }}</span>

          <span class="label">病床號</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalBedNumber
          }}</span>

          <span class="label">科別</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalDepartment || "未填寫"
          }}</span>

          <span class="label">交通路線或注意事項</span>
          <span class="value">{{
            appointmentStore.appointment.hospitalTransportNote || "無"
          }}</span>
        </div>

        <!-- 居家位置詳情 -->
        <div
          v-if="appointmentStore.appointment.locationType === '居家'"
          class="info-item"
        >
          <span class="label">居家地址</span>
          <span class="value">{{
            appointmentStore.appointment.homeAddress
          }}</span>

          <span class="label">交通路線或注意事項</span>
          <span class="value">{{
            appointmentStore.appointment.homeTransportNote || "無"
          }}</span>
        </div>

        <div class="info-item">
          <span class="label">預估總價</span>
          <span class="value">
            {{
              appointmentStore.appointment.totalPrice
                ? `${appointmentStore.appointment.totalPrice} 元`
                : "計算中..."
            }}
          </span>
        </div>
      </div>

      <!-- 按鈕區域 -->
      <div class="button-group">
        <!-- 送出預約按鈕 -->
        <button
          @click="submitAppointment"
          class="booking-button"
          aria-label="送出預約"
        >
          下一步：付款
        </button>

        <!-- 更改需求單按鈕 -->
        <button
          @click="goBackToRequest"
          class="edit-button"
          aria-label="更改需求單"
        >
          更改需求單
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCaregiverStore } from "@/stores/caregiverStore";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import myAxios from "@/plugins/axios";
import Swal from "sweetalert2";

const router = useRouter();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();

// 🗓️ 日期和時間格式化函數
const formatDateTime = (isoString) => {
  if (!isoString) return "未填寫";

  // 確保是 ISO 8601 格式
  const [date, time] = isoString.split("T");

  // 只返回 yyyy-MM-dd HH:mm 格式
  return `${date} ${time}`;
};

// 送出預約
const submitAppointment = async () => {
  try {
    // 顯示「建立預約中...」的 SweetAlert
    const swalLoading = Swal.fire({
      title: "建立預約中...",
      text: "請稍候，我們正在處理您的預約。",
      allowOutsideClick: false, // 禁止外部點擊關閉彈窗
      didOpen: () => {
        Swal.showLoading();
      },
    });
    // ✅ 呼叫 Store Action 建立預約
    const appointmentId = await appointmentStore.submitAppointment();

    console.log("預約建立成功，預約 ID:", appointmentId);

    // ✅ 清空 LocalStorage 以避免污染
    localStorage.removeItem("appointmentData");
    localStorage.removeItem("appointmentId");

    // ✅ 將 appointmentId 儲存到 localStorage
    localStorage.setItem("appointmentId", appointmentId);

    router.push(`/payment/${appointmentId}`);

    swalLoading.close();
  } catch (error) {
    console.error("預約送出失敗:", error);
    alert("發生錯誤，請稍後再試");

    Swal.close();
  }
};

// 返回需求單頁面
const goBackToRequest = () => {
  router.push("/request/location");
};

onMounted(() => {
  appointmentStore.loadFromLocalStorage();
});
</script>

<style scoped>
/* Global styles */
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

/* Card styling */
.card-section {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* .card-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
} */

/* Title styling */
.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
}

/* Info grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.info-item:hover {
  background-color: #f1f5f9;
}

.label {
  font-size: 0.995rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1rem;
  color: #1e293b;
  line-height: 1.5;
}

/* Button group */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

/* Booking button */
.booking-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
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

.booking-button:hover {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.booking-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.booking-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.3);
}

/* Edit button */
.edit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  background-color: #e2e8f0;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.3s ease;
}

.edit-button:hover {
  background-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.edit-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.edit-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(203, 213, 225, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem 0.75rem;
  }

  .card-section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .booking-button,
  .edit-button {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.25rem;
  }

  .info-item {
    padding: 0.75rem;
  }

  .label {
    font-size: 0.75rem;
  }

  .value {
    font-size: 0.875rem;
  }
}
</style>
