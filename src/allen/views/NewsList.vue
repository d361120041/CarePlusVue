<template>
  <GlobalBanner :imgSrc="bannerImg">
    <h1>新聞列表</h1>
  </GlobalBanner>  

  <div class="news-list">
    <!-- 搜尋欄 -->
    <div class="search-bar mb-4 flex gap-2">
      <input 
        v-model="search.keyword" 
        type="text" 
        placeholder="輸入關鍵字"
        class="border p-2 rounded w-1/3"
      />
      <select v-model="search.categoryId" class="border p-2 rounded w-1/4">
        <option value="">選擇分類</option>
        <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
          {{ cat.categoryName }}
        </option>
      </select>
      <select v-model="search.dateRange" class="border p-2 rounded w-1/4">
        <option value="">選擇時間範圍</option>
        <option value="today">今天</option>
        <option value="week">這週</option>
        <option value="month">這月</option>
        <option value="year">今年</option>
      </select>
      <button @click="handleSearch" class="search-btn w-full">🔍 搜尋</button>
    </div>

    <!-- 搜尋摘要 -->
    <div v-if="hasSearched && summaryText" class="text-gray-700 mt-4 text-sm">
      🔎 以下是 {{ summaryText }} 的搜尋結果
      <button @click="clearSearch" class="ml-4 text-blue-600 underline hover:text-blue-800">
        取消篩選
      </button>
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
        <div class="flex-shrink-0">
          <img
            :src="getFullImageUrl(news.thumbnail) || defaultThumbnail"
            alt="縮圖"
            class="thumbnail"
            @error="handleImgError"
          />
        </div>

        <div class="flex-1">
          <h2 class="text-lg font-semibold">{{ news.title }}</h2>
          <p class="text-sm text-gray-600">📅 發布日期：{{ formatDate(news.publishAt) }}</p>
          <p class="text-sm text-gray-600">🛠️ 最後修改：{{ news.modifyAt ? formatDate(news.modifyAt) : '尚未修改' }}</p>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import myAxios from '@/plugins/axios';
import { getFullImageUrl } from '@/allen/utils/urlHelper.js'; // 引入函數
import noImage from '@/assets/allen/no-image.jpg';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import GlobalBanner from '@/components/GlobalBanner.vue'

const newsList = ref([]);
const categories = ref([]);
const page = ref(0);
const size = ref(5);
const hasNextPage = ref(true);
const loading = ref(false);
const defaultThumbnail = noImage;
const hasSearched = ref(false);
const searchSnapshot = ref({});
const search = ref({
  keyword: '',
  categoryId: '',
  dateRange: ''
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
};

const formatDateTime = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`; // ✅ 中間是空格
};

const buildDateRange = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (search.value.dateRange) {
    case 'today':
      return {
        dateFrom: formatDateTime(today),
        dateTo: formatDateTime(new Date(today.getTime() + 86400000))
      };
    case 'week': {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      return {
        dateFrom: formatDateTime(monday),
        dateTo: formatDateTime(endOfToday)
      };
    }
    case 'month': {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        dateFrom: formatDateTime(firstDay),
        dateTo: formatDateTime(now)
      };
    }
    case 'year': {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      return {
        dateFrom: formatDateTime(firstDay),
        dateTo: formatDateTime(now)
      };
    }
    default:
      return { dateFrom: null, dateTo: null };
  }
};

const loadNews = async () => {
  loading.value = true;
  const { dateFrom, dateTo } = buildDateRange();

  const requestBody = {
    keyword: search.value.keyword || null,
    categoryId: search.value.categoryId || null,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null
  };

  try {
    const res = await myAxios.post(`/news/public/search?page=${page.value}&size=${size.value}`, requestBody);
    newsList.value = res.data.content;
    hasNextPage.value = !res.data.last;
    hasSearched.value = true;
  } catch (err) {
    console.error('載入新聞失敗', err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  hasSearched.value = true;
  page.value = 0;
  searchSnapshot.value = { ...search.value }; // ✅ 固定當下搜尋條件
  loadNews();
};

const clearSearch = () => {
  search.value = { keyword: '', categoryId: '', dateRange: '' };
  searchSnapshot.value = {}; // ✅ 清除摘要內容來源
  hasSearched.value = false;
  page.value = 0;
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

const fetchCategories = async () => {
  try {
    const res = await myAxios.get('/news/category');
    categories.value = res.data;
  } catch (err) {
    console.error('載入分類失敗', err);
  }
};

const handleImgError = (e) => {
  if (e.target.src !== defaultThumbnail) {
    e.target.src = defaultThumbnail;
  }
};

const summaryText = computed(() => {
  const parts = [];
  const snap = searchSnapshot.value;

  if (snap.keyword) parts.push(`關鍵字為「${snap.keyword}」`);

  if (snap.categoryId) {
    const found = categories.value.find(c => c.categoryId === Number(snap.categoryId));
    if (found) parts.push(`分類為「${found.categoryName}」`);
  }

  const map = { today: '今天', week: '這週', month: '這月', year: '今年' };
  if (snap.dateRange && map[snap.dateRange]) {
    parts.push(`時間為「${map[snap.dateRange]}」`);
  }

  return parts.length ? parts.join('、') : '';
});


onMounted(() => {
  fetchCategories();
  loadNews();
});
</script>

<style scoped>
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
  gap: 1rem;
}
.page-btn {
  padding: 0.5rem 1.25rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}
.page-btn:hover {
  background-color: #d1d5db;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.search-btn {
  background-color: #e5e7eb;
  color: black;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
}
.search-btn:hover {
  background-color: #d1d5db;
}
.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>