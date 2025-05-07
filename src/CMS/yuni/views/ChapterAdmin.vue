<template>
    <div class="page-wrapper">
      <div class="card">
        <!-- ────────── 搜尋列 ────────── -->
        <div class="search-row">
          <input
            v-model="searchKeyword"
            @keyup.enter="searchChapters"
            placeholder="輸入關鍵字搜尋章節"
            class="search-input"
          />
          <button @click="searchChapters" class="btn btn-primary">搜尋</button>
          <!-- <button @click="fetchChapters" class="btn btn-secondary">全部章節</button> -->
          <button @click="resetFilters" class="btn btn-secondary">✕</button>

        </div>
  
        <!-- ────────── 章節表格 ────────── -->
        <div class="table-wrapper">
          <table class="course-table">
            <thead>
              <tr>
                <th class="col-idx">#</th>
                <th class="col-title">標題</th>
                <th>位置</th>
                <th>內容類型</th>
                <th>內容網址</th>
                <th>所屬課程 ID</th>
                <th class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="chapter in chapters"
                :key="chapter.chapterId"
                :class="{ 'row-hover': editingId !== chapter.chapterId }"
              >
                <!-- 編輯模式 -->
                <template v-if="editingId === chapter.chapterId">
                  <td>{{ chapter.chapterId }}</td>
                  <td><input v-model="editingChapter.title" class="input-edit" /></td>
                  <td><input v-model.number="editingChapter.position" type="number" class="input-edit" /></td>
                  <td>
                    <select v-model="editingChapter.contentType" class="input-edit">
                      <option disabled value="">選擇類型</option>
                      <option value="video">影片</option>
                      <option value="article">文章</option>
                    </select>
                  </td>
                  <td><input v-model="editingChapter.contentUrl" class="input-edit" /></td>
                  <td>
                    <input v-model.number="editingChapter.courseId" type="number" class="input-edit" placeholder="課程 ID" />
                  </td>
                  <td class="action-cell">
                    <button @click="saveChapter" class="link green">儲存</button>
                    <button @click="cancelEditChapter" class="link gray">取消</button>
                  </td>
                </template>
  
                <!-- 顯示模式 -->
                <template v-else>
                  <td>{{ chapter.chapterId }}</td>
                  <td>{{ chapter.title }}</td>
                  <td>{{ chapter.position }}</td>
                  <td>{{ getContentType(chapter.contentType) }}</td>
                  <td>
                    <a
                      :href="chapter.contentUrl"
                      target="_blank"
                      class="link-url"
                      v-if="chapter.contentUrl"
                    >
                      {{ truncateUrl(chapter.contentUrl) }}
                    </a>
                    <span v-else>-</span>
                  </td>
                  <td>{{ chapter.course?.courseId ?? '-' }}</td>
                  <td class="action-cell">
                    <button @click="startEditChapter(chapter)" class="link blue">編輯</button>
                    <button @click="deleteChapter(chapter.chapterId)" class="link red">刪除</button>
                  </td>
                </template>
              </tr>
  
              <!-- 新增模式 -->
              <tr v-if="isCreating" class="row-creating">
                <td>{{ chapters.length + 1 }}</td>
                <td><input v-model="editingChapter.title" class="input-create" placeholder="請輸入章節標題" /></td>
                <td><input v-model.number="editingChapter.position" type="number" class="input-create" placeholder="章節位置" /></td>
                <td>
                  <select v-model="editingChapter.contentType" class="input-create">
                    <option disabled value="">選擇類型</option>
                    <option value="video">影片</option>
                    <option value="article">文章</option>
                  </select>
                </td>
                <td><input v-model="editingChapter.contentUrl" class="input-create" placeholder="請輸入內容網址" /></td>
                <td>
                  <input v-model.number="editingChapter.courseId" type="number" class="input-create" placeholder="所屬課程 ID" />
                </td>
                <td class="action-cell">
                  <button @click="createChapter" class="link green">送出</button>
                  <button @click="cancelCreateChapter" class="link gray">取消</button>
                </td>
              </tr>
  
              <!-- 新增按鈕列 -->
              <tr v-else class="row-add" @click="startCreateChapter">
                <td colspan="7">➕ 新增章節</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/plugins/axios.js'
  
  const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL)
  const chapters = ref([])
  const searchKeyword = ref('')
  const editingId = ref(null)
  const isCreating = ref(false)
  
  const contentTypes = ['video', 'article']
  const getContentType = (key) => (key === 'video' ? '影片' : key === 'article' ? '文章' : key)
  
  const emptyChapter = () => ({
    chapterId: null,
    title: '',
    position: null,
    contentType: '',
    contentUrl: '',
    courseId: null,
  })
  const editingChapter = ref(emptyChapter())
  
  // ─── API ───────────────────────────────
  const fetchChapters = async () => {
    const { data } = await axios.get(`${apiBaseUrl.value}/api/chapters`)
    chapters.value = data
  }


 


