<template>
  <div class="page-wrapper">
    <!-- ────────── 白色卡片 ────────── -->
    <div class="card">

      <!-- ────────── 搜尋列 ────────── -->
      <div class="search-row">
        <input v-model.trim="searchKeyword" placeholder="輸入關鍵字搜尋" class="search-input" />
        <!-- 這顆只讓使用者點擊後失去焦點，不再呼叫 API -->
        <button class="btn btn-primary" @click="$event.target.blur()">搜尋</button>
        <button class="btn btn-secondary" @click="resetFilters">✕</button>
 
        <div class="add-button-wrapper">
  <button class="btn btn-add" style="border: solid 1px;" @click="startCreate">
    <span class="icon">➕</span> 新增課程
  </button>
</div>

      <div class="table-wrapper">
      <table class="course-table">
        <thead>
          <!-- 新增模式 -->
          <tr v-if="isCreating" class="row-creating">
              <td>{{ filteredCourses.length + 1 }}</td>
              <!-- <td>{{ (currentPage - 1) * pageSize + paginatedCourses.length + 1 }}</td> -->

              <td><input type="file" @change="handleFileUpload" /></td>
              <td><input v-model="editingCourse.title" class="input-create" placeholder="請輸入標題" /></td>
              <td><input v-model="editingCourse.description" class="input-create" placeholder="請輸入介紹" /></td>
              <td>
                <select v-model="editingCourse.category" class="input-create">
                  <option disabled value="">請選擇分類</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ getCategoryLabel(cat) }}
                  </option>
                </select>
              </td>
              <td><input v-model="editingCourse.duration" type="number" class="input-create" placeholder="時數" /></td>
              <td class="action-cell">
                <button @click="create" class="link green">送出</button>
                <button @click="cancelCreate" class="link gray">取消</button>
              </td>
            </tr>

            <!-- 新增按鈕列（只有沒在搜尋且非新增模式才顯示）
            <tr v-if="!isCreating && !searchKeyword" class="row-add" @click="startCreate">
              <td style="text-align: center;" colspan="7">➕ 新增課程</td>
            </tr> -->
        </thead>
      </table>
      </div>
    </div>
      <!-- ────────── 課程表格 ────────── -->
      <div class="table-wrapper">
        <table class="course-table">
          <thead>
            <tr>
              <th class="col-idx">#</th>
              <th class="col-cover">封面</th>
              <th class="col-title">標題</th>
              <th>介紹</th>
              <th class="col-cat">分類</th>
              <th class="col-duration">時數</th>
              <th class="col-action">操作</th>
            </tr>
          </thead>

          <!-- ── 有資料 ── -->
          <tbody v-if="filteredCourses.length">
            <tr v-for="course in paginatedCourses" :key="course.courseId"
              :class="{ 'row-hover': editingId !== course.courseId }">
              <!-- 編輯模式 -->
              <template v-if="editingId === course.courseId">
                <td>{{ course.courseId }}</td>
                <td>
                  <img :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`" class="cover-img" />
                </td>
                <td><input v-model="editingCourse.title" class="input-edit" /></td>
                <td><input v-model="editingCourse.description" class="input-edit" /></td>
                <td>
                  <select v-model="editingCourse.category" class="input-edit">
                    <option disabled value="">請選擇分類</option>
                    <option v-for="cat in categories" :key="cat" :value="cat">
                      {{ getCategoryLabel(cat) }}
                    </option>
                  </select>
                </td>
                <td>
                  <input v-model="editingCourse.duration" type="number" class="input-edit" placeholder="時數" />
                </td>
                <td class="action-cell">
                  <button @click="save" class="link green">儲存</button>
                  <button @click="cancelEdit" class="link gray">取消</button>
                </td>
              </template>

              <!-- 顯示模式 -->
              <template v-else>
                <td>{{ course.courseId }}</td>
                <td>
                  <!-- <router-link :to="`/courses/${course.courseId}`">
                    <img
                      :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                      class="cover-img"
                      style="cursor:pointer"
                    />
                  </router-link> -->
                  <!-- 封面圖片連結（開新分頁） -->
                  <a :href="`/courses/${course.courseId}`" target="_blank" rel="noopener noreferrer">
                    <img :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`" class="cover-img"
                      style="cursor: pointer" />
                  </a>

                </td>
                <td>
                  <!-- <router-link
                    :to="`/courses/${course.courseId}`"
                    class="link-title"
                  >
                    {{ course.title }}
                  </router-link> -->
                  <!-- 標題連結（開新分頁） -->
                  <a :href="`/courses/${course.courseId}`" class="link-title" target="_blank" rel="noopener noreferrer">
                    {{ course.title }}
                  </a>
                </td>
                <td>{{ course.description }}</td>
                <td class="text-cat">#{{ getCategoryLabel(course.category) }}</td>
                <td>{{ formatDuration(course.duration) }}</td>
                <td class="action-cell">
                  <button @click="startEdit(course)" class="link blue">編輯</button>
                  <button @click="deleteOne(course.courseId)" class="link red">刪除</button>
                </td>
              </template>
            </tr>

            
          </tbody>

          <!-- ── 查無資料 ── -->
          <tbody v-else>
            <tr>
              <td colspan="7" class="text-center py-4 text-muted">
                查無課程資料。
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 分頁控制列 -->
<!-- <div class="pagination">
  <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">« 上一頁</button>
  <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
  <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">下一頁 »</button>
