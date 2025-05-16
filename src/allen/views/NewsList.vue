<template>
  <GlobalBanner :imgSrc="bannerImg">
    <div class="banner-text">
      <h1>新聞快訊</h1>
      <p class="sub-text">即時新聞，第一時間掌握</p>
    </div>
  </GlobalBanner>  

  <div class="news-page flex gap-6">
    <!-- 左側新聞列表區域 -->
    <div class="news-list">
      <!-- 搜尋欄 -->
      <div class="search-bar mb-4 flex gap-2" @keyup.enter="handleSearch">
        <input 
          v-model="search.keyword" 
          type="text" 
          placeholder="輸入關鍵字"
          class="border p-2 rounded w-1/3"
          
        />
        <select v-model="search.categoryId" class="border p-2 rounded w-1/4" >
          <option value="">選擇分類</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
        </select>
        <select v-model="search.dateRange" class="border p-2 rounded w-1/4" >
          <option value="">選擇時間範圍</option>
          <option value="today">今天</option>
          <option value="week">7天內</option>
          <option value="month">30天內</option>
          <option value="year">365天內</option>
        </select>

        <!-- 新增排序條件 -->
        <select v-model="search.sortBy" class="border p-2 rounded w-1/4">
          <option value="">排序條件</option>
          <option value="publishAt">依發布日期</option>
          <option value="viewCount">依瀏覽人數</option>
          <option value="modifyAt">依最後修改日期</option>
        </select>

        <!-- 搜尋按鈕 -->
        <button @click="handleSearch" class="search-btn w-full">🔍 搜尋</button>
        <!-- 清除按鈕 -->
        <button @click="clearAll" class="btn-clear">X</button>
      </div>

      <!-- 快捷分類按鈕 -->
      <div class="category-buttons flex gap-2 mb-4">
        <button 
          v-for="cat in categories" 
          :key="cat.categoryId" 
          @click="applyCategoryFilter(cat.categoryId)"
          :class="['btn-outline-green', selectedCategory === cat.categoryId ? 'btn-selected' : '']"
        >
          {{ cat.categoryName }}
        </button>
      </div>

      <!-- 搜尋摘要 -->
      <div v-if="hasSearched && summaryText" class="search-summary text-gray-700 mt-4">
        🔎 以下是 {{ summaryText }} 的搜尋結果
      </div>

      <NewsListSkeleton v-if="loading" />

      <!-- 新聞清單 -->
      <div v-if="newsList.length === 0" class="text-gray-500 text-center">暫無新聞資料</div>
        <div v-else>
          <div
            v-for="news in newsList"
            :key="news.newsId"
            class="news-item flex items-start gap-4 mb-6 border-b pb-4"
          >
              <router-link :to="`/news/${news.newsId}`" class="flex-shrink-0">
                <img
                :src="getFullImageUrl(news.thumbnail)"
                alt="縮圖"
                class="thumbnail w-20 h-20 object-cover rounded-lg shadow"
                @error="handleImgError"
                />
              </router-link>

            <div class="flex-1">
              <router-link :to="`/news/${news.newsId}`" class="text-lg font-semibold hover:underline block mb-1"
              >
                {{ news.title }}
              </router-link>
              <p class="text-sm text-gray-600">📅 發布日期：{{ formatDate (news.publishAt) }}</p>
              <p class="text-sm text-gray-600">🛠️ 最後修改：{{ news.modifyAt ? formatDate (news.modifyAt) : '尚未修改' }}</p>
              <p class="text-sm text-gray-600">👁️ 瀏覽次數：{{ news.viewCount || 0 }}</p>
            </div>  
        </div> 

        <!-- 分頁控制 -->
        <div class="pagination mt-6">
          <button @click="prevPage" :disabled="page === 0 || loading" class="page-btn">上一頁</button>
          <span>第 {{ page + 1 }} 頁</span>
          <button @click="nextPage" :disabled="!hasNextPage || loading" class="page-btn">下一頁</button>
        </div> 
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import myAxios from '@/plugins/axios';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import GlobalBanner from '@/components/GlobalBanner.vue';
import defaultThumbnail from '@/assets/allen/no-image.jpg';
import { getFullImageUrl } from '@/allen/utils/urlHelper.js';

const newsList = ref([]);
const categories = ref([]);
const page = ref(0);
const size = ref(5);
const hasNextPage = ref(true);
const loading = ref(false);
const hasSearched = ref(false);
const searchSnapshot = ref({});
const search = ref({keyword: '', categoryId: '', dateRange: '', sortBy: ''});

