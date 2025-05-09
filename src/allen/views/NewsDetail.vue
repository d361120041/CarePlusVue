<template>
  <div class="news-detail">
    <!-- 載入中 -->
    <div v-if="loading" class="text-center text-gray-500">載入中...</div>

    <!-- 顯示資料 -->
    <div v-else-if="news">
      <!-- 標題 -->
      <h1 class="text-3xl font-bold mb-4">{{ news.title }}</h1>

      <!-- 發布資訊 -->
      <div class="text-sm text-gray-600 mb-2">
        📅 發布日期：{{ formatDate(news.publishAt) }}<br>
        🛠️ 最後修改：{{ news.modifyAt ? formatDate(news.modifyAt) : '尚未修改' }}<br>
        📂 分類：{{ news.category?.categoryName || '未分類' }}<br>
        👁️ 瀏覽次數：{{ news.viewCount || 0 }}
      </div>

      <!-- 縮圖 -->
      <img
            :src="getFullImageUrl(news.thumbnail) || defaultThumbnail"
            alt="縮圖"
            class="thumbnail"
            @error="handleImgError"
          />

      <!-- 內容 -->
      <div class="news-content" v-html="news.content"></div>

      <!-- 返回按鈕 -->
      <div class="mt-6">
        <router-link to="/news" class="btn-primary">🔙 返回新聞列表</router-link>
      </div>
    </div>

    <!-- 錯誤處理 -->
    <div v-else class="text-center text-red-500 mt-6">
      <p>{{ errorMessage }}</p>
      <router-link to="/news" class="btn-primary mt-4">🔙 返回新聞列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFullImageUrl } from '@/allen/utils/urlHelper';
import { fetchPublishedNewsById } from '@/allen/services/newsService';
import noImage from '@/assets/allen/no-image.jpg';

const route = useRoute();
const news = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const defaultThumbnail = noImage;

const loadNews = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const response = await fetchPublishedNewsById(id);
    news.value = response.data;

    if (!news.value || news.value.status !== 1) {
      errorMessage.value = '找不到這則新聞或尚未發布';
      news.value = null;
    }
  } catch (error) {
    console.error('載入新聞失敗', error);
    errorMessage.value = '載入失敗，請稍後再試';
    news.value = null;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const handleImgError = (e) => {
  e.target.src = defaultThumbnail;
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.detail-thumbnail {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin: 1.5rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.news-content {
  margin-top: 1.5rem;
  font-size: 1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  color: #333;
}

.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #2563eb;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}
</style>  