<template>
  <div class="news-list">
    <!-- 🔍 搜尋欄卡片 -->
    <div class="search-bar mx-auto max-w-4xl p-6 mb-10 bg-white rounded-xl shadow-lg border border-gray-300">
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

        <div class="flex gap-2">
          <input type="date" v-model="search.dateFrom" class="border border-gray-300 p-2 rounded-md w-full" />
          <input type="date" v-model="search.dateTo" class="border border-gray-300 p-2 rounded-md w-full" />
        </div>
      </div>

      <div class="mt-4 text-right">
        <button
          @click="handleSearch"
          :disabled="loading"
          class="search-btn"
        >
          🔍 搜尋
        </button>
      </div>
    </div>

    <!-- 📰 新聞標題 -->
    <h1 class="text-2xl font-bold mb-6 text-center">最新新聞列表</h1>

    <NewsListSkeleton v-if="loading" />

    <!-- ✅ 新聞列表 -->
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

        <div>
          <router-link :to="`/news/${news.newsId}`" class="text-lg font-semibold hover:underline">
            {{ news.title }}
          </router-link>
          <p class="text-sm text-gray-500">📅 發布日期：{{ formatDate(news.publishAt) }}</p>
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
import { ref, onMounted } from 'vue';
import noImage from '@/assets/allen/no-image.jpg';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import { getFullImageUrl } from '@/allen/utils/urlHelper';
import myAxios from '@/plugins/axios';

const newsList = ref([]);
const page = ref(0);
const size = ref(5);
const loading = ref(false);
const hasNextPage = ref(true);
const defaultThumbnail = noImage;

const search = ref({
  keyword: '',
  categoryId: '',
  dateFrom: '',
  dateTo: ''
});

const categories = ref([]);

const handleSearch = () => {
  page.value = 0;
  loadNews();
};

const handleImgError = (event) => {
  if (event.target.src !== defaultThumbnail) {
    event.target.src = defaultThumbnail;
  }
};

const loadNews = async () => {
  loading.value = true;

  try {
    const params = {
      keyword: search.value.keyword || null,
      categoryId: search.value.categoryId || null,
      dateFrom: search.value.dateFrom || null,
      dateTo: search.value.dateTo || null,
      page: page.value,
      size: size.value
    };

    const response = await myAxios.post(
      `/news/public/search?page=${page.value}&size=${size.value}`,
      params
    );

    setTimeout(() => {
      newsList.value = response.data.content;
      hasNextPage.value = !response.data.last;
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('載入新聞失敗', error);
    loading.value = false;
  }
};

const nextPage = () => {
  page.value++;
  loadNews();
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadNews();
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-bar {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.news-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
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

/* 搜尋按鈕樣式 */
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
  background-color: #2563eb;
  opacity: 0.5;
  color: white;
  cursor: not-allowed;
}
</style>