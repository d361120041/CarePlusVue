<template>
  <div class="max-w-3xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">📝 {{ isEditMode ? '編輯新聞' : '新增新聞' }}</h2>

    <form v-if="news.category" @submit.prevent="handleSubmit">
      <!-- 標題 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">標題</label>
        <input v-model="news.title" type="text" class="w-full border p-2 rounded" placeholder="請輸入標題" />
      </div>

      <!-- 分類 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">分類</label>
        <select v-model="news.category.categoryId" class="w-full border p-2 rounded" @change="handleCategoryChange">
          <option disabled value="">請選擇分類</option>
          <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryId">
            {{ cat.categoryName }}
          </option>
          <option value="add">新增分類...</option>
        </select>

        <!-- 刪除分類按鈕 -->
        <button @click.prevent="handleDeleteCategory"  class="text-red-500 hover:text-red-700">
          🗑️
        </button>
      </div>
  

      <!-- 縮圖 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">圖片</label>
        <div class="flex items-center gap-4">
          <input type="file" @change="handleFileChange" accept="image/*" />
          <button type="button" class="btn-remove-image" @click="removeImage">不使用圖片</button>
        </div>
        <div class="mt-2 flex items-center gap-4">
          <img :src="previewUrl" alt="預覽縮圖" class="h-32 object-cover rounded" @error="handleImageError" />
        </div>
      </div>

      <!-- Quill 編輯器 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">內容</label>
        <QuillEditor
          ref="quillRef"
          v-model:content="news.content"
          contentType="html"
          theme="snow"
          @input="isDirty = true"
          style="height: 300px"
        />
      </div>

      <!-- 按鈕 -->
      <div class="flex gap-2">
        <button type="submit" class="save">💾 儲存新聞</button>
        <button type="button" class="cancel" @click="handleBack">返回新聞列表</button>
        <button type="button" class="preview" @click="handlePreview">預覽新聞</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import myAxios from '@/plugins/axios';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const newsId = route.params.id;
const isEditMode = !!newsId;

const news = ref({
  title: '',
  content: '',
  category: { categoryId: '' },
  thumbnail: '',
  status: 0 // 預設為 0 (草稿狀態)
});
const categories = ref([]);
const previewUrl = ref(defaultThumbnail);
const isDirty = ref(false);
const quillRef = ref(null);

//新增分類
const handleCategoryChange = async (e) => {
  const selectedValue = e.target.value;

  // 如果選擇的是 "新增分類"
  if (selectedValue === "add") {
    await addCategory();
    // 重設下拉選單
    news.value.category.categoryId = '';
  }
};

//刪除分類
const handleDeleteCategory = async () => {
  if (!news.value.category.categoryId) {
    Swal.fire({
      icon: 'warning',
      title: '請先選擇要刪除的分類！',
      confirmButtonText: '確定'
    });
    return;
  }

  const selectedCategory = categories.value.find(cat => cat.categoryId === news.value.category.categoryId);

  if (!selectedCategory) {
    Swal.fire({
      icon: 'warning',
      title: '無法找到選擇的分類！',
      confirmButtonText: '確定'
    });
    return;
  }

  const { isConfirmed } = await Swal.fire({
    title: `確定要刪除分類「${selectedCategory.categoryName}」嗎？`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  });

  if (isConfirmed) {
    try {
      const response = await myAxios.delete(`/news/category/${selectedCategory.categoryId}`);

      Swal.fire({
        icon: 'success',
        title: `分類「${selectedCategory.categoryName}」已刪除！`,
        confirmButtonText: '確定'
      });

      // 重新加載分類列表
      await fetchCategories();
      // 重置分類選擇
      news.value.category.categoryId = '';

    } catch (err) {
      console.error('刪除分類失敗：', err);

      const errorMessage = err.response?.data?.message || '刪除分類失敗，請稍後再試';

      Swal.fire({
        icon: 'error',
        title: errorMessage,
        confirmButtonText: '確定'
      });
    }
  }
};

const fetchCategories = async () => {
  try {
    const res = await myAxios.get('/news/category');
    categories.value = res.data;
  } catch (err) {
    console.error('載入分類失敗：', err);
  }
};

const addCategory = async () => {
  try {
    const { value: categoryName } = await Swal.fire({
      title: '新增分類',
      input: 'text',
      inputLabel: '輸入分類名稱',
      inputPlaceholder: '請輸入分類名稱',
      confirmButtonText: '新增',
      showCancelButton: true,
      cancelButtonText: '取消',
      inputValidator: (value) => {
        if (!value.trim()) {
          return '分類名稱不得為空！';
        }
      }
    });

    if (categoryName) {
      // 發送新增分類請求
      const res = await myAxios.post('/news/category', { categoryName: categoryName.trim() });

      // 提示成功訊息
      Swal.fire({
        icon: 'success',
        title: `分類「${res.data.categoryName}」新增成功！`,
        confirmButtonText: '確定'
      });

      // 重新加載分類列表
      await fetchCategories();
    }
  } catch (err) {
    console.error('新增分類失敗：', err);
    Swal.fire({
      icon: 'error',
      title: '新增分類失敗，請稍後再試',
      confirmButtonText: '確定'
    });
  }
};

