<template>
  <div class="wrapper">
    <div class="search-conditions card-section mb-6">
      <div class="flex justify-between items-center">
        <div class="conditions-container">
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
              <span class="value">{{
                caregiverStore.filters.serviceDistrict || "未指定"
              }}</span>
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
        </div>
        <button
          @click="goBackToSearch"
          class="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          返回搜尋
        </button>
      </div>
    </div>

    <div class="header flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800">
        搜尋結果，共 {{ sortedCaregivers.length }} 位看護
      </h3>
      <select
        v-model="sortOption"
        class="border p-2 rounded-md text-gray-600 focus:border-teal-600 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
      >
        <option value="price">按預估總價排序</option>
        <option value="experience">按經驗年數排序</option>
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
            'https://finalimagesbucket.s3.amazonaws.com/default-placeholder.jpg'
          "
          :alt="`看護 ${caregiver.caregiverName}`"
        />
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold text-teal-600">
            {{ caregiver.caregiverName }}
          </h3>
          <button
            @click.stop="toggleFavorite(caregiver.caregiverId)"
            class="text-red-500 hover:text-red-600 text-xl"
          >
            <span v-if="isFavorited(caregiver.caregiverId)">♥</span>
            <span v-else>♡</span>
          </button>
        </div>
        <div class="caregiver-info">
          <div class="info-row text-sm text-gray-600">
            <span>性別：{{ caregiver.gender }}</span>
            <span>國籍：{{ caregiver.nationality || "未知" }}</span>
            <span>語言：{{ caregiver.languages || "未知" }}</span>
          </div>
          <p class="text-sm text-gray-600">
            經驗年數：{{ caregiver.yearOfExperience }} 年
          </p>
          <p class="text-sm text-gray-600">
            時薪：{{
              caregiver.hourlyRate
                ? `${caregiver.hourlyRate} 元/小時`
                : "未提供"
            }}
          </p>
          <p class="text-sm text-gray-600">
            半日薪水：{{
              caregiver.halfDayRate
                ? `${caregiver.halfDayRate} 元/半日`
                : "未提供"
            }}
          </p>
          <p class="text-sm text-gray-600">
            全日薪水：{{
              caregiver.fullDayRate
                ? `${caregiver.fullDayRate} 元/全日`
                : "未提供"
            }}
          </p>
          <p class="text-sm text-gray-600 mt-2 line-clamp-2">
            {{ caregiver.description || "尚無詳細介紹" }}
          </p>
          <p class="text-sm text-teal-700 font-semibold mt-2">
            預估總價：{{
              estimatedPrices[caregiver.caregiverId] !== undefined
                ? `${estimatedPrices[caregiver.caregiverId]} 元`
                : "計算中..."
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

watch(
  () => caregiverStore.caregivers,
  (newCaregivers) => {
    localStorage.setItem("caregivers", JSON.stringify(newCaregivers));
    // 當看護列表更新時，重新獲取價格
    estimatedPrices.value = {};
    newCaregivers.forEach((caregiver) => {
      fetchEstimatePrice(caregiver.caregiverId);
    });
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

const fetchEstimatePrice = async (caregiverId) => {
  try {
    console.log(`Fetching price for caregiver ID: ${caregiverId}`);
    console.log(
      "Appointment Time Type:",
      appointmentStore.appointment.timeType
    );

    let amount = null;
    if (appointmentStore.appointment.timeType === "continuous") {
      console.log("Calculating for continuous time...");
      const continuous = appointmentStore.continuous;
      console.log("Continuous data:", continuous);

      // 直接使用 continuous 中的字串值
      const startTimeStr = continuous.startTime
        ? `${continuous.startTime}:00`
        : null;
      const endTimeStr = continuous.endTime ? `${continuous.endTime}:00` : null;

      const startTimeParam =
        continuous.startDate && startTimeStr
          ? `${continuous.startDate}T${startTimeStr}`
          : null;
      const endTimeParam =
        continuous.endDate && endTimeStr
          ? `${continuous.endDate}T${endTimeStr}`
          : null;

      const res = await myAxios.get("/api/appointment/estimate/continuous", {
        params: {
          caregiverId: caregiverId,
          startTime: startTimeParam,
          endTime: endTimeParam,
        },
      });
      amount = res.data;
    } else if (appointmentStore.appointment.timeType === "multi") {
      // ... (multi 类型的处理保持不变) ...
    }

    if (amount !== null) {
      estimatedPrices.value[caregiverId] = amount;
      console.log(
        `Estimated price stored for caregiver ${caregiverId}:`,
        estimatedPrices.value[caregiverId]
      );
    } else {
      console.log(`Amount is null for caregiver ${caregiverId}.`);
    }
  } catch (error) {
    console.error(
      `Failed to fetch estimate price for caregiver ${caregiverId}:`,
      error
    );
    estimatedPrices.value[caregiverId] = "無法估價";
  }
};

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
  if (!dateTimeStr) return "未指定";
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
/* 保持現有樣式不變 */
.wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
}

/* 篩選條件區塊 */
.search-conditions {
  padding: 2rem;
  background-color: #f9fafb;
  border: 1px solid #d1e9e5;
  border-radius: 8px;
  margin-bottom: 3rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
  margin-top: 0.5rem;
}

/* 條件標籤 */
.condition-tag {
  display: inline-flex;
  align-items: center;
  background-color: #e6f4f3;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.condition-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.condition-tag .label {
  font-weight: 500;
  color: #2a9287;
  margin-right: 0.5rem;
}

.condition-tag .value {
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

/* 搜尋結果標頭 */
.header h3 {
  color: #4db6ac;
}

.header select {
  border: 1px solid #d1d5db;
  background-color: #fff;
  transition: border-color 0.2s ease;
  border-radius: 6px;
}

/* 看護卡片網格 */
.caregiver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* 看護卡片 */
.caregiver-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.caregiver-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.caregiver-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.caregiver-info {
  padding: 1rem;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.info-row span {
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  border-radius: 4px;
  font-size: 0.875rem;
}

.caregiver-info .hourly-rate {
  color: #2a9287;
  font-weight: 500;
}

/* 限制描述文字為兩行 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
