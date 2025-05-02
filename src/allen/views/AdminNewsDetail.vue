<template>
    <div class="max-w-3xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">後台新聞詳細內容</h1>
  
      <div v-if="loading">載入中...</div>
  
      <div v-else-if="news">
        <h2 class="text-xl font-semibold mb-2">{{ news.title }}</h2>
        <p class="text-sm text-gray-600 mb-1">發布日期：{{ formatDate(news.publishAt) }}</p>
        <p class="text-sm text-gray-600 mb-1">分類：{{ news.category?.categoryName }}</p>
        <p class="text-sm text-gray-600 mb-1">狀態：{{ news.status === 1 ? '已發布' : '草稿' }}</p>
        <p class="text-sm text-gray-600 mb-1">建立者：{{ news.createBy }}</p>
        <p class="text-sm text-gray-600 mb-1">建立時間：{{ formatDate(news.createAt) }}</p>
        <p class="text-sm text-gray-600 mb-1">👁️ 瀏覽次數：{{ news.viewCount || 0 }}</p>
  
        <div class="mt-4 whitespace-pre-wrap">{{ news.content }}</div>
  
        <div class="flex flex-wrap gap-2 mt-6">
          <button @click="goToEdit(news.newsId)" class="btn-blue">
            <font-awesome-icon icon="fa-solid fa-pen" />
            <span>編輯</span>
          </button>
          <button @click="confirmDelete(news.newsId)" class="btn-red">
            <font-awesome-icon icon="fa-solid fa-trash" />
            <span>刪除</span>
          </button>
          <button v-if="news.status === 0" @click="publishNews(news.newsId)" class="btn-green">
            <font-awesome-icon icon="fa-solid fa-bullhorn" />
            <span>發布</span>
          </button>
          <button v-else @click="unpublishNews(news.newsId)" class="btn-yellow">
            <font-awesome-icon icon="fa-solid fa-box-archive" />
            <span>下架</span>
          </button>
          <router-link to="/admin/news" class="btn-gray">
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
            <span>返回</span>
          </router-link>
        </div>
      </div>
  
      <div v-else>
        <p class="text-red-500">{{ errorMessage }}</p>
        <router-link to="/admin/news" class="text-blue-600 hover:underline">回到新聞列表</router-link>
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
button {
margin: 0 8px;
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
.btn-gray {
@apply bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 flex items-center gap-2 shadow-sm;
}
</style>