const fetchNews = async () => {
  try {
    const res = await myAxios.get(`/news/admin/${newsId}`);
    news.value = res.data;

    const thumbnailPath = res.data.thumbnail;

     // 檢查是否為完整 URL 或相對路徑
    previewUrl.value = thumbnailPath 
      ? thumbnailPath.startsWith('http')
        ? thumbnailPath 
        : `http://localhost:8082${thumbnailPath}`
      : defaultThumbnail;

  } catch (error) {
    alert('載入新聞失敗，可能不存在該筆資料');
    router.push('/admin/news');
  }
};

//圖片相關控制
const defaultThumbnail = '/allen/no-image.jpg';
//刪除圖片
const removeImage = () => {
  news.value.thumbnail = '';  // 傳遞空字串給後端，表示清除圖片
  previewUrl.value = defaultThumbnail; // 前端顯示預設圖片
};


const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await myAxios.post('/news/admin/upload-thumbnail', formData);
    news.value.thumbnail = res.data.path;
    previewUrl.value = res.data.url;
    isDirty.value = true;
  } catch (err) {
    alert('圖片上傳失敗');
  }
};

const handleSubmit = async () => {
  try {
    // 驗證標題
    if (!news.value.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '標題不得為空！',
        confirmButtonText: '確定'
      });
      return;
    }
    
    // 驗證標題字數限制
    if (news.value.title.trim().length > 30) {
      Swal.fire({
        icon: 'warning',
        title: '標題不得超過30字！',
        confirmButtonText: '確定'
      });
      return;
    }

    // 驗證分類
    if (!news.value.category.categoryId) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇分類！',
        confirmButtonText: '確定'
      });
      return;
    }

    //驗證內容
    const cleanedContent = news.value.content
      .replace(/<[^>]*>/g, '')  // 移除 HTML 標籤
      .replace(/&nbsp;/g, '')   // 移除 HTML 空格符
      .trim();

    if (!cleanedContent) {
      Swal.fire({
        icon: 'warning',
        title: '內容不得為空！',
        confirmButtonText: '確定'
      });
      return;
    }

    // ✅ 確保 `status` 為 0 (草稿狀態)
    news.value.status = 0;

    // 如果沒有縮圖，設置為 defaultThumbnail
    news.value.thumbnail = news.value.thumbnail ? news.value.thumbnail : defaultThumbnail;

    // 儲存新聞
    if (isEditMode) {
      await myAxios.put(`/news/admin/${newsId}`, news.value);
    } else {
      await myAxios.post('/news/admin', news.value);
    }

    isDirty.value = false;

    // 儲存成功提示
    Swal.fire({
      icon: 'success',
      title: '儲存成功！',
      confirmButtonText: '確定'
    }).then(() => {
      router.push('/admin/news');
    });

  } catch (err) {
    console.error('儲存失敗：', err);
    Swal.fire({
      icon: 'error',
      title: '儲存失敗，請稍後再試',
      confirmButtonText: '確定'
    });
  }
};

// 圖片加載錯誤處理
const handleImageError = (event) => {
  event.target.src = defaultThumbnail;
};

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

const handlePreview = async () => {
  try {
    let updatedNewsId = newsId;

    if (isEditMode) {
      // 僅保存編輯內容，但不改變狀態
      await myAxios.put(`/news/admin/${newsId}`, news.value);
    } else {
      // 新增新聞，狀態保持為 0（未發布）
      const res = await myAxios.post('/news/admin', {
        ...news.value,
        status: 0
      });
      updatedNewsId = res.data.id;
    }

    // 跳轉到 AdminNewsPreview.vue 頁面
    router.push(`/admin/news/preview/${updatedNewsId}`);

  } catch (err) {
    console.error('預覽失敗：', err);
    alert('預覽失敗，請確認資料完整性');
  }
};

// ✅ 加入 tooltip 標籤
onMounted(() => {

  fetchCategories();
  
  if (isEditMode) {
    fetchNews();
  }

  nextTick(() => {
    const tooltipMap = {
      bold: '粗體',
      italic: '斜體',
      underline: '底線',
      link: '插入連結',
      image: '插入圖片',
      clean: '清除格式',
      'list-ordered': '編號列表',
      'list-bullet': '項目列表'
    };

    Object.keys(tooltipMap).forEach((key) => {
      const btn = document.querySelector(`.ql-${key}`);
      if (btn) btn.setAttribute('title', tooltipMap[key]);

      if (key === 'list-ordered') {
        const ordered = document.querySelector('.ql-list[value="ordered"]');
        if (ordered) ordered.setAttribute('title', tooltipMap[key]);
      }
      if (key === 'list-bullet') {
        const bullet = document.querySelector('.ql-list[value="bullet"]');
        if (bullet) bullet.setAttribute('title', tooltipMap[key]);
      }
    });
  });
});
</script>

<style scoped>
/* 容器置中 */
.max-w-3xl {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

input[type="file"] {
  margin-bottom: 1rem;
}

input[type="file"] + .mt-2 {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.QuillEditor {
  height: 300px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.flex {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
}

button.save {
  background-color: #3498db;
  color: #fff;
  border: none;
}

button.save:hover {
  background-color: #2980b9;
}

button.cancel {
  background-color: #bdc3c7;
  color: #333;
  border: none;
}

button.cancel:hover {
  background-color: #95a5a6;
}
button.preview {
  background-color: #2ecc71;  /* 綠色按鈕 */
  color: #fff;
  border: none;
}

button.preview:hover {
  background-color: #27ae60;
}
.btn-remove-image {
  background-color: #e74c3c;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-remove-image:hover {
  background-color: #c0392b;
}
</style>