// 清除關鍵字並重新載入全部課程
const resetFilters = async () => {
  searchKeyword.value = ''
  await fetchChapters()
} 
  
  const searchChapters = async () => {
    const { data } = await axios.get(`${apiBaseUrl.value}/api/chapters`, {
      params: { keyword: searchKeyword.value },
    })
    chapters.value = data
  }
  
  // ─── CRUD ───────────────────────────────
  const startEditChapter = (chapter) => {
    editingId.value = chapter.chapterId
    editingChapter.value = {
      ...chapter,
      courseId: chapter.courseId ?? chapter.course?.courseId ?? null,
    }
  }
  
  const cancelEditChapter = () => {
    editingId.value = null
    editingChapter.value = emptyChapter()
  }
  
  const saveChapter = async () => {
    const payload = {
      title: editingChapter.value.title,
      position: editingChapter.value.position,
      contentType: editingChapter.value.contentType,
      contentUrl: editingChapter.value.contentUrl,
      course: { courseId: editingChapter.value.courseId },
    }
  
    if (editingChapter.value.chapterId) {
      const { data } = await axios.put(
        `${apiBaseUrl.value}/api/chapters/admin/${editingChapter.value.chapterId}`,
        payload
      )
      const idx = chapters.value.findIndex((c) => c.chapterId === data.chapterId)
      if (idx !== -1) chapters.value[idx] = data
    } else {
      const { data } = await axios.post(`${apiBaseUrl.value}/api/chapters/admin`, payload)
      chapters.value.push(data)
    }
    cancelEditChapter()
    isCreating.value = false
  }
  
  const deleteChapter = async (id) => {
    if (confirm('確定要刪除此章節嗎？')) {
      await axios.delete(`${apiBaseUrl.value}/api/chapters/admin/${id}`)
      chapters.value = chapters.value.filter((c) => c.chapterId !== id)
    }
  }
  
  const startCreateChapter = () => {
    isCreating.value = true
    editingId.value = null
    editingChapter.value = emptyChapter()
  }
  
  const cancelCreateChapter = () => {
    isCreating.value = false
    editingChapter.value = emptyChapter()
  }
  
  const createChapter = saveChapter
  
  const truncateUrl = (url) => (url && url.length > 50 ? url.slice(0, 50) + '...' : url)
  
  onMounted(fetchChapters)
  </script>


<style scoped>
/* 樣式與 CourseAdmin.vue 相同，這裡省略以避免重複 */
/* ─── 版型 ─────────────────────────────── */
.page-wrapper {
  height: 100%;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: #f5f6fa;
}

.card {
  max-width: 1280px;
  margin: 10px 5px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .05);
}

/* ─── 搜尋列 ─────────────────────────────── */
.search-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.search-input {
  flex-grow: 1;
  min-width: 200px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background .2s;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #fff;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

/* ─── 表格 ─────────────────────────────── */
.table-wrapper {
  overflow-x: auto;
}

.course-table {
  width: 100%;
  border-collapse: collapse;
}

.course-table thead {
  background: #f3f4f6;
}

.course-table th,
.course-table td {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  text-align: left;
}

.row-hover:hover {
  background: #f9fafb;
}

.col-idx {
  width: 48px;
}

.col-title {
  width: 200px;
}

.col-action {
  width: 120px;
}

/* ─── 編輯 / 建立模式輸入 ───────────────── */
.input-edit,
.input-create {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

/* 建立行背景 */
.row-creating {
  background: #fef9c3;
}

/* 新增按鈕列 */
.row-add {
  background: #f9fafb;
  cursor: pointer;
  transition: background .2s;
  text-align: center;
}

.row-add:hover {
  background: #e0f2fe;
  text-decoration: underline;
}

/* ─── 小型文字連結按鈕 ──────────────────── */
.link {
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.link.blue {
  color: #2563eb;
}

.link.green {
  color: #16a34a;
}

.link.red {
  color: #dc2626;
}

.link.gray {
  color: #6b7280;
}

.link.blue:hover {
  color: #1d4ed8;
}

.link.green:hover {
  color: #15803d;
}

.link.red:hover {
  color: #b91c1c;
}

.link.gray:hover {
  color: #4b5563;
}

.action-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
  height: 55px; /* 調整 action cell 的高度以適應內容 */
}

td.action-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
}

.link-url {
  color: #007bff;
  text-decoration: none;
}

.link-url:hover {
  text-decoration: underline;
}
</style>