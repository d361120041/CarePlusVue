<template>
  <div class="news-detail">
    <h1>新聞詳細內容</h1>

    <div v-if="loading">載入中...</div>

    <div v-else-if="news">
      <h2>{{ news.title }}</h2>
      <small>發布日期：{{ formatDate(news.publishAt) }}</small>

      <!-- 📄 內文 -->
      <div class="news-content" v-html="news.content"></div>

      <!-- 返回按鈕 -->
      <div style="margin-top: 20px;">
        <router-link to="/news" class="btn-primary">
          回到新聞列表
        </router-link>
      </div>

    </div>

    <!-- 錯誤 -->
    <div v-else>
      <p>{{ errorMessage}}</p>
      <router-link to="/news" class="btn-primary">
        回到新聞列表
      </router-link>
    </div>

  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPublishedNewsById } from '@/services/newsService';

const route = useRoute();  // 拿網址上的 id

const news = ref(null);
const loading = ref(false);
const errorMessage = ref('');

// 取得單筆新聞資料
const loadNews = async () => {
  loading.value = true;
  try {
    const id = route.params.id;  // 拿到網址上的 id
    const response = await fetchPublishedNewsById(id);
    news.value = response.data;
    if (!news.value || news.value.status !== 1) {  // 預防打到不是發佈的新聞
      errorMessage.value = '找不到這則新聞或尚未發布';
      news.value = null;
    }
  } catch (error) {
    console.error('載入單筆新聞失敗', error); //測試用
    errorMessage.value = '載入失敗，請稍後再試';
    news.value = null;
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.detail-thumbnail {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin: 20px 0;
  border-radius: 8px;
}

.news-content {
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap; /* 保留段落換行 */
}

.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
  background-color: #007bff;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>