<template>
  <div class="page-wrapper">
    <div class="card">
      <div class="search-row">
        <input v-model.trim="searchKeyword" placeholder="輸入關鍵字搜尋" class="search-input" />
        <button class="btn btn-primary" @click="$event.target.blur()">搜尋</button>
        <button class="btn btn-secondary" @click="resetFilters">✕</button>
        <div class="add-button-wrapper">
          <!-- <button class="btn btn-add" style="border: solid 1px;" @click="startCreate">新增課程</button> -->
          <!-- 新增課程 -->

          <button class="btn btn-add" style="border:1px solid black;" @click="showModal = true">新增課程</button>
          <div class="modal fade" :class="{ show: showModal }" style="display: block;" v-if="showModal">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">新增課程</h5>
                  <button type="button" class="btn-close" @click="showModal = false"></button>
                </div>
                <div class="modal-body">
                  <input v-model="popupCourse.title" class="form-control mb-2" placeholder="標題" />
                  <textarea v-model="popupCourse.description" class="form-control mb-2" placeholder="介紹"></textarea>
                  <input v-model.number="popupCourse.duration" type="number" class="form-control mb-2" placeholder="時數"
                    min="1" step="1" @input="validateDuration" />
                  <select v-model="popupCourse.category" class="form-select mb-2">
                    <option disabled value="">請選擇分類</option>
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ getCategoryLabel(cat) }}</option>
                  </select>
                  <input type="file" @change="e => popupCourse.image = e.target.files[0]" class="form-control mb-2" />
                </div>
                <div class="modal-footer">
                  <button class="btn btn-secondary" @click="showModal = false">取消</button>
                  <button class="btn btn-primary" @click="submitCreateCourse">送出</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-backdrop fade show" v-if="showModal"></div>
        </div>
      </div>

      <div class="table-wrapper" v-if="isLoading">
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
          <tbody>
            <tr v-for="n in 5" :key="n">
              <td>
                <div class="skeleton-box shimmer" style="width: 24px; height: 16px;"></div>
              </td>
              <td>
                <div class="skeleton-box shimmer cover-img"></div>
              </td>
              <td>
                <div class="skeleton-box shimmer" style="width: 120px; height: 20px;"></div>
              </td>
              <td>
                <div class="skeleton-box shimmer" style="width: 180px; height: 20px;"></div>
              </td>
              <td>
                <div class="skeleton-box shimmer" style="width: 80px; height: 20px;"></div>
              </td>
              <td>
                <div class="skeleton-box shimmer" style="width: 40px; height: 20px;"></div>
              </td>
              <td>
                <div class="skeleton-box shimmer" style="width: 60px; height: 20px;"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

          <tbody v-if="filteredCourses.length">
            <tr v-for="course in paginatedCourses" :key="course.courseId"
              :class="{ 'row-hover': editingId !== course.courseId }">
              <!-- 編輯 -->
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

              <!-- 顯示 -->
              <template v-else>
                <td>{{ course.courseId }}</td>
                <td>
                  <a :href="`/courses/${course.courseId}`" target="_blank" rel="noopener noreferrer">
                    <img :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`" class="cover-img"
                      style="cursor: pointer" />
                  </a>
                </td>
                <td>
                  <a :href="`/courses/${course.courseId}`" class="link-title" target="_blank" rel="noopener noreferrer">
                    {{ course.title }}
                  </a>
                </td>
                <td>{{ course.description }}</td>
                <td class="text-cat">#{{ getCategoryLabel(course.category) }}</td>
                <td>{{ formatDuration(course.duration) }}</td>
                <td class="action-cell">
                  <button @click="startEdit(course)" class="link blue">編輯</button>
                  <button @click="deleteOne(course.courseId)" class="link red">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </template>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="7" class="text-center py-4 text-muted">查無課程資料。</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">«</button>
          <button v-for="page in totalPages" :key="page" :class="{ 'active-page': page === currentPage }"
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

import Swal from 'sweetalert2'

const formatDuration = v => (v ? `${String(v).replace(/[^\d]/g, '')}小時` : '')
const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL)

const courses = ref([])
const searchKeyword = ref('')
const editingId = ref(null)
const isCreating = ref(false)
const selectedImage = ref(null)

const isLoading = ref(true)

const emptyCourse = () => ({
  title: '', category: '', description: '', duration: '', price: 0, isProgressLimited: false
})
const editingCourse = ref(emptyCourse())

const categories = [
  'daily_care', 'dementia', 'nutrition', 'psychology',
  'assistive', 'resource', 'endoflife', 'skills', 'selfcare'
]
const getCategoryLabel = k => ({
  daily_care: '日常照護', dementia: '失智照護', nutrition: '營養保健', psychology: '心理支持',
  assistive: '輔具協助', resource: '資源導覽', endoflife: '臨終關懷',
  skills: '技能訓練', selfcare: '自主健康'
})[k] || k

// const fetchCourses = async () => {
//   const { data } = await getAllCourses()
//   courses.value = data
// }

const fetchCourses = async () => {
  isLoading.value = true

  const { data } = await getAllCourses()
  courses.value = data

  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value || 1
  }
  isLoading.value = false
}



const filteredCourses = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return courses.value
  return courses.value.filter(c =>
    c.title.toLowerCase().includes(kw) ||
    c.description.toLowerCase().includes(kw)
  )
})

const handleFileUpload = e => { selectedImage.value = e.target.files[0] }

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




const showModal = ref(false)
const popupCourse = ref({
  title: '', description: '', duration: '', category: '', image: null
})


const submitCreateCourse = async () => {
  const { title, description, duration, category, image } = popupCourse.value
  if (!title || !description || !duration || !category) {
    alert('請填寫所有欄位')
    return
  }
  if (!Number.isInteger(duration) || duration < 1) {
    alert('請輸入有效的正整數時數')
    return
  }

  const payload = {
    title,
    description,
    duration: Number(duration),
    category,
    price: 0,
    isProgressLimited: false
  }

  const formData = new FormData()
  formData.append('course', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  if (image) formData.append('image', image)

  try {
    isLoading.value = true
    await axios.post(`${apiBaseUrl.value}/api/courses/admin`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    await fetchCourses()

    Swal.fire({
      icon: 'success',
      title: '新增成功',
      showConfirmButton: false,
      timer: 1200
    })
    showModal.value = false

    await nextTick()
    setTimeout(() => {
      const lastRow = document.querySelector('tbody tr:last-child')
      if (lastRow) lastRow.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 200)

  } catch (err) {
    alert('新增失敗：' + (err?.response?.data || err.message))
  } finally {
    isLoading.value = false
  }
}


const validateDuration = () => {
  const value = popupCourse.value.duration
  if (!Number.isInteger(value) || value < 1) {
    popupCourse.value.duration = 1
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

const resetFilters = () => { searchKeyword.value = '' }

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchCourses()
})
watch(filteredCourses, () => {
  currentPage.value = 1
})

</script>

<style scoped>
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

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background .2s
}

.btn-primary {
  background: #11295c;
  color: #fff;
  border: none
}

.btn-primary:hover {
  background: #1d4ed8
}

.btn-secondary {
  background: #a7a1a1;
  border: 1px solid #d1d5db
}

.btn-secondary:hover {
  background: #f3f4f6
}

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
  color: #11295c
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
  color: #b68a8a
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

.swal2-popup {
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


.skeleton-box {
  background-color: #e0e0e0;
  border-radius: 4px;
}

.shimmer {
  background-image: linear-gradient(90deg, #e0e0e0 0px, #f5f5f5 40px, #e0e0e0 80px);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }

  100% {
    background-position: 200px 0;
  }
}
</style>
