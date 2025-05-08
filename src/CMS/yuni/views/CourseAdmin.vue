<template>
  <div class="page-wrapper">
    <!-- 白色卡片 -->
    <div class="card">
      <!-- ────────── 搜尋列 ────────── -->
      <div class="search-row">
        <input v-model="searchKeyword" @keyup.enter="search" placeholder="輸入關鍵字搜尋" class="search-input" />
        <button @click="search" class="btn btn-primary">搜尋</button>
        <!-- <button @click="fetchCourses" class="btn btn-secondary">全部課程</button> -->
        <button @click="resetFilters" class="btn btn-secondary">✕</button>
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

          <tbody>
            <!-- 列表列 -->
            <tr v-for="course in courses" :key="course.courseId"
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
                <td><input v-model="editingCourse.duration" type="number" class="input-edit" placeholder="時數" /></td>
                <td class="action-cell">
                  <button @click="save" class="link green">儲存</button>
                  <button @click="cancelEdit" class="link gray">取消</button>
                </td>
              </template>

              <!-- 顯示模式 -->
              <template v-else>
                <td>{{ course.courseId }}</td>
                <!-- <td>
                  <img
                    :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                    class="cover-img"
                  />
                </td>
                <td>{{ course.title }}</td> -->
                <td>
                  <router-link :to="`/courses/${course.courseId}`">
                    <img :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`" class="cover-img"
                      style="cursor: pointer" />
                  </router-link>
                </td>
                <td>
                  <router-link :to="`/courses/${course.courseId}`" class="link-title">
                    {{ course.title }}
                  </router-link>
                </td>
                <td>{{ course.description }}</td>
                <td class="text-cat">#{{ getCategoryLabel(course.category) }}</td>
                <!-- <td>{{ course.duration }}</td> -->

                <td>{{ formatDuration(course.duration) }}</td>


                <td class="action-cell">
                  <button @click="startEdit(course)" class="link blue">編輯</button>
                  <button @click="deleteOne(course.courseId)" class="link red">刪除</button>
                </td>


              </template>
            </tr>

            <!-- 新增模式 -->
            <tr v-if="isCreating" class="row-creating">
              <td>{{ courses.length + 1 }}</td>
              <td><input type="file" @change="handleFileUpload" /></td>
              <td><input v-model="editingCourse.title" class="input-create" placeholder="請輸入課程標題" /></td>
              <td><input v-model="editingCourse.description" class="input-create" placeholder="請輸入課程介紹" /></td>
              <td>
                <select v-model="editingCourse.category" class="input-create">
                  <option disabled value="">請選擇分類</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ getCategoryLabel(cat) }}
                  </option>
                </select>
              </td>

              <!-- <td><input v-model="editingCourse.duration" class="input-create" value="小時" /></td> -->


              <td>
                <input v-model="editingCourse.duration" type="number" class="input-create" placeholder="課程時數" />
              </td>

              <td class="action-cell">
                <button @click="create" class="link green">送出</button>
                <button @click="cancelCreate" class="link gray">取消</button>
              </td>
            </tr>

            <!-- 新增按鈕列 -->
            <!-- <tr v-else class="row-add" @click="startCreate">
              <td colspan="7">➕ 新增課程</td>
            </tr> -->
            <tr v-if="!isCreating && !searchKeyword" class="row-add" @click="startCreate">
              <td colspan="7">➕ 新增課程</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/plugins/axios.js'
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
} from '@/CMS/yuni/api/courseApi'


/**
 * 將數字或已含「小時」字串轉為「n小時」
 * @param {string|number} val
 * @returns {string}
 */
const formatDuration = (val) => {
  if (val == null || val === '') return ''
  const s = String(val)
  return s.includes('小時') ? s : `${s}小時`
}

const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL)
const courses = ref([])
const searchKeyword = ref('')
const emptyCourse = () => ({
  title: '',
  category: '',
  description: '',
  duration: '',
  price: 0,
  isProgressLimited: false
})
const editingId = ref(null)
const editingCourse = ref(emptyCourse())
const isCreating = ref(false)

const selectedImage = ref(null)

const handleFileUpload = (event) => {
  selectedImage.value = event.target.files[0]
}
// 所有可選分類（對應 enum 名稱）
const categories = [
  'daily_care',
  'dementia',
  'nutrition',
  'psychology',
  'assistive',
  'resource',
  'endoflife',
  'skills',
  'selfcare'
]

// 顯示中文名稱（選擇性）
const getCategoryLabel = (key) => {
  const map = {
    daily_care: '日常照護',
    dementia: '失智照護',
    nutrition: '營養保健',
    psychology: '心理支持',
    assistive: '輔具協助',
    resource: '資源導覽',
    endoflife: '臨終關懷',
    skills: '技能訓練',
    selfcare: '自主健康'
  }
  return map[key] || key
}

const fetchCourses = async () => {
  try {
    // const res = await getAllCourses()
    // // console.log('課程資料：', JSON.stringify(res.data, null, 2))
    // courses.value = res.data
    const res = await getAllCourses()
    courses.value = res.data
  } catch (error) {
    console.error('載入課程失敗', error)
  }
}

// 清除關鍵字並重新載入全部課程
const resetFilters = async () => {
  searchKeyword.value = ''
  await fetchCourses()
}


const search = async () => {
  const res = await searchCourses(searchKeyword.value)
  courses.value = res.data
}

// const startEdit = (course) => {
//   editingCourse.value = { ...course }
// }
const startEdit = (course) => {
  editingId.value = course.courseId
  editingCourse.value = {
    ...course,
    duration: String(course.duration).replace(/[^\d.]/g, ''),
  }
}

const cancelEdit = () => {
  editingId.value = null
  editingCourse.value = emptyCourse()
}

const toNumber = (v) => (v === '' || v == null ? null : Number(v))

const save = async () => {

  const payload = {
    ...editingCourse.value,
    duration: toNumber(editingCourse.value.duration),
  }

  if (editingCourse.value.courseId) {
    await updateCourse(editingCourse.value.courseId, payload)
  } else {
    await createCourse(payload)
  }
  await fetchCourses()
  editingCourse.value = emptyCourse()
  editingId.value = null
}





const deleteOne = async (id) => {
  if (confirm('確定要刪除嗎？')) {
    await deleteCourse(id)
    await fetchCourses()
  }
}


const startCreate = () => {
  isCreating.value = true
  editingId.value = null
  editingCourse.value = emptyCourse()
}

const cancelCreate = () => {
  isCreating.value = false
  editingCourse.value = emptyCourse()
  selectedImage.value = null
}

const create = async () => {

  const payload = {
    ...editingCourse.value,
    duration: toNumber(editingCourse.value.duration),
  }

  // console.log('送出 JSON：', JSON.stringify(editingCourse.value))
  // console.log('Blob 內容', editingCourse.value)

  const formData = new FormData()
  formData.append(
    'course',
    new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    })
  )
  if (selectedImage.value) {
    formData.append('image', selectedImage.value)
  }

  try {
    const res = await axios.post(`${apiBaseUrl.value}/api/courses/admin`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    // 立刻將新增的課程插入（避免等 fetchCourses）
    courses.value.push(res.data)

    isCreating.value = false
    editingCourse.value = emptyCourse()
    selectedImage.value = null
  } catch (error) {
    console.error('新增課程失敗', error)
  }
}

watch(searchKeyword, async (val, oldVal) => {
  const trimmed = val.trim()

  // 1. 字被清空 → 抓全部課程
  if (trimmed.length === 0 && oldVal.trim().length !== 0) {
    await fetchCourses()
    isCreating.value = false          // 如需保留可留
    editingId.value = null
    return
  }

  // 2. 不是空字串但有輸入 → 及時查詢（想要按 Enter 再查就拿掉這行）
  if (trimmed.length > 0) {
    await search()                    // call 你原本的 search()
  }
})

onMounted(async () => {
  await fetchCourses()
})
</script>



<style scoped>
/* .input-edit {
  @apply border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300;
}

.input-create {
  @apply border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500;
}

.add-new-row {
  cursor: pointer;
}

.full-width-table {
  width: 100%;
} */

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
  background: #dc2626;
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
  width: 30px;
}

.col-cover {
  width: 80px;
}

.col-title {
  width: 236px;
}

.col-cat {
  width: 120px;
}

.col-duration {
  width: 80px;
}

.col-action {
  width: 110px;
}

/* 封面圖片固定 80x80 */
.cover-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #d1d5db;
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
  height: 105px;
}

td.action-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12;
}

.text-cat {
  color: #64748b;
}

.link-title {
  color: #111827;
  text-decoration: none;
}

.link-title:hover {
  color: #111827;
  text-decoration: none;
  font-weight: 500;

}
</style>
