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
            <tr v-for="course in filteredCourses" :key="course.courseId"
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

            <!-- 新增模式 -->
            <tr v-if="isCreating" class="row-creating">
              <td>{{ filteredCourses.length + 1 }}</td>
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

            <!-- 新增按鈕列（只有沒在搜尋且非新增模式才顯示） -->
            <tr v-if="!isCreating && !searchKeyword" class="row-add" @click="startCreate">
              <td style="text-align: center;" colspan="7">➕ 新增課程</td>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const fetchCourses = async () => {
  const { data } = await getAllCourses()
  courses.value = data
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
const startCreate = () => { isCreating.value = true; editingCourse.value = emptyCourse() }
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

/* ---------- 其他 ---------- */
const resetFilters = () => { searchKeyword.value = '' }   // 清空即可，computed 會自動回全列表

onMounted(fetchCourses)
</script>

<style scoped>
/* ---------- 版型 ---------- */
.page-wrapper {
  height: 100%;
  padding: 24px;
  background: #f5f6fa
}

.card {
  max-width: 1280px;
  margin: 10px 5px;
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
  width: 30px
}

.col-cover {
  width: 80px
}

.col-title {
  width: 236px
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
  text-decoration: underline
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
</style>