const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date)) {
    console.warn("Invalid date passed to formatDate:", date);
    return '';
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
};

const formatDateTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    console.warn("Invalid date passed to formatDateTime:", date);
    return '';
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const buildDateRange = () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayStart.getDate() + 1);
  todayEnd.setMilliseconds(-1);

  let dateFrom = null;
  let dateTo = formatDateTime(now);

  switch (search.value.dateRange) {
    case 'today':
      dateFrom = formatDateTime(todayStart);
      dateTo = formatDateTime(todayEnd);
      break;

    case 'week': {
      const startOfWeek = new Date(todayStart);
      startOfWeek.setDate(todayStart.getDate() - 6);
      dateFrom = formatDateTime(startOfWeek);
      dateTo = formatDateTime(todayEnd); // ✅ 修復：增加 `dateTo`
      break;
    }

    case 'month': {
      const startOfMonth = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
      dateFrom = formatDateTime(startOfMonth);
      dateTo = formatDateTime(todayEnd); // ✅ 修復：增加 `dateTo`
      break;
    }

    case 'year': {
      const startOfYear = new Date(todayStart.getFullYear(), 0, 1);
      dateFrom = formatDateTime(startOfYear);
      dateTo = formatDateTime(todayEnd); // ✅ 修復：增加 `dateTo`
      break;
    }

    default:
      dateFrom = null;
      dateTo = null;
      break;
  }

  return { dateFrom, dateTo };
};

const summaryText = computed(() => {
  const parts = [];
  const snap = searchSnapshot.value;

  if (snap.keyword) {
    parts.push(`關鍵字為「${snap.keyword}」`);
  }

  if (snap.categoryId) {
    const found = categories.value.find(c => c.categoryId === Number(snap.categoryId));
    if (found) parts.push(`分類為「${found.categoryName}」`);
  }

  const rangeMap = {
    today: '今天',
    week: '7天內',
    month: '30天內',
    year: '365天內',
  };

  // ✅ 若 `dateRange` 為空，顯示 "不限時間"
  if (snap.dateRange && rangeMap[snap.dateRange]) {
    parts.push(`時間為「${rangeMap[snap.dateRange]}」`);
  }

  // ✅ 排序條件顯示
  const sortMap = {
    publishAt: "依發布日期",
    viewCount: "依瀏覽人數",
    modifyAt: "依最後修改日期",
  };

  if (snap.sortBy && sortMap[snap.sortBy]) {
    parts.push(`排序為「${sortMap[snap.sortBy]}」`);
  }

  return parts.length ? parts.join('、') : '';
});