</div> -->


<div class="pagination">
  <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">«</button>
  
  <button
    v-for="page in totalPages"
    :key="page"
    :class="{ 'active-page': page === currentPage }"
    @click="goToPage(page)">
    {{ page }}
  </button>

  <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">»</button>
</div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from '@/plugins/axios.js'
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '@/CMS/yuni/api/courseApi'

/* ---------- 公用 ---------- */
const formatDuration = v => (v ? `${String(v).replace(/[^\d]/g, '')}小時` : '')
const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL)

/* ---------- 資料 ---------- */
const courses = ref([])
const searchKeyword = ref('')
const editingId = ref(null)
const isCreating = ref(false)
const selectedImage = ref(null)

const emptyCourse = () => ({
  title: '', category: '', description: '', duration: '', price: 0, isProgressLimited: false
})
const editingCourse = ref(emptyCourse())

/* ---------- 分類 ---------- */
const categories = [
  'daily_care', 'dementia', 'nutrition', 'psychology',
  'assistive', 'resource', 'endoflife', 'skills', 'selfcare'
]
const getCategoryLabel = k => ({
  daily_care: '日常照護', dementia: '失智照護', nutrition: '營養保健', psychology: '心理支持',
  assistive: '輔具協助', resource: '資源導覽', endoflife: '臨終關懷',
  skills: '技能訓練', selfcare: '自主健康'
})[k] || k

/* ---------- 取得 / 過濾課程 ---------- */
// const fetchCourses = async () => {
//   const { data } = await getAllCourses()
//   courses.value = data
// }

const fetchCourses = async () => {
  const { data } = await getAllCourses()
  courses.value = data

  // 如果目前頁碼 > 總頁數，則自動退回到最後一頁或第 1 頁
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value || 1
  }
}
const filteredCourses = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return courses.value
  return courses.value.filter(c =>
    c.title.toLowerCase().includes(kw) ||
    c.description.toLowerCase().includes(kw)
  )
})

/* ---------- 圖片 ---------- */
const handleFileUpload = e => { selectedImage.value = e.target.files[0] }

/* ---------- CRUD ---------- */
const startEdit = c => { editingId.value = c.courseId; editingCourse.value = { ...c } }
const cancelEdit = () => { editingId.value = null; editingCourse.value = emptyCourse() }

const toNumber = v => (v === '' || v == null ? null : Number(v))
const save = async () => {
  const payload = { ...editingCourse.value, duration: toNumber(editingCourse.value.duration) }
  editingCourse.value.courseId
    ? await updateCourse(editingCourse.value.courseId, payload)
    : await createCourse(payload)
  await fetchCourses()
  cancelEdit()
}

const deleteOne = async id => {
  if (confirm('確定要刪除嗎？')) {
    await deleteCourse(id)
    await fetchCourses()
  }
}

/* ---------- 新增 ---------- */
// const startCreate = () => { isCreating.value = true; editingCourse.value = emptyCourse() }

import Swal from 'sweetalert2'

