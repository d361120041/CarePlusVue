<template>
  <div class="wrapper">
    <!-- 🔙 返回按鈕 -->
    <button
      @click="goBack"
      class="back-button flex items-center text-teal-600 hover:text-teal-700 transition-colors duration-200 py-2 px-2 rounded-md mt-2 ml-4 mb-9"
      aria-label="返回搜尋結果"
    >
      ⬅︎ 返回搜尋結果
    </button>

    <!-- 👤 看護個人資料區塊 -->
    <div v-if="caregiver" class="caregiver-profile card-section">
      <div class="flex flex-col md:flex-row gap-12">
        <!-- 左側：看護資訊 -->
        <div class="flex-1 space-y-10">
          <!-- 📸 看護照片和姓名 -->
          <div class="flex items-center gap-6 flex-nowrap">
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
            <h1 class="text-3xl font-bold text-teal-700 truncate">
              {{ caregiver.caregiverName }}
            </h1>
          </div>

          <!-- 📋 基本資訊與薪資資訊 -->
          <div class="info-container">
            <h3 class="section-title mb-4">基本資訊</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">性別</span>
                <span class="value">{{ caregiver.gender || "未知" }}</span>
              </div>
              <div class="info-item">
                <span class="label">國籍</span>
                <span class="value">{{ caregiver.nationality || "未知" }}</span>
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

            <h3 class="section-title mt-8 mb-4">薪資資訊</h3>
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
          </div>

          <!-- 📄 詳細介紹 -->
          <div>
            <h3 class="section-title mb-4">詳細介紹</h3>
            <p class="text-gray-600 leading-relaxed">
              {{ caregiver.description || "尚無詳細介紹" }}
            </p>
          </div>

          <!-- 預估總價 -->
          <!-- 修改：將預估總價移至左側容器內，與其他資訊垂直對齊 -->
          <div>
            <h4 class="section-title mb-4">預估總價</h4>
            <p class="text-xl font-semibold text-teal-700">
              {{
                caregiver.totalPrice ? `${caregiver.totalPrice} 元` : "計算中..."
              }}
            </p>
          </div>
        </div>

        <!-- 分隔線 -->
        <div class="divider"></div>

        <!-- 右側：使用者輸入資訊 -->
        <div class="flex-1 space-y-6">
          <div class="info-grid">
            <!-- <div class="info-item">
              <span class="label">服務縣市</span>
              <span class="value">{{ appointmentStore.appointment.city || '未選擇' }}</span>
            </div>
            <div class="info-item">
              <span class="label">時間需求</span>
              <span class="value">{{ appointmentStore.appointment.timeRequirements || '未提供' }}</span>
            </div> -->
          </div>
        </div>
      </div>

      <!-- ✅ 預約按鈕 -->
      <!-- 修改：保留預約按鈕在卡片底部，獨立於左側容器 -->
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
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCaregiverStore } from "@/stores/caregiverStore";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import myAxios from "@/plugins/axios";

const router = useRouter();
const route = useRoute();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();

const caregiver = ref(null);

// 🔄 當使用者選擇看護時儲存 ID
const selectCaregiver = (caregiverId) => {
  localStorage.setItem("caregiverId", caregiverId);
  appointmentStore.setCaregiverId(caregiverId);
};

onMounted(async () => {
  const caregiverId = route.params.id;
  console.log("Caregiver ID from route:", caregiverId);

  if (
    caregiverStore.selectedCaregiver &&
    caregiverStore.selectedCaregiver.caregiverId === parseInt(caregiverId)
  ) {
    caregiver.value = caregiverStore.selectedCaregiver;
    console.log("Caregiver from store:", caregiver.value);
  } else if (caregiverId) {
    try {
      const response = await myAxios.get(`/api/caregivers/${caregiverId}`);
      caregiver.value = response.data;
      caregiverStore.selectCaregiver(response.data); // 更新 store
      console.log("Caregiver details fetched from API:", caregiver.value);
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

  if (caregiverStore.selectedCaregiver) {
    caregiver.value = caregiverStore.selectedCaregiver;
  } else {
    const storedCaregiver = localStorage.getItem("selectedCaregiver");
    if (storedCaregiver) {
      try {
        caregiver.value = JSON.parse(storedCaregiver);
      } catch (error) {
        console.error("Error parsing stored caregiver:", error);
        localStorage.removeItem("selectedCaregiver");
      }
    }
  }

  if (!caregiver.value) {
    const caregiverId = route.params.caregiverId;
    const foundCaregiver = caregiverStore.caregivers.find(
      (c) => c.caregiverId === caregiverId
    );
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
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  padding: 1.5rem;
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
    padding: 1.5rem 1rem;
  }

  .card-section {
    padding: 1.5rem;
  }

  .caregiver-image {
    width: 100px;
    height: 100px;
  }

  .flex-nowrap {
    flex-wrap: nowrap;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
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
