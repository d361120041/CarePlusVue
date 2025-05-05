<template>
  <div class="container py-4">
    <div id="course-top"></div>
    <h2 class="mb-4">課程列表</h2>

    <!-- 搜尋欄 -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchKeyword"
        @change="searchCourses"
        placeholder="輸入關鍵字搜尋課程"
        class="form-control mb-3 mx-auto search-input"
      />

      <div class="d-flex justify-content-center align-items-center">
        <!-- 進階搜尋：分類按鈕 -->
        <div class="btn-group flex-wrap" role="group">
          <button
            v-for="category in categories"
            :key="category"
            @click="filterByCategory(category)"
            :class="[
              'btn',
              selectedCategory === category
                ? 'btn-primary'
                : 'btn-outline-primary',
            ]"
            class="m-1"
          >
            {{ getCategoryLabel(category) }}
          </button>

          <!-- 清除篩選條件 -->
          <button @click="resetFilters" class="btn btn-outline-secondary m-1">
            &#88;
          </button>
        </div>
      </div>
    </div>
    <!-- 課程卡片清單 -->
    <div
      v-if="courses.length > 0"
      :class="[
        'd-flex flex-column gap-3 w-100',
        courses.length > 1
          ? 'justify-content-center align-items-center min-vh-100'
          : 'align-items-center',
      ]"
    >
      <router-link
        v-for="course in paginatedCourses"
        :key="course.courseId"
        :to="`/courses/${course.courseId}`"
        class="text-decoration-none w-100"
      >
        <div class="card course-card mx-auto">
          <div class="d-flex h-100">
            <!-- 課程圖片 -->
            <div class="p-3">
              <img
                :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                class="course-img rounded"
                alt="課程封面"
              />
            </div>

            <!-- 課程內容 -->
            <div
              class="card-body d-flex flex-column justify-content-center text-dark"
            >
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text">
                <small class="text-muted"
                  >#{{ getCategoryLabel(course.category) }}</small
                >
              </p>
              <p class="card-text">{{ course.description }}</p>
              <p class="card-text">
                <small class="text-muted">No.{{ course.courseId }}</small>
              </p>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <div v-else class="text-center text-muted mt-4">查無課程資料。</div>
  </div>

  <!-- 分頁 -->
  <div class="d-flex justify-content-center align-items-center">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPage(currentPage - 1)"
          >
            &laquo;
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPage(currentPage + 1)"
          >
            &raquo;
          </a>
        </li>
      </ul>
      <p class="text-center mb-2">
        第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁
      </p>
    </nav>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/plugins/axios.js";

const courses = ref([]);
const searchKeyword = ref("");
const selectedCategory = ref(null); // 記錄目前選擇的分類
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 所有可選分類（對應 enum 名稱）
const categories = [
  "daily_care",
  "dementia",
  "nutrition",
  "psychology",
  "assistive",
  "resource",
  "endoflife",
  "skills",
  "selfcare",
];

// 顯示中文名稱（選擇性）
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

// 初始載入所有課程
const fetchCourses = async () => {
  try {
    const res = await axios.get("/api/courses");
    courses.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

// 搜尋課程（依關鍵字）
const searchCourses = async () => {
  const keyword = searchKeyword.value.trim();
  selectedCategory.value = null; // 清除分類選擇
  currentPage.value = 1;
  if (keyword === "") {
    await fetchCourses();
    return;
  }

  try {
    const res = await axios.get("/api/courses/search", {
      params: { keyword },
    });
    courses.value = res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      courses.value = [];
    } else {
      console.error("搜尋失敗：", err);
    }
  }
};

// 點分類按鈕時的搜尋
const filterByCategory = async (category) => {
  searchKeyword.value = ""; // 清空關鍵字搜尋
  selectedCategory.value = category;
  currentPage.value = 1;
  try {
    const res = await axios.get(`/api/courses/category/${category}`);
    courses.value = res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      courses.value = [];
    } else {
      console.error("分類搜尋錯誤：", err);
    }
  }
};

const currentPage = ref(1); // 當前頁數
const pageSize = 3; // 每頁幾筆（固定為 3）
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return courses.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  return Math.ceil(courses.value.length / pageSize);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 滾動到課程區塊頂部
    const target = document.getElementById("course-top");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
};

const resetFilters = async () => {
  searchKeyword.value = "";
  selectedCategory.value = null;
  currentPage.value = 1;
  await fetchCourses();
};

onMounted(fetchCourses);
</script>

<style scoped>
.course-card {
  width: 90%;
  max-width: 1100px;
  height: 332px;
}

.course-img {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.search-input {
  width: 90%;
  max-width: 1100px;
}
</style>