const loadNews = async () => {
  loading.value = true;
  const { dateFrom, dateTo } = buildDateRange();

  const requestBody = {
    keyword: search.value.keyword || null,
    categoryId: search.value.categoryId || null,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  };

  // ✅ 將 sortBy 與 sortDirection 分離出來，並傳遞至 URL 查詢參數
  const sortBy = search.value.sortBy || 'publishAt';
  const sortDirection = "desc";

  console.log("傳遞的排序參數：", sortBy, sortDirection);
  console.log("API 請求 URL：", `/news/public/search?page=${page.value}&size=${size.value}&sortBy=${sortBy}&sortDirection=${sortDirection}`);

  try {
    const res = await myAxios.post(
      `/news/public/search?page=${page.value}&size=${size.value}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      requestBody
    );

    console.log("API 返回數據：", res.data.content);

    // ✅ 強制觸發 reactivity，避免 Vue 跳過更新
    newsList.value = [];
    newsList.value = res.data.content;

    hasNextPage.value = !res.data.last;
    hasSearched.value = true;

  } catch (err) {
    console.error('載入新聞失敗', err);
  } finally {
    loading.value = false;
  }
};

const selectedCategory = ref(null);

const applyCategoryFilter = (categoryId) => {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null;
    search.value.categoryId = '';
  } else {
    selectedCategory.value = categoryId;
    search.value.categoryId = categoryId;
  }

  handleSearch();
};

const clearAll = () => {
  selectedCategory.value = null;
  search.value = {
    keyword: '',
    categoryId: '',
    dateRange: '',
    sortBy: ''
  };
  // ✅ 清除篩選條件後，重新執行 `handleSearch`
  handleSearch();
};

const handleSearch = () => {
  hasSearched.value = true;
  page.value = 0;

  // ✅ 更新 `searchSnapshot`，確保按鈕狀態被正確監測
  searchSnapshot.value = { ...search.value };

  // ✅ 更新快捷按鈕狀態
  selectedCategory.value = search.value.categoryId;

  loadNews();
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadNews();
  }
};

const nextPage = () => {
  if (hasNextPage.value) {
    page.value++;
    loadNews();
  }
};

// 圖片加載錯誤時，切換至預設圖片
const handleImgError = (event) => {
  event.target.src = getFullImageUrl(''); // 空路徑將回退至 `defaultThumbnail`
};

const fetchCategories = async () => {
  try {
    const res = await myAxios.get('/news/category');
    categories.value = res.data;
  } catch (err) {
    console.error('載入分類失敗', err);
  }
};

onMounted(() => {
  fetchCategories();
  loadNews();
  console.log("初次加載 categories：", categories.value);
});

</script>

<style scoped>

.news-page {
  padding: var(--space-lg);
  max-width: 1280px;
  margin: 0 auto;
}

.news-list {
  width: auto; /* 自動根據內容調整寬度 */
  max-width: 1200px; /* 根據內容調整寬度，但最大不超過 1200px */
  margin-left: auto;  /* 置中對齊 */
  margin-right: auto;
  padding-right: var(--space-lg);
  transition: width 0.3s ease;
}

.thumbnail {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}
.news-item {
  display: flex;
  gap: 1.25rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  align-items: flex-start;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
}

.page-btn {
  padding: var(--space-xs) var(--space-md);
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm); /* 初始陰影 */
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-btn-primary-bg-hover);
  box-shadow: var(--shadow-md); /* 加深陰影 */
  transform: translateY(-1px);
}

.page-btn:active:not(:disabled) {
  background-color: var(--color-btn-primary-bg-hover);
  box-shadow: var(--shadow-lg); /* 按下時再加深 */
  transform: translateY(0);
}

.page-btn:disabled {
  background-color: var(--color-btn-disabled-bg);
  color: var(--color-btn-disabled-text);
  cursor: not-allowed;
  box-shadow: var(--shadow-none);
  transform: none;
}

.page-btn:disabled:hover {
  background-color: var(--color-btn-disabled-bg); 
  color: var(--color-btn-disabled-text);
  box-shadow: var(--shadow-none); /* 禁用狀態無陰影 */
  transform: none;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm); /* 控制欄位間距 */
  padding: var(--space-xs);
  flex-wrap: nowrap; /* 禁止換行 */
  background-color: var(--color-bg-surface);
}

.search-bar input {
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  height: 38px;
  width: 20%;  /* 調整寬度 */
  min-width: 150px;  /* 最小寬度 */
}

.search-bar select {
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  height: 38px;
  width: 20%;  /* 調整寬度 */
  min-width: 120px;  /* 最小寬度 */
}

.search-summary {
  display: flex;
  align-items: center; /* 垂直置中對齊 */
  gap: var(--space-sm); /* 控制左右間距 */
  font-size: var(--font-size-lg); /* 調整字體大小 */
  margin-bottom: var(--space-sm); /* 調整與底部搜尋欄的距離 */
}

.search-btn {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  width: 150px; /* 根據視覺比例調整 */
  height: 38px; /* 與左側輸入欄位高度一致 */
  cursor: pointer;
  transition: background-color var(--transition-medium), box-shadow var(--transition-fast), transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: var(--color-btn-primary-bg-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.search-btn:active {
  background-color: var(--color-btn-primary-bg-hover);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

.search-btn:disabled {
  background-color: var(--color-btn-disabled-bg);
  color: var(--color-btn-disabled-text);
  cursor: not-allowed;
  box-shadow: var(--shadow-none);
  transform: none;
}

.btn-outline-green {
  color: var(--color-btn-primary-bg);
  border: 1px solid var(--color-btn-primary-bg);
  background-color: transparent;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-right: 0.5rem; /* 調整按鈕之間的間隔 */
}

.btn-outline-green:hover {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
}

.btn-selected {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
}

.btn-clear {
  background-color: var(--color-btn-secondary-bg);
  color: var(--color-btn-secondary-text);
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-btn-secondary-bg);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-clear:hover {
  background-color: var(--color-btn-secondary-bg-hover);
  color: #fff;
}
.banner-text {
  font-weight: 800;
  color: #2D3748;
  text-shadow: 3px 3px 6px rgba(255, 255, 255, 0.8);  /* 更明顯的光暈效果 */
  letter-spacing: 1px;  /* 增加字間距 */
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  text-align: center;
}

.sub-text {
  font-size: 1.5rem;  /* 縮小副標題 */
  font-weight: 600;
  color: #2D3748;
  margin-top: 10px;
}
</style>