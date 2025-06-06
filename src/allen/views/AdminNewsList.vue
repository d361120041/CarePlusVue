<template>
  <div class="news-list">
    
    <!-- 搜尋欄 -->
    <div class="search-bar mb-4 flex gap-2">
      
        <input
          v-model="search.keyword"
          type="text"
          placeholder="🔍 請輸入關鍵字"
          class="border border-gray-300 p-2 rounded-md w-full"
          @keyup.enter="handleSearch"
        />

        <select v-model="search.categoryId" class="border p-2 rounded w-1/4">
          <option value="">-- 所有分類 --</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
        </select>

        <select v-model="search.dateRange" class="border p-2 rounded w-1/4">
          <option value="">-- 不限制時間 --</option>
          <option value="today">今天</option>
          <option value="week">7天內</option>
          <option value="month">30天內</option>
          <option value="year">365天內</option>
        </select>

        <!-- 新增篩選條件：發布/下架 -->
        <select v-model="search.status" class="border p-2 rounded w-1/4">
          <option value="">-- 狀態篩選 --</option>
          <option value="1">發布</option>
          <option value="0">下架</option>
        </select>

        <!-- 搜尋按鈕 -->
        <button @click="handleSearch" :disabled="loading" class="search-btn w-full">
          🔍 搜尋
        </button>

      

    </div>

    <!-- 搜尋摘要 -->
    <div v-if="hasSearched && summaryText" class="search-summary text-gray-700 mt-4">
      🔎 以下是 {{ summaryText }} 的搜尋結果
      <button @click="clearSearch" class="clear-btn">取消篩選</button>
    </div>

    <!-- 上方標題與新增 -->
    <div class="header-container flex justify-between items-center mb-4">
      <h1 class="header-title">🛠 最新新聞列表</h1>
      <button @click="goToCreate" class="btn-blue">
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

          <div class="btn-group flex flex-wrap gap-2 mt-2">
            <button @click="goToEdit(news.newsId)" class="btn-blue">
              <font-awesome-icon icon="fa-solid fa-pen" /> 編輯
            </button>
            <button @click="confirmDelete(news.newsId)" class="btn-red">
              <font-awesome-icon icon="fa-solid fa-trash" /> 刪除
            </button>
            <button v-if="news.status === 0" @click="publishNews(news.newsId)" class="btn-green">
              <font-awesome-icon icon="fa-solid fa-bullhorn" /> 發布
            </button>
            <button v-else @click="unpublishNews(news.newsId)" class="btn-grey">
              <font-awesome-icon icon="fa-solid fa-box-archive" /> 下架
            </button>
          </div>

          <p class="text-sm text-gray-600 mt-2">📅 發布日期：{{ formatDate(news.publishAt) }}</p>
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
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import myAxios from '@/plugins/axios';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
// import defaultThumbnail from '@/assets/allen/no-image.jpg';
import { getFullImageUrl } from '@/allen/utils/urlHelper';
import { useRouter } from 'vue-router';

const router = useRouter();
const newsList = ref([]);
const categories = ref([]);
const page = ref(0);
const size = ref(5);
const hasNextPage = ref(true);
const loading = ref(false);
const hasSearched = ref(false);
const searchSnapshot = ref({});
const defaultThumbnail = '/allen/no-image.jpg'; // 設定預設縮圖路徑

const search = ref({ keyword: '', categoryId: '', dateRange: '', status: '' });

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

  //時間篩選條件
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

  // ✅ 狀態篩選條件
  if (snap.status !== '') {
    const statusText = snap.status === "1" ? "發布" : "下架";
    parts.push(`狀態為「${statusText}」`);
  }

  return parts.length ? parts.join('、') : '';
});

const clearSearch = () => {
  // ✅ 清空篩選條件
  search.value = { keyword: '', categoryId: '', dateRange: '', status: '' };
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

  // ✅ 直接覆蓋 searchSnapshot，避免累積
  searchSnapshot.value = { ...search.value };
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
.btn-group {
    display: flex;
    flex-wrap: wrap;  /* 自動換行 */
    gap: var(--space-md);  /* 控制按鈕之間的間距 */
    margin-top: var(--space-sm);
}
.btn-blue {
  background-color: var(--color-tertiary);
  color: var(--color-btn-primary-text);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  border: none;
  outline: none;
  box-shadow: var(--shadow-sm);
}

.btn-blue:hover {
  background-color: #3480b1; /* 輔助色 hover 效果 */
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-blue:active {
  background-color: #2c6d99;
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
}
.btn-red {
  background-color: var(--color-btn-secondary-bg);
  color: var(--color-btn-secondary-text);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  border: none;
  outline: none;
  box-shadow: var(--shadow-sm);
}

.btn-red:hover {
  background-color: var(--color-btn-secondary-bg-hover); /* 紅色 hover */
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-red:active {
  background-color: #d47171; /* 紅色 active */
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
}
.btn-green {
  background-color: var(--color-primary);  /* 綠色背景 */
  color: var(--color-btn-primary-text);    /* 白色文字 */
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  border: none;
  outline: none;
  box-shadow: var(--shadow-sm);  /* 初始陰影 */
}

.btn-green:hover {
  background-color: #3a9d93;  /* 綠色 hover */
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-green:active {
  background-color: #33867d;  /* 綠色 active */
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
}
.btn-grey{
  background-color: #c9c9c9;  /* 綠色背景 */
  color: var(--color-btn-primary-text);    /* 白色文字 */
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  border: none;
  outline: none;
  box-shadow: var(--shadow-sm);  /* 初始陰影 */
}
.btn-grey:hover {
  background-color: #c4c4c4;  /* 綠色 hover */
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-grey:active {
  background-color: #a9a9a9;  /* 綠色 active */
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
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
  width: 25%;  /* 調整寬度 */
  min-width: 150px;  /* 最小寬度 */
}

.search-bar select {
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  height: 38px;
  width: 25%;  /* 調整寬度 */
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
  width: 120px; /* 根據視覺比例調整 */
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

.clear-btn {
  background-color: var(--color-btn-secondary-bg);
  color: var(--color-btn-secondary-text);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background-color: var(--color-btn-secondary-bg-hover);
  transform: translateY(-2px);
}

.clear-btn:active {
  background-color: var(--color-btn-secondary-bg-hover);
  transform: translateY(0);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: var(--font-size-xl); /* 加大標題字體 */
  font-weight: bold;
}

</style>