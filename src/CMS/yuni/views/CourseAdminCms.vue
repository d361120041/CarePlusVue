<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">課程管理</h2>
    <div class="w-full">
      <!-- 搜尋區塊 -->
      <div class="mb-4 flex gap-2">
        <input
          v-model="searchKeyword"
          @keyup.enter="search"
          placeholder="輸入關鍵字搜尋"
          class="border px-3 py-2 rounded w-64"
        />
        <button @click="search" class="bg-blue-600 text-white px-4 py-2 rounded">搜尋</button>
        <button @click="fetchCourses" class="px-4 py-2 border rounded">全部課程</button>
      </div>

      <!-- 課程表格 -->
      <table class="w-full table-auto border text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2">編號</th>
            <th class="p-2">封面</th>
            <th class="p-2">標題</th>
            <th class="p-2">分類</th>
            <th class="p-2">時數</th>
            <!-- <th class="p-2">價格</th> -->
            <th class="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.courseId" class="border-t">
            <td class="p-2">{{ course.courseId }}</td>
            <td class="p-2">
              <!-- <img
    :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
    alt="封面"
    class="w-20 h-16 object-cover rounded border"
  /> -->

              <!-- <img :src="getCourseImage(course.courseId)" alt="封面" class="w-20 h-16 object-cover rounded border" /> -->

              <!-- <img
                :src="`${apiBaseUrl.value}/api/courses/${course.courseId}/image`"
                class="w-20 h-16 object-cover rounded border"
                alt="課程封面"
              /> -->

              <img
                :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                alt="課程封面"
                class="w-10 h-10 object-cover rounded border"
              />
            </td>
            <td class="p-2">{{ course.title }}</td>
            <td class="card-text"><small class="text-muted">#{{ getCategoryLabel(course.category) }}</small></td>
            <td class="p-2">{{ course.duration }}</td>
            <!-- <td class="p-2">{{ course.price }}</td> -->
            <td class="p-2 flex gap-2">
              <button @click="startEdit(course)" class="text-blue-600">編輯</button>
              <button @click="deleteOne(course.courseId)" class="text-red-600">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 新增/編輯表單 這個之後拿掉改別的tab-->
    <div class="mt-6 border p-4 rounded bg-gray-50">
      <h3 class="text-lg font-bold mb-2">{{ editingCourse.courseId ? '編輯課程' : '新增課程' }}</h3>
      <input
        v-model="editingCourse.title"
        placeholder="標題"
        class="border px-2 py-1 mb-2 w-full"
      />
      <input
        v-model="editingCourse.category"
        placeholder="分類"
        class="border px-2 py-1 mb-2 w-full"
      />
      <input
        v-model="editingCourse.duration"
        placeholder="時數"
        class="border px-2 py-1 mb-2 w-full"
      />
      <!-- <input v-model.number="editingCourse.price" placeholder="價格" class="border px-2 py-1 mb-2 w-full" /> -->
      <button @click="save" class="bg-green-600 text-white px-4 py-2 rounded">
        {{ editingCourse.courseId ? '更新' : '新增' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios.js'

// import { getCourseImageUrl } from '@/yuni/api/courseApi'
// import {getCourseImage} from '@/yuni/api/courseApi'

const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL)

const getCourseImageUrl = (id) => {
  return `${apiBaseUrl.value}/api/courses/${id}/image`
}
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
} from '@/CMS/yuni/api/courseApi'

const courses = ref([])
const searchKeyword = ref('')
const editingCourse = ref({
  title: '',
  category: '',
  duration: '',
  price: 0,
})

// const categoryMap = {
//   daily_care: '日常照護',
//   dementia: '失智照護',
//   nutrition: '營養保健',
//   psychology: '心理支持',
//   assistive: '輔具協助',
//   resource: '資源導覽',
//   endoflife: '臨終關懷',
//   skills: '技能訓練',
//   selfcare: '自主健康',
// }

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

// const fetchCourses = async () => {
//   const res = await getAllCourses()
//   courses.value = res.data
// }

const fetchCourses = async () => {
  console.log('課程資料：', JSON.stringify(res.data, null, 2))

  try {
    const res = await getAllCourses()
    console.log('課程資料：', res.data)
    courses.value = res.data
  } catch (error) {
    console.error('載入課程失敗', error)
  }
}

const search = async () => {
  const res = await searchCourses(searchKeyword.value)
  courses.value = res.data
}

const startEdit = (course) => {
  editingCourse.value = { ...course }
}

const save = async () => {
  if (editingCourse.value.courseId) {
    await updateCourse(editingCourse.value.courseId, editingCourse.value)
  } else {
    await createCourse(editingCourse.value)
  }
  await fetchCourses()
  editingCourse.value = { title: '', category: '', duration: '', price: 0 }
}

const deleteOne = async (id) => {
  if (confirm('確定要刪除嗎？')) {
    await deleteCourse(id)
    await fetchCourses()
  }
}

onMounted(async () => {
  const res = await getAllCourses()
  console.log('課程資料：', res.data)
  courses.value = res.data
})
</script>
