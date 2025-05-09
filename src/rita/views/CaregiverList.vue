<template>
  <div class="wrapper">
    <!-- 搜尋條件顯示 -->
    <div class="search-conditions card-section mb-6">
      <div class="flex justify-between items-center">
        <div class="conditions-container">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">您的搜尋條件</h3>
          <div class="condition-tags">
            <span class="condition-tag">
              <span class="label">服務地區：</span>
              <span class="value">
                {{ caregiverStore.filters.serviceCity || "未指定" }}
                {{
                  caregiverStore.filters.serviceDistrict
                    ? ` - ${caregiverStore.filters.serviceDistrict}`
                    : ""
                }}
              </span>
            </span>
            <span class="condition-tag">
              <span class="label">時間選擇：</span>
              <span class="value">
                <span
                  v-if="appointmentStore.appointment.timeType === 'continuous'"
                >
                  {{ formatDateTime(caregiverStore.filters.desiredStartTime) }}
                  -
                  {{
                    formatDateTime(caregiverStore.filters.desiredEndTime)
                  }}（連續時間）
                </span>
                <span v-else>
                  {{ formatDate(appointmentStore.multi.startDate) }} -
                  {{ formatDate(appointmentStore.multi.endDate) }}
                  （每日
                  {{
                    appointmentStore.multi.timeSlots
                      .map((slot) => `${slot.startTime} - ${slot.endTime}`)
                      .join(", ")
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
          修改條件
        </button>
      </div>
    </div>

    <!-- 標頭 -->
    <div class="header flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800">
        搜尋結果，共 {{ sortedCaregivers.length }} 位看護
      </h3>
      <select
        v-model="sortOption"
        class="border p-2 rounded-md text-gray-600 focus:border-teal-600 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
      >
        <option value="price">按價格排序</option>
        <option value="experience">按經驗年數排序</option>
      </select>
    </div>

    <!-- 無結果提示 -->
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

    <!-- 看護卡片 -->
    <div class="caregiver-grid">
      <div
        class="caregiver-card"
        v-for="caregiver in sortedCaregivers"
        :key="caregiver.caregiverId"
        @click="goToCaregiverDetail(caregiver.caregiverId)"
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
          <p class="text-sm text-gray-600 mt-2 line-clamp-2">
            {{ caregiver.description || "尚無詳細介紹" }}
          </p>
          <p class="text-lg font-bold text-teal-600 mt-2">
            總價格：{{ calculateTotalPrice(caregiver).toLocaleString() }} 元
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCaregiverStore } from "@/stores/caregiverStore";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import axios from "@/plugins/axios";

const router = useRouter();
const caregiverStore = useCaregiverStore();
const appointmentStore = useAppointmentStore();
const favoriteCaregiverIds = ref([]);
const sortOption = ref("price");

const sortedCaregivers = computed(() => {
  const list = [...caregiverStore.caregivers];
  if (sortOption.value === "price") {
    list.sort((a, b) => calculateTotalPrice(a) - calculateTotalPrice(b));
  } else if (sortOption.value === "experience") {
    list.sort((a, b) => b.yearOfExperience - a.yearOfExperience);
  }
  return list;
});

const formatDateTime = (dateTime) => {
  if (!dateTime) return "未指定";
  const date = new Date(dateTime);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (date) => {
  if (!date) return "未指定";
  const d = new Date(date);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const isFavorited = (caregiverId) => {
  return favoriteCaregiverIds.value.includes(caregiverId);
};

const toggleFavorite = async (caregiverId) => {
  try {
    if (isFavorited(caregiverId)) {
      await axios.delete("/favorites/deleteEmployee", {
        params: { caregiverId },
      });
      favoriteCaregiverIds.value = favoriteCaregiverIds.value.filter(
        (id) => id !== caregiverId
      );
    } else {
      await axios.post("/favorites/addEmployee", null, {
        params: { caregiverId },
      });
      favoriteCaregiverIds.value.push(caregiverId);
    }
  } catch (err) {
    console.error("收藏切換失敗", err);
    alert("操作失敗，請稍後再試");
  }
};

const calculateTotalPrice = (caregiver) => {
  let totalHours = 0;
  if (appointmentStore.appointment.timeType === "continuous") {
    const start = new Date(appointmentStore.continuous.startTime);
    const end = new Date(appointmentStore.continuous.endTime);
    totalHours = (end - start) / (1000 * 60 * 60);
  } else {
    const startDate = new Date(appointmentStore.multi.startDate);
    const endDate = new Date(appointmentStore.multi.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let workingDays = days;
    if (
      appointmentStore.multi.repeatDays &&
      appointmentStore.multi.repeatDays.length > 0
    ) {
      workingDays = 0;
      const start = new Date(appointmentStore.multi.startDate);
      const end = new Date(appointmentStore.multi.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ][d.getDay()];
        if (appointmentStore.multi.repeatDays.includes(dayOfWeek)) {
          workingDays++;
        }
      }
    }

    let dailyHours = 0;
    if (
      appointmentStore.multi.timeSlots &&
      appointmentStore.multi.timeSlots.length > 0
    ) {
      appointmentStore.multi.timeSlots.forEach((slot) => {
        const startTime = new Date(`1970-01-01T${slot.startTime}:00`);
        const endTime = new Date(`1970-01-01T${slot.endTime}:00`);
        dailyHours += (endTime - startTime) / (1000 * 60 * 60);
      });
    }

    totalHours = dailyHours * workingDays;
  }

  const hourlyRate = parseFloat(caregiver.hourlyRate);
  const halfDayRate = parseFloat(caregiver.halfDayRate);
  const fullDayRate = parseFloat(caregiver.fullDayRate);

  if (totalHours < 4) {
    return Math.round(totalHours * hourlyRate);
  } else if (totalHours < 8) {
    return halfDayRate;
  } else {
    const fullDays = Math.floor(totalHours / 8);
    const remainingHours = totalHours % 8;
    return Math.round(fullDays * fullDayRate + remainingHours * hourlyRate);
  }
};

const goToCaregiverDetail = (caregiverId) => {
  router.push(`/caregivers/${caregiverId}`);
};

const goBackToSearch = () => {
  router.push("/");
};

onMounted(async () => {
  try {
    const res = await axios.get("/favorites/employees");
    favoriteCaregiverIds.value = res.data.map((item) => item.caregiverId);
  } catch (err) {
    console.error("取得收藏照護者失敗", err);
  }
});
</script>

<style scoped>
/* 保留你的 CSS 不變 */
</style>

<style scoped>
/* 全局樣式 */
.wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff; /* 白色背景 */
}

/* 搜尋條件卡片 */
.search-conditions {
  background-color: #f9fafb; /* 淺灰背景，與白色背景區分 */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

/* 條件容器 */
.conditions-container {
  width: 100%;
}

/* 條件標籤容器 */
.condition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* 適當間距，防止擁擠 */
  margin-top: 0.5rem;
}

/* 條件標籤 */
.condition-tag {
  display: inline-flex;
  align-items: center;
  background-color: #e6f4f3; /* 淺藍綠背景，與主題色搭配 */
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
  color: #2a9287; /* 深色主題色，提升標籤可讀性 */
  margin-right: 0.5rem;
}

.condition-tag .value {
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px; /* 限制長度，防止溢出 */
}

/* 標頭 */
.header h3 {
  color: #4db6ac; /* 主色 */
}

.header select {
  border: 1px solid #d1d5db;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

/* 看護網格 */
.caregiver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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

/* 資訊行 */
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.info-row span {
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9; /* 淺灰背景 */
  border-radius: 4px;
  font-size: 0.875rem;
}

/* 文字樣式 */
.caregiver-info h3 {
  color: #4db6ac;
}

.caregiver-info p {
  color: #4b5563;
  line-height: 1.5;
}

/* 限制描述文字為兩行，超出顯示省略號 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
