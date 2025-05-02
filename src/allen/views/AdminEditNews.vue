<template>
  <div class="max-w-3xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">
      📝 {{ isEditMode ? '編輯新聞' : '新增新聞' }}
    </h2>

    <form v-if="news.category" @submit.prevent="handleSubmit">
      <!-- 標題 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">標題</label>
        <input
          v-model="news.title"
          @input="isDirty = true"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <!-- 分類 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">分類</label>
        <select
          v-model="news.category.categoryId"
          @change="isDirty = true"
          class="w-full border p-2 rounded"
        >
          <option disabled value="">請選擇分類</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
        </select>
      </div>

      <!-- 縮圖上傳 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">縮圖</label>
        <input type="file" @change="handleFileChange" accept="image/*" />
        <div v-if="previewUrl" class="mt-2">
          <img :src="previewUrl" alt="預覽縮圖" class="h-32 object-cover rounded" />
        </div>
      </div>

      <!-- 內容 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">內容</label>
        <textarea
          v-model="news.content"
          @input="isDirty = true"
          class="w-full border p-2 rounded"
          rows="6"
        ></textarea>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex gap-2">
        <button type="submit" class="save">💾 儲存新聞</button>
        <button type="button" class="cancel" @click="handleBack">返回新聞列表</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import myAxios from '@/plugins/axios';

const route = useRoute();
const router = useRouter();
const newsId = route.params.id;
const isEditMode = !!newsId;

const news = ref({
  title: '',
  content: '',
  category: { categoryId: '' },
  thumbnail: ''
});

const categories = ref([]);
const previewUrl = ref(null);
const isDirty = ref(false);

// 取得分類清單
const fetchCategories = async () => {
  const res = await myAxios.get('/news/category');
  categories.value = res.data;
};

// 取得單筆新聞（編輯模式）
const fetchNews = async () => {
  try {
    const res = await myAxios.get(`/news/admin/${newsId}`);
    news.value = {
      title: res.data.title,
      content: res.data.content,
      thumbnail: res.data.thumbnail,
      category: res.data.category || { categoryId: '' }
    };
    // 讓預覽圖顯示完整網址（加上主機位址）
    previewUrl.value = `http://localhost:8082${res.data.thumbnail}`;
  } catch (error) {
    alert('載入新聞失敗，可能不存在該筆資料');
    router.push('/admin/news');
  }
};

// 處理圖片上傳
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await myAxios.post('/news/admin/upload-thumbnail', formData);
    news.value.thumbnail = res.data.path;       // ✅ 寫入相對路徑至資料庫
    previewUrl.value = res.data.url;            // ✅ 前端預覽用完整網址
    isDirty.value = true;
  } catch (err) {
    alert('圖片上傳失敗');
  }
};

// 儲存新聞
const handleSubmit = async () => {
  try {
    if (isEditMode) {
      await myAxios.put(`/news/admin/${newsId}`, news.value);
      alert('新聞已更新');
    } else {
      await myAxios.post('/news/admin', news.value);
      alert('新聞已新增');
    }
    isDirty.value = false;
    router.push('/admin/news');
  } catch (err) {
    alert('儲存失敗');
  }
};

// 返回列表前檢查是否有未儲存變更
const handleBack = async () => {
  if (isDirty.value) {
    const confirmed = confirm('您有尚未儲存的變更，是否要儲存後再離開？');
    if (confirmed) {
      await handleSubmit();
      return;
    }
  }
  router.push('/admin/news');
};

onMounted(() => {
  fetchCategories();
  if (isEditMode) fetchNews();
});
</script>

<style scoped>
label {
  margin-bottom: 4px;
}
button {
  @apply px-4 py-2 rounded border font-semibold transition;
}
button.save {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
button.cancel {
  @apply bg-gray-200 text-black hover:bg-gray-300;
}
</style>