const startCreate = async () => {
  const { value: formValues } = await Swal.fire({
  title: '新增課程',
  html: `
    <input id="swal-title" class="swal2-input" placeholder="標題">
    <textarea id="swal-desc" class="swal2-textarea" placeholder="介紹"></textarea>
    <input id="swal-duration" type="number" class="swal2-input" placeholder="時數">
    <select id="swal-category" class="swal2-select">
      ${categories.map(c => `<option value="${c}">${getCategoryLabel(c)}</option>`).join('')}
    </select>
    <div class="swal2-file-wrapper">
      <label class="file-label">
        上傳圖片
        <input id="swal-image" type="file" class="swal2-file" />
      </label>
      <span id="file-name" class="file-name"></span>
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: '送出',
  focusConfirm: false,
  didOpen: () => {
    const imageInput = Swal.getPopup().querySelector('#swal-image')
    const fileNameSpan = Swal.getPopup().querySelector('#file-name')

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0]
      fileNameSpan.textContent = file ? file.name : '尚未選擇檔案'
    })
  },
  preConfirm: () => {
    const title = document.getElementById('swal-title').value
    const description = document.getElementById('swal-desc').value
    const duration = Number(document.getElementById('swal-duration').value)
    const category = document.getElementById('swal-category').value
    const image = document.getElementById('swal-image').files[0]

    if (!title || !description || !duration || !category) {
      Swal.showValidationMessage('請填寫所有欄位')
      return
    }

    return { title, description, duration, category, image }
  }
})


  if (formValues) {
    const payload = {
      title: formValues.title,
      description: formValues.description,
      duration: formValues.duration,
      category: formValues.category,
      price: 0,
      isProgressLimited: false
    }

    const formData = new FormData()
    formData.append('course', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    if (formValues.image) formData.append('image', formValues.image)

    // try {
    //   await axios.post(`${apiBaseUrl.value}/api/courses/admin`, formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   })
    //   await fetchCourses()
    //   Swal.fire('新增成功', '', 'success')
    // } catch (err) {
    //   Swal.fire('新增失敗', err?.response?.data || err.message, 'error')
    // }
    try {
  await axios.post(`${apiBaseUrl.value}/api/courses/admin`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  await fetchCourses()
  currentPage.value = totalPages.value
  // Swal.fire('新增成功', '', 'success')

  nextTick(() => {
    const lastRow = document.querySelector('tbody tr:last-child')
    if (lastRow) {
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  })
} catch (err) {
  Swal.fire('新增失敗', err?.response?.data || err.message, 'error')
}
  }
}



const cancelCreate = () => { isCreating.value = false; editingCourse.value = emptyCourse(); selectedImage.value = null }
const create = async () => {
  const payload = { ...editingCourse.value, duration: toNumber(editingCourse.value.duration) }
  const formData = new FormData()
  formData.append('course', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (selectedImage.value) formData.append('image', selectedImage.value)
  await axios.post(`${apiBaseUrl.value}/api/courses/admin`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  await fetchCourses()
  cancelCreate()
}


/* ---------- 分頁 ---------- */
const pageSize = 10
const currentPage = ref(1)

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredCourses.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / pageSize))

const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}


/* ---------- 其他 ---------- */
const resetFilters = () => { searchKeyword.value = '' }   // 清空即可，computed 會自動回全列表

onMounted(fetchCourses)

watch(filteredCourses, () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* ---------- 版型 ---------- */
.page-wrapper {
  height: 100%;
  padding: 24px;
  background: #f5f6fa
}

.card {
  max-width: 1570px;
  margin: auto;
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .05)
}

.search-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px
}

.search-input {
  flex-grow: 1;
  min-width: 200px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px
}

/* ---------- 按鈕 ---------- */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background .2s
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none
}

.btn-primary:hover {
  background: #1d4ed8
}

.btn-secondary {
  background: #dc2626;
  border: 1px solid #d1d5db
}

.btn-secondary:hover {
  background: #f3f4f6
}

/* ---------- 表格 ---------- */
.table-wrapper {
  overflow-x: auto
}

.course-table {
  width: 100%;
  border-collapse: collapse
}

.course-table thead {
  background: #f3f4f6
}

.course-table th,
.course-table td {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  text-align: left
}

.row-hover:hover {
  background: #f9fafb
}

.col-idx {
  width: 40px
}

.col-cover {
  width: 90px
}

.col-title {
  width: 250px
}

.col-cat {
  width: 120px
}

.col-duration {
  width: 80px
}

.col-action {
  width: 110px
}

/* ---------- 其他 ---------- */
.cover-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #d1d5db
}

.input-edit,
.input-create {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px
}

.row-creating {
  background: #fef9c3
}

.row-add {
  background: #f9fafb;
  cursor: pointer;
  text-align: center;
  transition: background .2s
}

.row-add:hover {
  background: #e0f2fe;
  text-decoration: none
}

.link {
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0
}

.link.blue {
  color: #2563eb
}

.link.blue:hover {
  color: #1d4ed8
}

.link.green {
  color: #16a34a
}

.link.green:hover {
  color: #15803d
}

.link.red {
  color: #dc2626
}

.link.red:hover {
  color: #b91c1c
}

.link.gray {
  color: #6b7280
}

.link.gray:hover {
  color: #4b5563
}

.action-cell {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  height: 105px
}

.text-cat {
  color: #64748b
}

.link-title {
  color: #111827;
  text-decoration: none
}

.link-title:hover {
  font-weight: 500
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.pagination button {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* .swal2-select, .swal2-file, .swal2-textarea {
  width: 100%;
  font-size: 15px;
  padding: 8px;
  margin: 4px 0;
} */

/* SweetAlert2 表單統一寬度與字體大小 */
/* .swal2-input,
.swal2-textarea,
.swal2-select,
.swal2-file {
  width: 100% !important;
  max-width: 100% !important;
  font-size: 14px;
  box-sizing: border-box;
  margin: 6px 0;
}

.swal2-popup {
  width: 480px !important;
} */.swal2-popup {
  width: 480px !important;
}

.swal2-input,
.swal2-textarea,
.swal2-select {
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
  margin: 6px 0;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.swal2-file-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  margin: 6px 0;
}

.file-label {
  display: inline-block;
  background-color: #2563eb;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

.file-label:hover {
  background-color: #1d4ed8;
}

.swal2-file {
  display: none;
}

.file-name {
  flex-grow: 1;
  font-size: 14px;
  color: #555;
}



</style>
