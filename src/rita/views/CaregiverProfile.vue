<template>
  <!-- 🔙 返回按鈕 -->
  <button
    @click="goBack"
    class="back-button flex items-center text-teal-600 hover:text-teal-700 transition-colors duration-200 py-2 px-2 rounded-md mt-2 ml-4 mb-9"
    aria-label="返回搜尋結果"
  >
    ⬅︎ 返回搜尋結果
  </button>
  <div class="wrapper">
    <!-- 👤 看護個人資料區塊 -->
    <div v-if="caregiver" class="caregiver-profile card-section">
      <div class="flex flex-col md:flex-row gap-12">
        <!-- 左側：看護資訊 -->
        <div class="flex-1 space-y-10">
          <!-- 📸 看護照片和姓名 -->
          <div class="flex items-center gap-6 profile-header">
            <!-- 📸 圓形大頭貼 -->
            <div class="flex-shrink-0 relative">
              <img
                class="caregiver-image"
                :src="
                  caregiver.photoPath ||
                  'https://finalimagesbucket.s3.ap-northeast-1.amazonaws.com/default-placeholder.jpg'
                "
                :alt="`看護 ${caregiver.caregiverName}`"
                loading="lazy"
              />
            </div>

            <!-- 🧾 姓名 -->
            <h1 class="caregiver-name">
              {{ caregiver.caregiverName }}
            </h1>
          </div>
          <!-- 📋 基本資訊與薪資資訊 -->
          <div class="info-container">
            <!-- 基本資訊 -->
            <div class="info-section">
              <h3 class="section-title">基本資訊</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">性別</span>
                  <span class="value">{{ caregiver.gender || "未知" }}</span>
                </div>
                <div class="info-item">
                  <span class="label">國籍</span>
                  <span class="value">{{
                    caregiver.nationality || "未知"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">語言</span>
                  <span class="value">
                    <template v-if="Array.isArray(caregiver?.languages)">
                      {{ caregiver.languages.join(", ") }}
                    </template>
                    <template v-else>
                      {{ caregiver?.languages || "未知" }}
                    </template>
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">經驗年數</span>
                  <span class="value">{{ caregiver.yearOfExperience }} 年</span>
                </div>
              </div>
            </div>

            <!-- 薪資資訊 -->
            <div class="info-section salary-section mb-8">
              <h3 class="section-title">薪資資訊</h3>
              <div class="info-grid salary-grid">
                <div class="info-item">
                  <span class="label">時薪</span>
                  <span class="value">{{
                    caregiver.hourlyRate
                      ? `${caregiver.hourlyRate} 元/小時`
                      : "未提供"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">半日薪</span>
                  <span class="value">{{
                    caregiver.halfDayRate
                      ? `${caregiver.halfDayRate} 元/6小時`
                      : "未提供"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">日薪</span>
                  <span class="value">{{
                    caregiver.fullDayRate
                      ? `${caregiver.fullDayRate} 元/8小時`
                      : "未提供"
                  }}</span>
                </div>
              </div>

              <!-- 📄 詳細介紹 -->
              <div class="info-section description-section mt-8">
                <h3 class="section-title">詳細介紹</h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ caregiver.description || "尚無詳細介紹" }}
                </p>
              </div>
            </div>
          </div>

          <!-- 預估總價 -->
          <div>
            <h4 class="section-title mb-4">預估總價：</h4>
            <p class="text-xl font-semibold text-teal-700">
              {{
                caregiver.totalPrice
                  ? `${caregiver.totalPrice} 元`
                  : "計算中..."
              }}
            </p>
          </div>
        </div>
        <!-- 分隔線 -->
        <div class="divider"></div>
        <!-- 右側：使用者輸入資訊 -->
        <div class="flex-1 space-y-6">
          <div class="info-grid"></div>
        </div>
      </div>
      <!-- ✅ 預約按鈕 -->
      <div class="mt-8">
        <button
          @click="confirmBooking"
          class="booking-button w-full flex justify-center items-center py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-all duration-200 transform hover:scale-105"
          aria-label="確認預約"
        >
          預約此照服員
        </button>
      </div>
    </div>
    <!-- ⏳ 載入狀態 -->
    <div
      v-else
      class="loading-state text-center py-12 bg-white rounded-lg shadow-sm"
    >
      <div
        class="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"
      ></div>
      <p class="mt-4 text-lg text-gray-600">正在載入看護資料...</p>
    </div>
  </div>
</template>

<script setup>
/* 👉 1️⃣ 匯入區 */
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCaregiverStore } from "@/stores/caregiverStore";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import myAxios from "@/plugins/axios";

/* 👉 2️⃣ 初始化區 */
const router = useRouter();
const route = useRoute();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();
const caregiver = ref(null);

/* 👉 3️⃣ 導頁函式 */
const goBack = () => {
  router.push("/caregivers/list");
};

const confirmBooking = () => {
  if (caregiver.value && caregiver.value.caregiverId) {
    selectCaregiver(caregiver.value.caregiverId);
    appointmentStore.appointment.totalPrice = caregiver.value.totalPrice;
    router.push(`/request/time?caregiverId=${caregiver.value.caregiverId}`);
  } else {
    console.warn("無法確認預約，看護資料未載入。");
  }
};

/* 👉 4️⃣ onMounted - 取得看護資料與還原預約資訊 */
onMounted(async () => {
  const caregiverId = route.params.id;
  if (
    caregiverStore.selectedCaregiver &&
    caregiverStore.selectedCaregiver.caregiverId === parseInt(caregiverId)
  ) {
    caregiver.value = caregiverStore.selectedCaregiver;
  } else if (caregiverId) {
    try {
      const response = await myAxios.get(`/api/caregivers/${caregiverId}`);
      caregiver.value = response.data;
      caregiverStore.selectCaregiver(response.data); // 更新 store
    } catch (error) {
      console.error("Failed to fetch caregiver details:", error);
      // 處理錯誤
    }
  } else {
    console.warn("No caregiver ID available.");
    // 處理沒有 ID 的情況
  }

  // 從 localStorage 加載 appointmentStore 的狀態
  appointmentStore.appointment.timeType =
    localStorage.getItem("timeType") || "continuous";
  appointmentStore.continuous.startDate =
    localStorage.getItem("continuousStartDate") || "";
  appointmentStore.continuous.startTime =
    localStorage.getItem("continuousStartTime") || "";
  appointmentStore.continuous.endDate =
    localStorage.getItem("continuousEndDate") || "";
  appointmentStore.continuous.endTime =
    localStorage.getItem("continuousEndTime") || "";
  appointmentStore.multi.multi.startDate =
    localStorage.getItem("multiStartDate") || "";
  appointmentStore.multi.multi.endDate =
    localStorage.getItem("multiEndDate") || "";
  try {
    appointmentStore.multi.multi.repeatDays = JSON.parse(
      localStorage.getItem("multiRepeatDays") || "{}"
    );
    appointmentStore.multi.multi.timeSlots = JSON.parse(
      localStorage.getItem("multiTimeSlots") || "[]"
    );
  } catch (error) {
    console.error("Error parsing multi time data from localStorage:", error);
    // 處理錯誤，例如設置為預設值
    appointmentStore.multi.multi.repeatDays = {};
    appointmentStore.multi.multi.timeSlots = [];
  }

  if (!caregiver.value) {
    if (foundCaregiver) {
      caregiver.value = foundCaregiver;
      caregiverStore.selectCaregiver(foundCaregiver);
      localStorage.setItem("selectedCaregiver", JSON.stringify(foundCaregiver));
    } else {
      console.warn(`找不到 ID 為 ${caregiverId} 的看護`);
      caregiver.value = {};
    }
  }
});

// 🔄 當使用者選擇看護時儲存 ID
const selectCaregiver = (caregiverId) => {
  localStorage.setItem("caregiverId", caregiverId);
  appointmentStore.setCaregiverId(caregiverId);
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

.back-button {
  padding: 1.75rem 1.5rem;
  background-color: #4db6ac;
  color: #fff;
  border: none;
  border-radius: 8px;
  margin-top: 2rem;
  margin-left: 17rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-button:hover,
.back-button:focus {
  background-color: #3d9c93;
  transform: translateY(-2px);
  outline: none;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2);
}

.caregiver-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* 控制頭貼和名字的距離 */
}

.caregiver-name {
  font-size: 3.5rem; /* 根據需要調整字體大小 */
  font-weight: bold;
  color: #0f766e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 150px); /* 頭貼寬度 + 間距 */
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background-color: #f87171;
}

.status-badge.available {
  background-color: #34d399;
}

.info-container {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 2rem; /* 增加內距 */
  margin-bottom: 2rem; /* 增加外距  */
}

.info-section {
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
}

.salary-grid {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.description-section {
  margin-top: 2rem; /* 增加上方間隔 */
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

.booking-button:disabled {
  background: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.divider {
  width: 1px;
  background-color: #e5e7eb;
  margin: 0 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 1rem; /* 增加頂部間距 */
  }

  .card-section {
    padding: 1.5rem;
  }

  .caregiver-image {
    width: 100px;
    height: 100px;
  }

  .flex-nowrap {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 1.5rem; /* 控制頭貼與名字的間距 */
  }

  .truncate {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }

  .info-grid,
  .salary-grid {
    grid-template-columns: 1fr;
  }

  .info-container {
    padding: 1rem;
  }

  .divider {
    display: none;
  }

  .booking-button {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .booking-button {
    padding: 0.65rem 1.25rem;
    font-size: 1rem;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .booking-button {
    padding: 0.5rem 1rem;
    font-size: 0.9375rem;
  }
}
</style>
