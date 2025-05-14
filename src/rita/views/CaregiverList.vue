<template>
  <div class="wrapper">
    <!-- <div class="search-conditions card-section mb-6">
      <div class="flex justify-between items-center"> -->
    <!-- <div class="conditions-container">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">您的搜尋條件</h3>
          <div class="condition-tags">
            <span class="condition-tag">
              <span class="label">服務縣市：</span>
              <span class="value">{{
                caregiverStore.filters.serviceCity || "未指定"
              }}</span>
            </span>
            <span class="condition-tag">
              <span class="label">服務地區：</span>
              <span class="value">{{ caregiverStore.filters.serviceDistrict || '全部區域' }}</span>
            </span>
            <span class="condition-tag">
              <span class="label">時間選擇：</span>
              <span class="value">
                <span
                  v-if="appointmentStore.appointment.timeType === 'continuous'"
                >
                  {{ formatDateTime(appointmentStore.continuous.startTime) }} -
                  {{
                    formatDateTime(appointmentStore.continuous.endTime)
                  }}（連續時間）
                </span>
                <span v-else>
                  {{ formatDate(appointmentStore.multi.startDate) }} -
                  {{ formatDate(appointmentStore.multi.endDate) }}
                  （每日
                  {{
                    formatTimeRange(
                      appointmentStore.multi.dailyStartTime,
                      appointmentStore.multi.dailyEndTime
                    )
                  }}，多時段預訂）
                </span>
              </span>
            </span>
          </div>
        </div> -->
    <button
      @click="goBackToSearch"
      class="goBackToSearch px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-50"
    >
      ⬅︎ 返回搜尋
    </button>

    <!-- </div> -->
    <!-- </div> -->

    <div class="header flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800">
        搜尋結果：共 {{ sortedCaregivers.length }} 位照服員
      </h3>
      <select
        v-model="sortOption"
        class="border p-2 rounded-md text-gray-600 focus:border-teal-600 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
      >
        <option value="price">按總價排序</option>
        <option value="experience">按年資排序</option>
      </select>
    </div>

    <div
      v-if="sortedCaregivers.length === 0"
      class="text-center py-10 bg-white rounded-lg shadow-sm"
    >
      <p class="text-lg text-gray-600 mb-2">很抱歉，沒有符合條件的看護！</p>
      <p class="text-sm text-gray-500">
        請調整搜尋條件，或
        <router-link
          to="/user-center/favorites"
          class="text-teal-600 underline ml-1"
        >
          查看收藏庫
        </router-link>
      </p>
    </div>

    <div class="caregiver-grid">
      <div
        class="caregiver-card"
        v-for="caregiver in sortedCaregivers"
        :key="caregiver.caregiverId"
        @click="goToCaregiverDetail(caregiver)"
      >
        <img
          class="caregiver-image"
          :src="
            caregiver.photoPath ||
            'https://finalimagesbucket.s3.ap-northeast-1.amazonaws.com/default-placeholder.jpg'
          "
          :alt="`看護 ${caregiver.caregiverName}`"
          loading="lazy"
        />

        <div class="flex justify-between items-center mb-2">
          <h3 class="caregiver-name text-lg font-semibold text-teal-600">
            {{ caregiver.caregiverName }}
          </h3>
          <button
            @click.stop="toggleFavorite(caregiver.caregiverId)"
            class="flex items-center justify-center p-2 bg-transparent border-0 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out"
          >
            <!-- 使用過渡效果和顏色變化 -->
            <span
              v-if="isFavorited(caregiver.caregiverId)"
              class="text-red-500 text-3xl transform transition-transform duration-300 ease-in-out"
            >
              ♥
            </span>
            <span
              v-else
              class="text-gray-400 text-3xl transform transition-transform duration-300 ease-in-out"
            >
              ♡
            </span>
          </button>
        </div>
        <div class="caregiver-info">
          <div class="info-row text-sm text-gray-600">
            <span>性別：{{ caregiver.gender }}</span>
            <span>國籍：{{ caregiver.nationality || "未知" }}</span>
            <span>語言：{{ caregiver.languages || "未知" }}</span>
          </div>
          <p class="text-sm text-gray-600">
            年資：{{ caregiver.yearOfExperience }} 年
          </p>
          <!--  <p class="text-sm text-gray-600">時薪：{{ caregiver.hourlyRate ? `${caregiver.hourlyRate} 元/小時` : '未提供' }}</p>
          <p class="text-sm text-gray-600">半日薪水：{{ caregiver.halfDayRate ? `${caregiver.halfDayRate} 元/半日` : '未提供' }}</p><p class="text-sm text-gray-600">全日薪水：{{ caregiver.fullDayRate ? `${caregiver.fullDayRate} 元/全日` : '未提供' }}</p>  -->
          <p class="text-sm text-gray-600 mt-2 line-clamp-2">
            {{ caregiver.description || "尚無詳細介紹" }}
          </p>
          <p class="text-sm text-teal-700 font-semibold mt-2">
            總價：{{
              caregiver.totalPrice ? `${caregiver.totalPrice} 元` : "計算中..."
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCaregiverStore } from "@/stores/caregiverStore";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import myAxios from "@/plugins/axios";

const router = useRouter();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();
const favoriteCaregiverIds = ref([]);

// 排序選項，從 localStorage 讀取，預設為 'price'
const sortOption = ref(localStorage.getItem("sortOption") || "price");
const estimatedPrices = ref({}); // 用於儲存每個看護的預估價格，key 是 caregiverId

const isFavorited = (caregiverId) => {
  return favoriteCaregiverIds.value.includes(caregiverId);
};

// 監看排序選項的變化，並儲存到 localStorage
watch(sortOption, (newSortOption) => {
  localStorage.setItem("sortOption", newSortOption);
});

// 監看 filters 和 caregivers 的變化，同步到 localStorage
watch(
  () => caregiverStore.filters,
  (newFilters) => {
    localStorage.setItem("serviceCity", newFilters.serviceCity || "");
    localStorage.setItem("serviceDistrict", newFilters.serviceDistrict || "");
    localStorage.setItem("desiredStartTime", newFilters.desiredStartTime || "");
    localStorage.setItem("desiredEndTime", newFilters.desiredEndTime || "");
    localStorage.setItem("gender", newFilters.gender || "null");
    localStorage.setItem("nationality", newFilters.nationality || "null");
    localStorage.setItem("languages", newFilters.languages || "null");
    localStorage.setItem("hourlyRateMin", newFilters.hourlyRateMin || "null");
    localStorage.setItem("hourlyRateMax", newFilters.hourlyRateMax || "null");
  },
  { deep: true }
);

onMounted(() => {
  appointmentStore.appointment.timeType =
    localStorage.getItem("timeType") || "continuous";
  appointmentStore.continuous.startTime =
    localStorage.getItem("continuousStartTime") || "";
  appointmentStore.continuous.endTime =
    localStorage.getItem("continuousEndTime") || "";
  appointmentStore.continuous.startDate =
    localStorage.getItem("continuousStartDate") || "";
  appointmentStore.continuous.endDate =
    localStorage.getItem("continuousEndDate") || "";
  appointmentStore.multi.startDate =
    localStorage.getItem("multiStartDate") || "";
  appointmentStore.multi.endDate = localStorage.getItem("multiEndDate") || "";
  appointmentStore.multi.dailyStartTime = JSON.parse(
    localStorage.getItem("multiDailyStartTime") || "{}"
  );
  appointmentStore.multi.dailyEndTime = JSON.parse(
    localStorage.getItem("multiDailyEndTime") || "{}"
  );
  appointmentStore.multi.repeatDays = JSON.parse(
    localStorage.getItem("multiRepeatDays") || "{}"
  );
  appointmentStore.multi.timeSlots = JSON.parse(
    localStorage.getItem("multiTimeSlots") || "[]"
  );

  caregiverStore.setFilters({
    serviceCity: localStorage.getItem("serviceCity") || "",
    serviceDistrict: localStorage.getItem("serviceDistrict") || "",
    desiredStartTime: localStorage.getItem("desiredStartTime") || "",
    desiredEndTime: localStorage.getItem("desiredEndTime") || "",
    gender:
      localStorage.getItem("gender") === "null"
        ? null
        : localStorage.getItem("gender"),
    nationality:
      localStorage.getItem("nationality") === "null"
        ? null
        : localStorage.getItem("nationality"),
    languages:
      localStorage.getItem("languages") === "null"
        ? null
        : localStorage.getItem("languages"),
    hourlyRateMin:
      localStorage.getItem("hourlyRateMin") === "null"
        ? null
        : Number(localStorage.getItem("hourlyRateMin")),
    hourlyRateMax:
      localStorage.getItem("hourlyRateMax") === "null"
        ? null
        : Number(localStorage.getItem("hourlyRateMax")),
  });

  const storedCaregivers = localStorage.getItem("caregivers");
  if (storedCaregivers) {
    try {
      const parsedCaregivers = JSON.parse(storedCaregivers);
      if (Array.isArray(parsedCaregivers)) {
        caregiverStore.setCaregivers(parsedCaregivers);
      } else {
        console.warn(
          "Stored caregivers is not an array, clearing localStorage."
        );
        localStorage.removeItem("caregivers");
      }
    } catch (error) {
      console.error("Error parsing stored caregivers:", error);
      localStorage.removeItem("caregivers");
    }
  }
});

const sortedCaregivers = computed(() => {
  const list = [...caregiverStore.caregivers];
  if (sortOption.value === "price") {
    list.sort(
      (a, b) =>
        (estimatedPrices.value[a.caregiverId] === "無法估價"
          ? Infinity
          : estimatedPrices.value[a.caregiverId]) -
        (estimatedPrices.value[b.caregiverId] === "無法估價"
          ? Infinity
          : estimatedPrices.value[b.caregiverId])
    );
  } else if (sortOption.value === "experience") {
    list.sort((a, b) => b.yearOfExperience - a.yearOfExperience);
  }
  return list;
});

const formatDateTime = (dateTimeStr) => {
  console.log("收到的日期時間字串：", dateTimeStr);
  if (!dateTimeStr || isNaN(Date.parse(dateTimeStr))) return "未指定";
  const date = new Date(dateTimeStr);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "未指定";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTimeObject = (timeObj) => {
  if (
    !timeObj ||
    typeof timeObj.hour === "undefined" ||
    typeof timeObj.minute === "undefined"
  )
    return "未指定";
  const hour = parseInt(timeObj.hour, 10);
  const minute = timeObj.minute.padStart(2, "0");
  let period = "AM";
  let formattedHour = hour;
  if (hour === 0) {
    formattedHour = 12;
  } else if (hour === 12) {
    period = "PM";
  } else if (hour > 12) {
    formattedHour = hour - 12;
    period = "PM";
  }
  return `${formattedHour}:${minute} ${period}`;
};

const formatTimeRange = (startTimeObj, endTimeObj) => {
  const startTime = formatTimeObject(startTimeObj);
  const endTime = formatTimeObject(endTimeObj);
  return `${startTime} - ${endTime}`;
};

const goToCaregiverDetail = (caregiver) => {
  console.log("Selected caregiver:", caregiver); // 檢查完整的 caregiver 物件
  console.log("Selected caregiver ID:", caregiver.caregiverId); // 檢查 caregiverId 的值
  caregiverStore.selectCaregiver(caregiver);
  localStorage.setItem("selectedCaregiver", JSON.stringify(caregiver));
  router.push(`/caregivers/${caregiver.caregiverId}`);
};

const goBackToSearch = () => {
  router.push("/caregivers/search");
};
const toggleFavorite = async (caregiverId) => {
  const isNowFavorited = isFavorited(caregiverId);

  try {
    if (isNowFavorited) {
      await myAxios.delete("/favorites/deleteEmployee", {
        params: { caregiverId },
      });
      favoriteCaregiverIds.value = favoriteCaregiverIds.value.filter(
        (id) => id !== caregiverId
      );
    } else {
      await myAxios.post("/favorites/addEmployee", null, {
        params: { caregiverId },
      });
      favoriteCaregiverIds.value.push(caregiverId);
    }
  } catch (error) {
    console.error("收藏操作失敗", error);
    if (error.response?.status === 401) {
      alert("請先登入才能操作收藏");
      router.push("/userlogin");
    }
  }
};

onMounted(async () => {
  try {
    const res = await myAxios.get("/favorites/employees"); // ✅ 改用 myAxios
    favoriteCaregiverIds.value = res.data.map((item) => item.caregiverId);
  } catch (err) {
    console.error("取得收藏照護者失敗", err);

    if (err.response?.status === 401) {
      alert("請先登入才能查看收藏的照護者");
      router.push("/user/login"); // 或是導向你登入頁的實際路徑
    }
    try {
      const res = await myAxios.get("/favorites/employees");
      favoriteCaregiverIds.value = res.data.map((item) => item.caregiverId);
    } catch (err) {
      console.error("取得收藏照護者失敗", err);
    }
  }
});
</script>

<style scoped>
/* 全局容器 */
.wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", sans-serif; /* 使用現代無襯線字體 */
}

/* 篩選條件區塊 */
.search-conditions {
  padding: 2rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 條件容器 */
.conditions-container {
  width: 100%;
}

/* 條件標籤容器 */
.condition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 0.75rem;
}

/* 條件標籤 */
.condition-tag {
  display: inline-flex;
  align-items: center;
  background-color: #e6f4f3;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease,
    background-color 0.2s ease;
  cursor: pointer;
}

.condition-tag:hover,
.condition-tag:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #d1e9e5;
  outline: none;
}

