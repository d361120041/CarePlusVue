<template>
  <div class="container py-4">
    <div id="course-top"></div>
    <!-- <h2 class="mb-4" style="text-align: center;">課程列表</h2> -->

    <!-- 關鍵字搜尋 -->
    <div class="mb-4">
      <input type="text" v-model="searchKeyword" @change="searchCourses" placeholder="輸入關鍵字搜尋課程"
        class="form-control mb-3 mx-auto search-input" />

      <!-- <div class="d-flex justify-content-between flex-wrap align-items-center mb-3"> -->
      <div class="filter-row mx-auto d-flex justify-content-between flex-wrap align-items-center mb-3">

        <!-- 左側：分類搜尋按鈕群組 -->
        <div class="btn-group flex-wrap" role="group">
          <button v-for="category in categories" :key="category" @click="filterByCategory(category)" :class="[
            'btn',
            selectedCategory === category
              ? 'btn-primary'
              : 'btn-outline-green',
          ]" class="m-1">
            {{ getCategoryLabel(category) }}
          </button>

          <!-- 清空搜尋 -->
          <button @click="resetFilters" class="btn btn-outline-secondary m-1">
            &#88;
          </button>
        </div>

        <!-- 右側：排序下拉選單 -->
        <div class="dropdown m-1">
          <!-- <button class="btn btn-outline-green dropdown-toggle" type="button" data-bs-toggle="dropdown">
            排序方式
          </button> -->

          <button class="btn btn-outline-green dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="fa-solid fa-sliders"></i>

          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="sortOption = 'id-asc'">依課程 舊 → 新 </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="sortOption = 'id-desc'">依課程 新 → 舊</a>
            </li>
          </ul>
        </div>
      </div>



    </div>


    <!-- 載入畫面 -->
    <!-- <div v-if="isLoading" class="text-center py-5">資料載入中...</div> -->
 <!-- bootstrap的轉圈loading -->
    <!-- <div v-if="isLoading" class="text-center py-5">
  <div class="spinner-border text-success" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div> -->


<div v-if="isLoading" class="d-flex flex-column gap-3 w-100 align-items-center">
  <div v-for="n in 4" :key="n" class="card course-card mx-auto skeleton-card">
    <div class="d-flex h-100">
      <!-- 圖片骨架 -->
      <div class="p-3">
        <div class="skeleton-img shimmer"></div>
      </div>
      <!-- 右側文字骨架 -->
      <div class="card-body d-flex flex-column justify-content-center">
        <div class="skeleton-title shimmer mb-2"></div>
        <div class="skeleton-tag shimmer mb-2"></div>
        <div class="skeleton-text shimmer w-100 mb-2"></div>
        <div class="skeleton-text shimmer w-75"></div>
      </div>
    </div>
  </div>
