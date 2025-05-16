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
import defaultThumbnail from '@/assets/allen/no-image.jpg';
import { getFullImageUrl } from '@/allen/utils/urlHelper.js';
import { useRoute, useRouter } from 'vue-router';
import myAxios from '@/plugins/axios';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const newsId = route.params.id;
const isEditMode = !!newsId;

const uploadedFile = ref(null); // 用於儲存上傳的檔案

const news = ref({
  title: '',
  content: '',
  category: { categoryId: '' },
  thumbnail: '',
  status: 0 // 預設為 0 (草稿狀態)
});

const categories = ref([]);
const isDirty = ref(false);
const quillRef = ref(null);

//-----------------圖片start

// ✅ 圖片加載錯誤處理
const handleImageError = (event) => {
  event.target.src = defaultThumbnail;
};

// ✅ 圖片上傳處理
const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    uploadedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    news.value.thumbnail = '';  // 當上傳新圖片時，不保留後端路徑
  } else {
    removeImage();
  }
};

// ✅ 移除圖片
const removeImage = () => {
  uploadedFile.value = null;
  previewUrl.value = defaultThumbnail; // 使用靜態資源的預設圖片
  news.value.thumbnail = '';           // 後端數據清空
};

//-----------------圖片end



//-----------------分類start

//分類更新後，下拉式選單更新
const handleCategoryChange = async (e) => {
  const selectedValue = e.target.value;

  if (selectedValue === "add") {
    const newCategoryId = await addCategory();
    
    // 新增完成後自動選中新增的分類
    if (newCategoryId) {
      news.value.category.categoryId = newCategoryId;
    }
  }
};

//刪除分類
const handleDeleteCategory = async () => {
  const selectedCategoryId = news.value.category.categoryId;

  if (!selectedCategoryId) {
    Swal.fire({
      icon: 'warning',
      title: '請先選擇要刪除的分類！',
      confirmButtonText: '確定'
    });
    return;
  }

  const selectedCategory = categories.value.find(cat => cat.categoryId === selectedCategoryId);

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
      await myAxios.delete(`/news/category/${selectedCategoryId}`);

      Swal.fire({
        icon: 'success',
        title: `分類「${selectedCategory.categoryName}」已刪除！`,
        confirmButtonText: '確定'
      });

      await fetchCategories();

      // 若當前選中的分類為被刪除的分類，重置為空
      if (news.value.category.categoryId === selectedCategoryId) {
        news.value.category.categoryId = '';
      }

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

//loading 狀態標誌，用於控制加載狀態
const isLoadingCategories = ref(false);

//獲取新聞分類
const fetchCategories = async () => {
  isLoadingCategories.value = true;

  try {
    const res = await myAxios.get('/news/category');
    categories.value = res.data;
  } catch (err) {
    console.error('載入分類失敗：', err);

    Swal.fire({
      icon: 'error',
      title: '載入分類失敗，請稍後再試',
      confirmButtonText: '確定'
    });
  } finally {
    isLoadingCategories.value = false;
  }
};

//新增分類按鈕
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
      const res = await myAxios.post('/news/category', { categoryName: categoryName.trim() });

      Swal.fire({
        icon: 'success',
        title: `分類「${res.data.categoryName}」新增成功！`,
        confirmButtonText: '確定'
      });

      await fetchCategories();

      // 返回新增的分類 ID，供 `handleCategoryChange` 使用
      return res.data.categoryId;
    }
  } catch (err) {
    console.error('新增分類失敗：', err);

    Swal.fire({
      icon: 'error',
      title: '新增分類失敗，請稍後再試',
      confirmButtonText: '確定'
    });
  }

  return null; // 若取消或新增失敗，返回 null
};

//-------------------------分類end



//-------------------------新聞start

// ✅ 獲取新聞詳情（編輯模式）
// ✅ 獲取新聞詳情（編輯模式）
const fetchNews = async () => {
  try {
    const res = await myAxios.get(`/news/admin/${newsId}`);
    news.value = res.data;

    // 縮圖處理邏輯統一
    previewUrl.value = getFullImageUrl(news.value.thumbnail);

  } catch (error) {
    console.error('載入新聞失敗：', error);

    Swal.fire({
      icon: 'error',
      title: '載入新聞失敗！',
      text: error.response?.data?.message || '該新聞不存在或已被刪除',
      confirmButtonText: '確定'
    }).then(() => {
      router.push('/admin/news');
    });
  }
};

