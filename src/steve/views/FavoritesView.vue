<template>
  <div class="container py-4">
    <h2 class="mb-4">我的收藏庫</h2>

    <!-- 分類切換 Tabs -->
    <div class="btn-group mb-3">
      <button
        class="btn"
        :class="
          currentTab === 'courses' ? 'btn-primary' : 'btn-outline-primary'
        "
        @click="currentTab = 'courses'"
      >
        課程
      </button>
      <button
        class="btn"
        :class="
          currentTab === 'employees' ? 'btn-primary' : 'btn-outline-primary'
        "
        @click="currentTab = 'employees'"
      >
        照護者
      </button>
    </div>

    <!-- 收藏課程
    <div v-if="currentTab === 'courses'">
      <div v-if="favoriteCourses.length === 0" class="text-muted">
        尚未收藏任何課程。
      </div>
      <div v-else class="d-flex flex-column gap-3">
        <div
          v-for="item in favoriteCourses"
          :key="item.favoriteId"
          class="card course-card p-3"
        >
          <template v-if="item.course">
            <router-link
              :to="`/courses/${item.course.courseId}`"
              class="h5 text-decoration-none text-dark"
            >
              {{ item.course.title }}
            </router-link>
            <p class="mb-1 text-muted">
              分類：{{ getCategoryLabel(item.course.category) }}
            </p>
            <p class="mb-0">{{ item.course.description }}</p>
          </template>
          <template v-else>
            <p class="text-danger">⚠️ 課程資料遺失（ID: {{ item.courseId }})</p>
          </template>

          <button
            class="btn btn-sm btn-danger mt-2"
            @click="removeFavoriteCourse(item.courseId)"
          >
            取消收藏
          </button>
        </div>
      </div>
    </div> -->
    <!-- 收藏課程 -->
    <div v-if="currentTab === 'courses'">
      <div v-if="favoriteCourses.length === 0" class="text-muted">
        尚未收藏任何課程。
      </div>
      <div v-else class="d-flex flex-column gap-3">
        <div
          v-for="item in favoriteCourses"
          :key="item.favoriteId"
          class="card course-card p-3"
        >
          <template v-if="item.course">
            <div class="d-flex justify-content-between align-items-center">
              <router-link
                :to="`/courses/${item.course.courseId}`"
                class="h5 text-decoration-none text-dark"
              >
                {{ item.course.title }}
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeFavoriteCourse(item.course.courseId)"
              >
                取消收藏
              </button>
            </div>
            <p class="mb-1 text-muted">
              分類：{{ getCategoryLabel(item.course.category) }}
            </p>
            <p class="mb-0">{{ item.course.description || "無課程描述" }}</p>
          </template>
          <template v-else>
            <p class="text-danger">⚠️ 課程資料遺失（ID: {{ item.courseId }})</p>
          </template>
        </div>
      </div>
    </div>

    <!-- 收藏照護者 -->
    <div v-if="currentTab === 'employees'">
      <div v-if="favoriteCaregivers.length === 0" class="text-muted">
        尚未收藏任何照護者。
      </div>
      <div v-else class="d-flex flex-column gap-3">
        <div
          v-for="item in favoriteCaregivers"
          :key="item.favoriteId"
          class="card caregiver-card p-3"
        >
          <template v-if="item.caregiver">
            <div class="d-flex justify-content-between align-items-center">
              <router-link
                :to="`/caregivers/${item.caregiver.caregiverId}`"
                class="h5 text-decoration-none text-dark"
              >
                {{ item.caregiver.caregiverName }}
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeFavoriteCaregiver(item.caregiver.caregiverId)"
              >
                取消收藏
              </button>
            </div>
            <p class="mb-1 text-muted">
              國籍：{{ item.caregiver.nationality || "未知" }}｜經驗：{{
                item.caregiver.yearOfExperience
              }}
              年
            </p>
            <p class="mb-0">{{ item.caregiver.description || "無介紹內容" }}</p>
          </template>
          <template v-else>
            <p class="text-danger">
              ⚠️ 照護者資料遺失（ID: {{ item.caregiverId }})
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";

const currentTab = ref("courses");
const favoriteCourses = ref([]);
const favoriteCaregivers = ref([]);

const getCategoryLabel = (key) => {
  const map = {
    daily_care: "日常照護",
    dementia: "失智照護",
    nutrition: "營養保健",
    psychology: "心理支持",
    assistive: "輔具協助",
    resource: "資源導覽",
    endoflife: "臨終關懷",
    skills: "技能訓練",
    selfcare: "自主健康",
  };
  return map[key] || key;
};

const fetchFavorites = async () => {
  try {
    const [courseRes, caregiverRes] = await Promise.all([
      axios.get("/favorites/courses"),
      axios.get("/favorites/employees"),
    ]);
    favoriteCourses.value = courseRes.data;
    favoriteCaregivers.value = caregiverRes.data;
  } catch (err) {
    console.error("取得收藏資料失敗", err);
  }
};

const removeFavoriteCourse = async (courseId) => {
  try {
    await axios.delete("/favorites/deleteCourse", { params: { courseId } });
    favoriteCourses.value = favoriteCourses.value.filter(
      (item) => item.courseId !== courseId
    );
  } catch (err) {
    console.error("取消課程收藏失敗", err);
  }
};

const removeFavoriteCaregiver = async (caregiverId) => {
  try {
    await axios.delete("/favorites/deleteEmployee", {
      params: { caregiverId },
    });
    favoriteCaregivers.value = favoriteCaregivers.value.filter(
      (item) => item.caregiverId !== caregiverId
    );
  } catch (err) {
    console.error("取消照護者收藏失敗", err);
  }
};

onMounted(fetchFavorites);
</script>

<style scoped>
.course-card,
.caregiver-card {
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
