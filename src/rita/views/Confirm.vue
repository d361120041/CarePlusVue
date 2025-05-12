<template>
  <div class="wrapper">
    <div class="confirmation-card card-section">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">確認您的預約</h2>

      <!-- 顯示預約資料 -->
      <div class="info-grid">
        <div class="info-item">
          <span class="label">看護姓名</span>
          <span class="value">{{
            caregiverStore.selectedCaregiver?.caregiverName || "未選擇"
          }}</span>
        </div>

        <div class="info-item">
          <span class="label">看護ID</span>
          <span class="value">{{
            appointmentStore.appointment.caregiverId || "未指定"
          }}</span>
        </div>

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
            {{ appointmentStore.continuous.startDate }}
            {{ appointmentStore.continuous.startTime }} 至
            {{ appointmentStore.continuous.endDate }}
            {{ appointmentStore.continuous.endTime }}
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

          <span class="label">科别</span>
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
      <div class="button-group mt-8">
        <!-- 送出預約按鈕 -->
        <button
          @click="submitAppointment"
          class="booking-button w-full flex justify-center items-center py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-all duration-200 transform hover:scale-105"
          aria-label="送出預約"
        >
          送出預約
        </button>

        <!-- 更改需求單按鈕 -->
        <button
          @click="goBackToRequest"
          class="edit-button w-full flex justify-center items-center py-3 bg-gray-300 text-gray-800 rounded-full font-medium hover:bg-gray-400 transition-all duration-200 transform hover:scale-105 mt-4"
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

const router = useRouter();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();

// 送出預約
const submitAppointment = async () => {
  try {
    // ✅ 呼叫 Store Action 建立預約
    const appointmentId = await appointmentStore.submitAppointment();

    // ✅ 將 appointmentId 儲存到 localStorage
    localStorage.setItem("appointmentId", appointmentId);

    // ✅ 跳轉到付款頁面
    router.push(`/payment/${appointmentId}`);
  } catch (error) {
    console.error("預約送出失敗:", error);
    alert("發生錯誤，請稍後再試");
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
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease,
    opacity 0.2s ease;
}

.booking-button:hover {
  background: linear-gradient(135deg, #0d615a 0%, #0f4d47 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  opacity: 0.95;
}

.booking-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booking-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.3);
}

.edit-button {
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.edit-button:hover {
  background-color: #d1d5db;
  transform: scale(1.02);
}
</style>
