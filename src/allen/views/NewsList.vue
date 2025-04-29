<template>
<div class="news-list">
    <h1>最新新聞列表</h1>

    <!-- 🔁 載入中顯示骨架畫面 -->
    <NewsListSkeleton v-if="loading" />

    <!-- ✅ 載入完畢顯示真正新聞 -->
    <div v-else>
      <div v-for="news in newsList" :key="news.newsId" class="news-item">
        
        <div class="news-item">
          <router-link :to="`/news/${news.newsId}`" class="news-link">
            <img :src="getFullImageUrl(news.thumbnail) || defaultThumbnail" alt="縮圖" class="thumbnail" @error="handleImgError"> <!-- 新聞縮圖 -->
            <h2>{{ news.title }}</h2> <!-- 新聞標題 -->
          </router-link>
        </div>

        <p>{{ news.summary }}</p>
        <small>發布日期：{{ formatDate(news.publishAt) }}</small>

      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="page === 0 || loading">上一頁</button> <!-- 上一頁按鈕 -->
        <span>第 {{ page + 1 }} 頁</span>
        <button @click="nextPage" :disabled="!hasNextPage || loading">下一頁</button> <!-- 下一頁按鈕 -->
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPublishedNews } from '@/services/newsService';
import noImage from '@/assets/no-image.jpg'; // ✅ 引入預設縮圖
import NewsListSkeleton from '@/allen/components/NewsListSkeleton.vue' //  Skeleton 骨架屏

// ✅ 引入處理 thumbnail 路徑的工具
import { getFullImageUrl } from '@/utils/urlHelper';

// 變數定義
const newsList = ref([]);
const page = ref(0);
const size = ref(5);
const loading = ref(false);
const hasNextPage = ref(true);
const defaultThumbnail = noImage; // 預設縮圖路徑

//處理圖片載入失敗(url錯誤)
const handleImgError = (event) => {
  if (event.target.src !== defaultThumbnail) {
    event.target.src = defaultThumbnail;
  }
};

// 取得新聞資料
const loadNews = async () => {
  loading.value = true;

  try {
    const response = await fetchPublishedNews(page.value, size.value);

    // 👇 等資料準備好後再換畫面
    setTimeout(() => {
      newsList.value = response.data.content;
      hasNextPage.value = !response.data.last;
      loading.value = false;
    }, 500); // 500ms只是模擬延遲，可以自己調整或拿掉
  } catch (error) {
    console.error('載入新聞失敗', error);
    loading.value = false; // 保險一點，避免 error 時卡住
  }
};

// 切換頁數
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

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// 頁面載入時就呼叫一次
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
</style>