// ✅ 驗證新聞內容
const validateNews = () => {
  const { title, category, content } = news.value;

  if (!title.trim()) {
    Swal.fire({ icon: 'warning', title: '標題不得為空', confirmButtonText: '確定' });
    return false;
  }

  if (title.trim().length > 30) {
    Swal.fire({ icon: 'warning', title: '標題不得超過 30 字', confirmButtonText: '確定' });
    return false;
  }

  if (!category.categoryId) {
    Swal.fire({ icon: 'warning', title: '請選擇分類', confirmButtonText: '確定' });
    return false;
  }

  const cleanedContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, '')
    .trim();

  if (!cleanedContent) {
    Swal.fire({ icon: 'warning', title: '內容不得為空', confirmButtonText: '確定' });
    return false;
  }

  return true;
};

// ✅ 提交新聞
const handleSubmit = async () => {
  try {
    if (!validateNews()) return;

    // 確保 `status` 為 0 (草稿狀態)
    news.value.status = 0;

    // 縮圖處理：若無縮圖，設置為空，避免存儲 NO_IMAGE_URL
    news.value.thumbnail = news.value.thumbnail || '';

    if (isEditMode) {
      await myAxios.put(`/news/admin/${newsId}`, news.value);
    } else {
      await myAxios.post('/news/admin', news.value);
    }

    Swal.fire({
      icon: 'success',
      title: '儲存成功！',
      confirmButtonText: '確定'
    }).then(() => {
      router.push('/admin/news');
    });

  } catch (err) {
    console.error('儲存失敗：', err);

    const errorMessage = err.response?.data?.message || '儲存失敗，請稍後再試';

    Swal.fire({
      icon: 'error',
      title: errorMessage,
      confirmButtonText: '確定'
    });

  } finally {
    isDirty.value = false; // 重置編輯狀態
  }
};

//------------------------------新聞end



//-------------------------------其他功能start

// ✅ 通用保存方法
const saveNews = async (status = 0) => {
  try {
    news.value.status = status;  // 設置狀態 (0 = 草稿, 1 = 發布)

    if (!validateNews()) return null;

    let savedNewsId = newsId;

    if (isEditMode) {
      await myAxios.put(`/news/admin/${newsId}`, news.value);
    } else {
      const res = await myAxios.post('/news/admin', news.value);
      savedNewsId = res.data.id;
    }

    return savedNewsId;

  } catch (err) {
    console.error('保存新聞失敗：', err);
    Swal.fire({
      icon: 'error',
      title: '保存失敗，請稍後再試',
      text: err.response?.data?.message || '系統錯誤，請稍後重試',
      confirmButtonText: '確定'
    });
    return null;
  }
};

// ✅ 返回按鈕
const handleBack = async () => {
  if (isDirty.value) {
    const { isConfirmed } = await Swal.fire({
      title: '您有尚未儲存的變更',
      text: '是否要儲存後再離開？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '儲存並返回',
      cancelButtonText: '直接返回',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (isConfirmed) {
      const savedNewsId = await saveNews();
      if (savedNewsId) {
        router.push('/admin/news');
      }
      return;
    }
  }

  router.push('/admin/news');
};

// ✅ 新聞預覽
const handlePreview = async () => {
  try {
    const savedNewsId = await saveNews(0);  // 保持草稿狀態

    if (savedNewsId) {
      // 跳轉到 AdminNewsPreview.vue 頁面
      router.push(`/admin/news/preview/${savedNewsId}`);
    }

  } catch (err) {
    console.error('預覽失敗：', err);

    Swal.fire({
      icon: 'error',
      title: '預覽失敗',
      text: err.response?.data?.message || '請確認資料完整性',
      confirmButtonText: '確定'
    });
  }
};

// ✅ Tooltip 初始化方法
const initializeTooltips = () => {
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

  Object.entries(tooltipMap).forEach(([key, label]) => {
    // 針對常規按鈕
    const btn = document.querySelector(`.ql-${key}`);
    if (btn) btn.setAttribute('title', label);

    // 特殊處理：`list-ordered` 與 `list-bullet`
    if (key === 'list-ordered' || key === 'list-bullet') {
      const listBtn = document.querySelector(`.ql-list[value="${key.split('-')[1]}"]`);
      if (listBtn) listBtn.setAttribute('title', label);
    }
  });
};

const previewUrl = ref(defaultThumbnail); // 初始化為預設圖片

onMounted(() => {
  fetchCategories();

  if (isEditMode) {
    fetchNews();
  } else {
    previewUrl.value = news.value.thumbnail ? getFullImageUrl(news.value.thumbnail) : defaultThumbnail;
  }

  // 確保 Quill DOM 結構完全加載後再初始化 Tooltips
  nextTick(() => {
    setTimeout(() => {
      initializeTooltips();
    }, 100); // 適當延遲，防止 DOM 尚未完全加載
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