.condition-tag .label {
  font-weight: 600;
  color: #2a9287;
  margin-right: 0.5rem;
}

.condition-tag .value {
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

/* 搜尋結果標頭 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.header h3 {
  color: #2a9287;
  font-size: 1.5rem;
  font-weight: 700;
}

.header select {
  border: 1px solid #d1d5db;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.75rem 1.25rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.header select:focus {
  border-color: #4db6ac;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2);
  outline: none;
}

/* 看護卡片網格 */
.caregiver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* 看護卡片 */
.caregiver-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.caregiver-card:hover,
.caregiver-card:focus {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  outline: none;
}

.caregiver-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.caregiver-info {
  padding: 1.5rem;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-row span {
  padding: 0.5rem 0.75rem;
  background-color: #f1f5f9;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
}

.caregiver-info .hourly-rate {
  color: #2a9287;
  font-weight: 600;
  font-size: 1.125rem;
}

/* 限制描述文字為兩行 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #579a65;
}

/* 姓名區塊樣式 */
.caregiver-name {
  font-size: 1.725rem; /* 保持字體大小 */
  font-weight: 600; /* 加粗字體 */
  color: #2a9287; /* 與卡片主色調一致 */
  background-color: #e6f4f3; /* 柔和背景色 */
  padding: 0.5rem 1rem; /* 適當內邊距 */
  border-radius: 12px; /* 與卡片圓角（12px）統一 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); /* 與卡片陰影風格一致 */
  display: inline-block; /* 保持內聯塊級元素 */
  margin-bottom: 0.75rem; /* 增加與下方內容的間距 */
  transition: transform 0.3s ease, background-color 0.3s ease,
    box-shadow 0.3s ease, color 0.3s ease; /* 平滑過渡 */
}

/* 懸停和聚焦效果 */
.caregiver-name:hover,
.caregiver-name:focus {
  transform: translateY(-2px); /* 與卡片懸停效果（translateY）統一 */
  background-color: #d1e9e5; /* 略深的背景色，與 .condition-tag:hover 一致 */
  color: #2a9287; /* 保持文字顏色，避免突兀變化 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); /* 略強的陰影 */
  outline: none; /* 移除默認聚焦框 */
}

/* 確保可訪問性 */
.caregiver-name:focus {
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2); /* 與其他聚焦效果一致 */
}

/* 返回按鈕 */
.goBackToSearch {
  padding: 0.75rem 1.5rem;
  background-color: #4db6ac;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.goBackToSearch:hover,
.goBackToSearch:focus {
  background-color: #3d9c93;
  transform: translateY(-2px);
  outline: none;
  box-shadow: 0 0 0 3px rgba(77, 182, 172, 0.2);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .wrapper {
    padding: 1rem;
  }

  .caregiver-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .caregiver-image {
    height: 150px;
  }

  .caregiver-info {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .condition-tags {
    gap: 1rem;
  }

  .condition-tag {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .caregiver-card {
    border-radius: 10px;
  }
}

@media (max-width: 768px) {
  .caregiver-name {
    font-size: 1rem; /* 縮小字體以適配平板 */
    padding: 0.4rem 0.8rem; /* 減小內邊距 */
    border-radius: 10px; /* 與卡片響應式圓角一致 */
  }
}

@media (max-width: 480px) {
  .caregiver-name {
    font-size: 0.9375rem; /* 進一步縮小字體以適配手機 */
    padding: 0.3rem 0.7rem;
    margin-bottom: 0.5rem;
  }
}
</style>
