<template>
  <div class="news-list">
    <!-- 搜尋欄 -->
    <div class="search-bar mx-auto max-w-4xl p-6 mb-10 bg-white rounded-xl shadow-lg border border-gray-300">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="search.keyword" type="text" placeholder="🔍 輸入關鍵字"
               class="border border-gray-300 p-2 rounded-md w-full" />

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
        <button @click="handleSearch" :disabled="loading" class="search-btn">🔍 搜尋</button>
      </div>
    </div>

    <!-- 上方標題與新增 -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">🛠 最新新聞列表（後台）</h1>
      <button @click="goToCreate" class="btn-green">
        <font-awesome-icon icon="fa-solid fa-plus" /> 新增新聞
      </button>
    </div>

    <NewsListSkeleton v-if="loading" />

    <!-- 新聞清單 -->
    <div v-else>
      <div v-for="news in newsList" :key="news.newsId" class="news-item flex items-start gap-4 mb-6 border-b pb-4">
        <router-link :to="`/admin/news/${news.newsId}`" class="flex-shrink-0">
          <img :src="getFullImageUrl(news.thumbnail) || defaultThumbnail" alt="縮圖"
               class="thumbnail" @error="handleImgError" />
        </router-link>

        <div class="flex-1">
          <router-link :to="`/admin/news/${news.newsId}`" class="text-lg font-semibold hover:underline">
            {{ news.title }}
          </router-link>

          <div class="flex flex-wrap gap-2 mt-2">
            <button @click="goToEdit(news.newsId)" class="btn-blue">
              <font-awesome-icon icon="fa-solid fa-pen" /> 編輯
            </button>
            <button @click="confirmDelete(news.newsId)" class="btn-red">
              <font-awesome-icon icon="fa-solid fa-trash" /> 刪除
            </button>
            <button v-if="news.status === 0" @click="publishNews(news.newsId)" class="btn-green">
              <font-awesome-icon icon="fa-solid fa-bullhorn" /> 發布
            </button>
            <button v-else @click="unpublishNews(news.newsId)" class="btn-yellow">
              <font-awesome-icon icon="fa-solid fa-box-archive" /> 下架
            </button>
          </div>

          <p class="text-sm text-gray-600 mt-2">📅 發布日期：{{ formatDate(news.publishAt) }}</p>
          <p class="text-sm text-gray-600">🛠️ 最後修改：{{ news.modifyAt ? formatDate(news.modifyAt) : '尚未修改' }}</p>
          <p class="text-sm text-gray-600">👁️ 瀏覽次數：{{ news.viewCount || 0 }}</p>
        </div>
      </div>

      <!-- 分頁 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 0 || loading" class="page-btn">上一頁</button>
        <span>第 {{ page + 1 }} 頁</span>
        <button @click="nextPage" :disabled="!hasNextPage || loading" class="page-btn">下一頁</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import myAxios from '@/plugins/axios';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import noImage from '@/assets/allen/no-image.jpg';
import { getFullImageUrl } from '@/allen/utils/urlHelper';

const router = useRouter();
const newsList = ref([]);
const categories = ref([]);
const page = ref(0);
const size = ref(5);
const hasNextPage = ref(true);
const loading = ref(false);
const defaultThumbnail = noImage;

const search = ref({
  keyword: '',
  categoryId: '',
  dateFrom: '',
  dateTo: ''
});

const loadNews = async () => {
  loading.value = true;
  const params = {
    keyword: search.value.keyword || null,
    categoryId: search.value.categoryId || null,
    dateFrom: search.value.dateFrom || null,
    dateTo: search.value.dateTo || null,
    status: -1
  };
  try {
    const res = await myAxios.post(`/news/admin/search?page=${page.value}&size=${size.value}`, params);
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

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: '確定要刪除嗎？',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '是的，刪除',
    cancelButtonText: '取消'
  });
  if (result.isConfirmed) {
    await myAxios.delete(`/news/admin/${id}`);
    Swal.fire('已刪除！', '', 'success');
    loadNews();
  }
};

const publishNews = async (id) => {
  await myAxios.patch(`/news/admin/${id}/publish`);
  loadNews();
};

const unpublishNews = async (id) => {
  await myAxios.patch(`/news/admin/${id}/unpublish`);
  loadNews();
};

const goToCreate = () => router.push('/admin/news/new');
const goToEdit = (id) => router.push(`/admin/news/edit/${id}`);
const handleImgError = (e) => { if (e.target.src !== defaultThumbnail) e.target.src = defaultThumbnail; };
const formatDate = (d) => new Date(d).toLocaleDateString();

const fetchCategories = async () => {
  const res = await myAxios.get('/news/category');
  categories.value = res.data;
};

onMounted(() => {
  fetchCategories();
  loadNews();
});
</script>

<style scoped>
.news-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.search-bar {
  background-color: #fff;
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
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1.25rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  font-weight: 500;
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

.btn-blue {
  @apply bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2 shadow-sm;
}
.btn-red {
  @apply bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 shadow-sm;
}
.btn-green {
  @apply bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-2 shadow-sm;
}
.btn-yellow {
  @apply bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-2 shadow-sm;
}
</style>