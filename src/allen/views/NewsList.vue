<template>
  <div class="news-list">
    <!-- 🔍 搜尋欄 -->
    <div class="search-bar mx-auto max-w-4xl p-6 mb-6 bg-white rounded-xl shadow-lg border border-gray-300">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="search.keyword"
          type="text"
          placeholder="🔍 請輸入關鍵字"
          class="border border-gray-300 p-2 rounded-md w-full"
        />

        <select v-model="search.categoryId" class="border border-gray-300 p-2 rounded-md w-full">
          <option value="">-- 所有分類 --</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
        </select>

        <!-- ⏰ 日期下拉 -->
        <select v-model="search.dateRange" class="border border-gray-300 p-2 rounded-md w-full">
          <option value="">-- 不限制時間 --</option>
          <option value="today">今天</option>
          <option value="week">這個禮拜</option>
          <option value="month">這個月</option>
          <option value="year">今年</option>
        </select>

        <button @click="handleSearch" :disabled="loading" class="search-btn w-full">
          🔍 搜尋
        </button>
      </div>

      <!-- ✅ 搜尋條件摘要 -->
      <div v-if="summaryText" class="text-gray-700 mt-4 text-sm">
        🔎 以下是 {{ summaryText }} 的搜尋結果
        <button @click="clearSearch" class="ml-4 text-blue-600 underline hover:text-blue-800">
          取消篩選
        </button>
      </div>
    </div>

    <!-- 📰 標題 -->
    <h1 class="text-2xl font-bold mb-6 text-center">最新新聞列表</h1>

    <NewsListSkeleton v-if="loading" />

    <!-- ✅ 新聞清單 -->
    <div v-else>
      <div
        v-for="news in newsList"
        :key="news.newsId"
        class="news-item flex items-start gap-4 mb-6 border-b pb-4"
      >
        <router-link :to="`/news/${news.newsId}`" class="flex-shrink-0">
          <img
            :src="getFullImageUrl(news.thumbnail) || defaultThumbnail"
            alt="縮圖"
            class="thumbnail"
            @error="handleImgError"
          />
        </router-link>

        <div class="flex-1 pt-2">
          <router-link :to="`/news/${news.newsId}`" class="text-lg font-semibold hover:underline">
            {{ news.title }}
          </router-link>
          <p class="text-sm text-gray-500 mt-1">📅 發布日期：{{ formatDate(news.publishAt) }}</p>
          <p class="text-sm text-gray-500">🛠️ 最後修改：{{ news.modifyAt ? formatDate(news.modifyAt) : '尚未修改' }}</p>
          <p class="text-sm text-gray-500">👁️ 瀏覽次數：{{ news.viewCount || 0 }}</p>
        </div>
      </div>

      <!-- 📄 分頁 -->
      <div class="pagination mt-6">
        <button @click="prevPage" :disabled="page === 0 || loading" class="page-btn">
          上一頁
        </button>
        <span>第 {{ page + 1 }} 頁</span>
        <button @click="nextPage" :disabled="!hasNextPage || loading" class="page-btn">
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import myAxios from '@/plugins/axios';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import noImage from '@/assets/allen/no-image.jpg';
import { getFullImageUrl } from '@/allen/utils/urlHelper';

const newsList = ref([]);
const page = ref(0);
const size = ref(5);
const loading = ref(false);
const hasNextPage = ref(true);
const defaultThumbnail = noImage;

const categories = ref([]);

const search = ref({
  keyword: '',
  categoryId: '',
  dateRange: ''
});

// ⏰ 日期篩選轉換
const buildDateRange = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (search.value.dateRange) {
    case 'today':
      return {
        dateFrom: today.toISOString(),
        dateTo: new Date(today.getTime() + 86400000).toISOString()
      };
    case 'week': {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return { dateFrom: start.toISOString(), dateTo: now.toISOString() };
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { dateFrom: start.toISOString(), dateTo: now.toISOString() };
    }
    case 'year': {
      const start = new Date(today.getFullYear(), 0, 1);
      return { dateFrom: start.toISOString(), dateTo: now.toISOString() };
    }
    default:
      return { dateFrom: null, dateTo: null };
  }
};

// 🔎 條件摘要文字
const summaryText = computed(() => {
  const parts = [];
  if (search.value.keyword) parts.push(`關鍵字為「${search.value.keyword}」`);
  if (search.value.categoryId) {
    const found = categories.value.find(c => c.categoryId === Number(search.value.categoryId));
    if (found) parts.push(`分類為「${found.categoryName}」`);
  }
  const map = { today: '今天', week: '這週', month: '這個月', year: '今年' };
  if (search.value.dateRange && map[search.value.dateRange]) {
    parts.push(`時間為「${map[search.value.dateRange]}」`);
  }
  return parts.length ? parts.join('、') : '';
});

// ✅ 搜尋
const loadNews = async () => {
  loading.value = true;
  const { dateFrom, dateTo } = buildDateRange();

  const params = {
    keyword: search.value.keyword.trim() || null,
    categoryId: search.value.categoryId || null,
    dateFrom,
    dateTo,
    page: page.value,
    size: size.value
  };

  try {
    const res = await myAxios.post(`/news/public/search?page=${page.value}&size=${size.value}`, params);
    newsList.value = res.data.content;
    hasNextPage.value = !res.data.last;
  } catch (err) {
    console.error('載入新聞失敗', err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 0;
  loadNews();
};

const clearSearch = () => {
  search.value = { keyword: '', categoryId: '', dateRange: '' };
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
  page.value++;
  loadNews();
};

const handleImgError = (event) => {
  if (event.target.src !== defaultThumbnail) {
    event.target.src = defaultThumbnail;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
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
});
</script>

<style scoped>
.news-list {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

.search-bar {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
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
  gap: 1rem;
  margin-top: 2rem;
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
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.search-btn:hover {
  background-color: #1d4ed8;
}
.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>