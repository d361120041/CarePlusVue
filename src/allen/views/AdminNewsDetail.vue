<template>
  <div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="text-center py-8 text-gray-600">
      載入中...
    </div>

    <!-- 找不到資料 -->
    <div v-else-if="!news">
      <p class="text-red-500 text-center py-8">找不到該筆新聞或載入失敗。</p>
      <router-link to="/admin/news" class="btn-gray">返回新聞列表</router-link>
    </div>

    <!-- 正常渲染 -->
    <div v-else>
      <!-- 標題區 -->
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h1 class="text-3xl font-bold text-gray-800">{{ news.title }}</h1>
        <div class="flex gap-2">
          <button @click="goToEdit(news.newsId)" class="btn-blue">編輯</button>
          <button @click="confirmDelete(news.newsId)" class="btn-red">刪除</button>
          <button v-if="news.status === 0" @click="publishNews(news.newsId)" class="btn-green">發布</button>
          <button v-else @click="unpublishNews(news.newsId)" class="btn-yellow">下架</button>
          <router-link to="/admin/news" class="btn-gray">返回</router-link>
        </div>
      </div>

      <!-- 縮圖區塊 -->
      <div class="col-span-1 flex justify-center items-center bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <img
          :src="getFullImageUrl(news.thumbnail)"
          alt="新聞縮圖"
          class="thumbnail object-cover w-full h-56 rounded-lg"
          @error="handleImgError"
        />
      </div>

      <!-- 資訊區塊 -->
      <div class="bg-gray-100 p-4 rounded-lg shadow-inner mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 mb-2">📅 發布日期：{{ formatDate(news.publishAt) }}</p>
            <p class="text-sm text-gray-600 mb-2">👤 建立者：{{ news.createBy }}</p>
            <p class="text-sm text-gray-600 mb-2">🛠️ 最後修改：{{ news.modifyAt ? formatDate(news.modifyAt) : '尚未修改' }}</p>
            <p class="text-sm text-gray-600 mb-2">👤 編輯者：{{ news.modifyBy || '無' }}</p>
            <p class="text-sm text-gray-600 mb-2">📂 分類：{{ news.category?.categoryName || '未分類' }}</p>
          </div>
        </div>

        <div class="mt-4">
          <!-- 標籤區塊 -->
          <div class="text-sm text-gray-600 mb-2">
            🏷️ 標籤：
            <span v-if="news.tags && news.tags.length">
              <span v-for="(tag, index) in news.tags" :key="index" class="inline-block bg-gray-200 text-gray-700 px-2 py-1 mr-1 mb-1 rounded">
                {{ tag }}
              </span>
            </span>
            <span v-else class="text-gray-400">無標籤</span>
          </div>
        </div>

        <div class="mt-2">
          <p class="text-sm text-gray-600">👁️ 瀏覽次數：{{ news.viewCount || 0 }}</p>
        </div>
      </div>

      <!-- 內容區塊 -->
      <div class="bg-gray-50 p-4 rounded-lg shadow-inner">
        <h2 class="text-xl font-semibold mb-4">內容：</h2>
        <div class="news-content whitespace-pre-wrap text-gray-700">
          {{ news.content }}
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Swal from 'sweetalert2';
  import myAxios from '@/plugins/axios';

  const route = useRoute();
  const router = useRouter();
  const news = ref(null);
  const loading = ref(false);
  const errorMessage = ref('');
  
  import { getFullImageUrl } from '@/allen/utils/urlHelper';
  const handleImgError = (event) => {
    event.target.src = '/src/assets/allen/no-image.jpg';
  };

  const loadNews = async () => {
    loading.value = true;
    try {
      const id = route.params.id;
      const res = await myAxios.get(`/news/admin/${id}`);
      news.value = res.data;
    } catch (err) {
      console.error('載入失敗', err);
      errorMessage.value = '找不到該筆新聞或載入失敗';
    } finally {
      loading.value = false;
    }
  };
  
  const goToEdit = (id) => {
    router.push(`/admin/news/edit/${id}`);
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
        router.push('/admin/news');
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
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  onMounted(() => {
    loadNews();
  });
  </script>
  
  <style scoped>
  .max-w-4xl {
    max-width: 1100px;
  }
  
  .thumbnail-container {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .thumbnail {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
  
  .news-content {
    background-color: #fafafa;
    padding: 1rem;
    border-radius: 6px;
    box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.1);
    line-height: 1.6;
  }
  
  .btn-blue {
    background-color: #3498db;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .btn-blue:hover {
    background-color: #2980b9;
  }
  
  .btn-red {
    background-color: #e74c3c;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .btn-red:hover {
    background-color: #c0392b;
  }
  
  .btn-green {
    background-color: #2ecc71;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .btn-green:hover {
    background-color: #27ae60;
  }
  
  .btn-yellow {
    background-color: #f1c40f;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .btn-yellow:hover {
    background-color: #f39c12;
  }
  
  .btn-gray {
    background-color: #95a5a6;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .btn-gray:hover {
    background-color: #7f8c8d;
  }
  </style>