</div>


    <!-- 課程卡片清單 -->
    <!-- <div v-if="courses.length > 0" :class="[
      'd-flex flex-column gap-3 w-100',
      'align-items-center'
    ]"> -->
    <div v-else-if="courses.length > 0" :class="[
      'd-flex flex-column gap-3 w-100',
      'align-items-center'
    ]">
      <router-link v-for="course in paginatedCourses" :key="course.courseId" :to="`/courses/${course.courseId}`"
        class="text-decoration-none w-100">
        <div class="card course-card mx-auto">
          <div class="d-flex h-100">
            <!-- 封面圖片 -->
            <div class="p-3">
              <img :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`" class="course-img rounded" alt="課程封面"
                loading="lazy" />
            </div>

            <!-- 課程標題＋簡介有的沒的 -->
            <div class="card-body d-flex flex-column justify-content-center text-dark">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text"><small class="text-muted">#{{ getCategoryLabel(course.category) }}</small></p>
              <p class="card-text">{{ course.description }}</p>
              <!-- <p class="card-text"><small class="text-muted">No.{{ course.courseId }}</small></p> -->
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div v-else class="text-center text-muted mt-4">查無課程資料。</div>
  </div>

  <!-- 頁數有的沒的 -->
  <div class="d-flex justify-content-center align-items-center">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link page-link-green" href="#" @click.prevent="goToPage(currentPage - 1)">
            &laquo;
          </a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link page-link-green" href="#" @click.prevent="goToPage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link page-link-green" href="#" @click.prevent="goToPage(currentPage + 1)">
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

const sortOption = ref('id-asc')

const sortedCourses = computed(() => {
  return [...courses.value].sort((a, b) => {
    if (sortOption.value === 'id-asc') return a.courseId - b.courseId
    if (sortOption.value === 'id-desc') return b.courseId - a.courseId
    return 0
  })
})

const courses = ref([]);
const searchKeyword = ref("");
const selectedCategory = ref(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 課程分類(enum)
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

const isLoading = ref(true);


// 初始載入所有課程
// const fetchCourses = async () => {
//   try {
//     const res = await axios.get("/api/courses");
//     courses.value = res.data;
//   } catch (err) {
//     console.error(err);
//   }
// };


const fetchCourses = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get("/api/courses");
    courses.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// 關鍵字搜尋課程
const searchCourses = async () => {
  const keyword = searchKeyword.value.trim();
  selectedCategory.value = null;
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
  searchKeyword.value = "";
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
const pageSize = 4; // 每頁幾筆（固定為 3）
// const paginatedCourses = computed(() => {
//   const start = (currentPage.value - 1) * pageSize;
//   return courses.value.slice(start, start + pageSize);
// });

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedCourses.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  return Math.ceil(courses.value.length / pageSize);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 滾動到課程區塊頂部
    // const target = document.getElementById("course-top");
    // if (target) {
    //   target.scrollTo({ top:0, behavior: "smooth" });
    // }

    // 滾動到課程區塊頂部下方家100px
    const target = document.getElementById("course-top");
    if (target) {
      const offset = 100; // 偏移 100px
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
};

const resetFilters = async () => {
  searchKeyword.value = "";
  selectedCategory.value = null;
  currentPage.value = 1;
  await fetchCourses();
};

// onMounted(fetchCourses);


onMounted(async () => {
  await fetchCourses()
  window.scrollTo({ top: 0, behavior: 'smooth' })
});

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

.form-select-sm {
  font-size: 0.875rem;
  padding: 0.25rem 1rem;
}

.filter-row,
.search-input,
.course-card {
  width: 90%;
  max-width: 1100px;
}

.btn-outline-green {
  color: var(--color-btn-primary-bg);
  border: 1px solid var(--color-btn-primary-bg);
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

.btn-outline-green:hover,
.btn-outline-green:focus {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
}

.page-link-green {
  color: var(--color-btn-primary-bg);
  border: 1px solid var(--color-btn-primary-bg);
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

.page-link-green:hover,
.page-link-green:focus {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
}

.page-item.active .page-link-green {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
  border-color: var(--color-btn-primary-bg);
}

.btn-primary {
  background-color: #4DB6AC !important;
  border-color: #4DB6AC !important;
  color: white !important;
}


.dropdown-item:focus,
.btn-primary:hover,
.btn-primary:focus {
  background-color: #399e95 !important;
  border-color: #399e95 !important;
}

.skeleton-card {
  width: 90%;
  max-width: 1100px;
  height: 332px;
}

.skeleton-img {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  background-color: #e0e0e0;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  border-radius: 4px;
  background-color: #e0e0e0;
}

.skeleton-tag {
  height: 16px;
  width: 40%;
  border-radius: 4px;
  background-color: #e0e0e0;
}

.skeleton-text {
  height: 14px;
  border-radius: 4px;
  background-color: #e0e0e0;
}

.shimmer {
  background-image: linear-gradient(90deg, #e0e0e0 0px, #f5f5f5 40px, #e0e0e0 80px);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

</style>
