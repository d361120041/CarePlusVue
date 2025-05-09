<template>
  <div class="news-list">
    
    <!-- 搜尋欄 -->
    <div class="search-bar mx-auto max-w-4xl p-6 mb-6 bg-white rounded-xl shadow-lg border border-gray-300 flex justify-between items-center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        <input
          v-model="search.keyword"
          type="text"
          placeholder="🔍 請輸入關鍵字"
          class="border border-gray-300 p-2 rounded-md w-full"
          @keyup.enter="handleSearch"
        />

        <select v-model="search.categoryId" class="border border-gray-300 p-2 rounded-md w-full">
          <option value="">-- 所有分類 --</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
        </select>

        <select v-model="search.dateRange" class="border border-gray-300 p-2 rounded-md w-full">
          <option value="">-- 不限制時間 --</option>
          <option value="today">今天</option>
          <option value="week">這週</option>
          <option value="month">這個月</option>
          <option value="year">今年</option>
        </select>

        <!-- 新增篩選條件：發布/下架 -->
        <select v-model="search.status" class="border border-gray-300 p-2 rounded-md w-full">
          <option value="">-- 狀態篩選 --</option>
          <option value="1">發布</option>
          <option value="0">下架</option>
        </select>

        <!-- 搜尋按鈕 -->
        <button @click="handleSearch" :disabled="loading" class="search-btn w-full">
          🔍 搜尋
        </button>

      </div>

    </div>

    <!-- 搜尋摘要 -->
    <div v-if="hasSearched && summaryText" class="text-gray-700 mt-4 text-sm">
      🔎 以下是 {{ summaryText }} 的搜尋結果
      <button @click="clearSearch" class="ml-4 text-blue-600 underline hover:text-blue-800">
        取消篩選
      </button>
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

        <div class="flex-1 pt-2">
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
      <div class="pagination mt-6">
        <button @click="prevPage" :disabled="page === 0 || loading" class="page-btn">上一頁</button>
        <span>第 {{ page + 1 }} 頁</span>
        <button @click="nextPage" :disabled="!hasNextPage || loading" class="page-btn">下一頁</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import myAxios from '@/plugins/axios';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import noImage from '@/assets/allen/no-image.jpg';
import { getFullImageUrl } from '@/allen/utils/urlHelper';

const newsList = ref([]);
const categories = ref([]);
const page = ref(0);
const size = ref(5);
const hasNextPage = ref(true);
const loading = ref(false);
const defaultThumbnail = noImage;
const hasSearched = ref(false);
const searchSnapshot = ref({});

const search = ref({ keyword: '', categoryId: '', dateRange: '', status: '' });

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
  // ✅ 新增狀態篩選條件描述
  if (snap.status !== '') {
    const statusText = snap.status === "1" ? "發布" : "下架";
    parts.push(`狀態為「${statusText}」`);
  }
  return parts.length ? parts.join('、') : '';
});

const clearSearch = () => {
  search.value = { keyword: '', categoryId: '', dateRange: '' , status: ''};
  searchSnapshot.value = {}; // ✅ 清除摘要內容來源
  hasSearched.value = false;
  page.value = 0;
  loadNews();
};

const loadNews = async () => {
  loading.value = true;
  const { dateFrom, dateTo } = buildDateRange();

  const params = {
    status: -1 // 一定要保留
  };

  if (search.value.keyword) params.keyword = search.value.keyword;
  if (search.value.categoryId) params.categoryId = search.value.categoryId;
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;
  if (search.value.status) params.status = search.value.status;

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
  hasSearched.value = true;
  page.value = 0;
  searchSnapshot.value = { ...search.value }; // ✅ 固定當下搜尋條件
  loadNews();
};

const prevPage = () => { if (page.value > 0) { page.value--; loadNews(); } };
const nextPage = () => { page.value++; loadNews(); };

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: '確定要刪除嗎？', icon: 'warning', showCancelButton: true,
    confirmButtonText: '是的，刪除', cancelButtonText: '取消'
  });
  if (result.isConfirmed) {
    await myAxios.delete(`/news/admin/${id}`);
    Swal.fire('已刪除！', '', 'success');
    loadNews();
  }
};

const publishNews = async (id) => {
  try {
    await myAxios.patch(`/news/admin/${id}/publish`);
    
    await Swal.fire({
      icon: 'success',
      title: '已成功發布！',
      confirmButtonText: '確定'
    });

    loadNews();
  } catch (err) {
    console.error('發布失敗：', err);
    Swal.fire({
      icon: 'error',
      title: '發布失敗',
      text: err.message || '請稍後再試',
      confirmButtonText: '確定'
    });
  }
};
const unpublishNews = async (id) => {
  try {
    await myAxios.patch(`/news/admin/${id}/unpublish`);
    
    await Swal.fire({
      icon: 'success',
      title: '已成功下架！',
      confirmButtonText: '確定'
    });

    loadNews();
  } catch (err) {
    console.error('下架失敗：', err);
    Swal.fire({
      icon: 'error',
      title: '下架失敗',
      text: err.message || '請稍後再試',
      confirmButtonText: '確定'
    });
  }
};
const goToCreate = () => router.push('/admin/news/new');
const goToEdit = (id) => router.push(`/admin/news/edit/${id}`);
const handleImgError = (e) => { if (e.target.src !== defaultThumbnail) e.target.src = defaultThumbnail; };

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
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  align-items: flex-start;
}
.news-list {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}
.news-item > div.flex-1 {
  padding-top: 0.5rem;
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
.fixed {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 1000; /* 確保在其他元素上方 */
}

.btn-gray {
  background-color: #e5e7eb;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.btn-gray:hover {
  background-color: #d1d5db;
}
</style>