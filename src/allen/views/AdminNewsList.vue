<template>
  <div class="news-list">
    <div class="flex justify-between items-center mb-4">
      <h1>🛠 最新新聞列表（後台）</h1>
      <button 
        @click="goToCreate"
        class="btn-green">
        <font-awesome-icon icon="fa-solid fa-plus" /> 新增新聞
      </button>
    </div>

    <NewsListSkeleton v-if="loading" />

    <div v-else>
      <div v-for="news in newsList" :key="news.newsId" class="news-item">
        <div class="news-item">
          <router-link :to="`/admin/news/${news.newsId}`" class="news-link">
            <img :src="getFullImageUrl(news.thumbnail) || defaultThumbnail" alt="縮圖" class="thumbnail" @error="handleImgError" />
            <h2>{{ news.title }}</h2>
          </router-link>
          <button @click="goToEdit(news.newsId)" class="btn-blue">
            <font-awesome-icon icon="fa-solid fa-pen" /> 編輯
          </button>
          <button @click="confirmDelete(news.newsId)" class="btn-red">
            <font-awesome-icon icon="fa-solid fa-trash" /> 刪除
          </button>
          <button
            v-if="news.status === 0"
            @click="publishNews(news.newsId)"
            class="btn-green">
            <font-awesome-icon icon="fa-solid fa-bullhorn" /> 發布
          </button>
          <button
            v-else
            @click="unpublishNews(news.newsId)"
            class="btn-yellow">
            <font-awesome-icon icon="fa-solid fa-box-archive" /> 下架
          </button>
        </div>
        <p>👁️ 瀏覽次數：{{ news.viewCount || 0 }}</p>
        <p>發布日期：{{ formatDate(news.publishAt) }}</p>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="page === 0 || loading">上一頁</button>
        <span>第 {{ page + 1 }} 頁</span>
        <button @click="nextPage" :disabled="!hasNextPage || loading">下一頁</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAllNews } from '@/allen/services/newsService';
import noImage from '@/assets/allen/no-image.jpg';
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue';
import { getFullImageUrl } from '@/allen/utils/urlHelper';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import myAxios from '@/plugins/axios';

const router = useRouter();
const newsList = ref([]);
const page = ref(0);
const size = ref(5);
const loading = ref(false);
const hasNextPage = ref(true);
const defaultThumbnail = noImage;

const handleImgError = (event) => {
  if (event.target.src !== defaultThumbnail) {
    event.target.src = defaultThumbnail;
  }
};

const loadNews = async () => {
  loading.value = true;
  try {
    const response = await fetchAllNews(page.value, size.value);
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

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: '確定要刪除嗎？',
    text: '刪除後將無法復原！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '是的，刪除',
    cancelButtonText: '取消'
  });

  if (result.isConfirmed) {
    try {
      await myAxios.delete(`/news/admin/${id}`);
      Swal.fire('刪除成功', '', 'success');
      loadNews();
    } catch (err) {
      Swal.fire('刪除失敗', err.message || '發生錯誤', 'error');
    }
  }
};

const publishNews = async (id) => {
  try {
    await myAxios.patch(`/news/admin/${id}/publish`);
    Swal.fire('已發布', '', 'success');
    loadNews();
  } catch (err) {
    Swal.fire('發布失敗', err.message || '發生錯誤', 'error');
  }
};

const unpublishNews = async (id) => {
  try {
    await myAxios.patch(`/news/admin/${id}/unpublish`);
    Swal.fire('已下架', '', 'success');
    loadNews();
  } catch (err) {
    Swal.fire('下架失敗', err.message || '發生錯誤', 'error');
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

const goToCreate = () => {
  router.push('/admin/news/new');
};

const goToEdit = (id) => {
  router.push(`/admin/news/edit/${id}`);
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.news-list {
  max-width: 800px;
  margin: 0 auto;
}
.news-item {
  border-bottom: 1px solid #ccc;
  padding: 16px 0;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  margin: 0 8px;
}
.news-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}
.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 16px;
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