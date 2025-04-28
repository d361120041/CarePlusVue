<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">後台課程管理</h2>
  
      <div class="mb-4 text-right">
        <router-link
          to="/admin/course/new"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ 新增課程
        </router-link>
      </div>
  
      <table class="table-auto w-full border text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">封面</th>
            <th class="border px-4 py-2">標題</th>
            <th class="border px-4 py-2">分類</th>
            <th class="border px-4 py-2">價格</th>
            <th class="border px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.courseId" class="text-center">
            <td class="border px-4 py-2">
              <img
                :src="`/api/courses/${course.courseId}/image`"
                class="w-20 h-20 object-cover mx-auto rounded"
                alt="封面圖"
              />
            </td>
            <td class="border px-4 py-2">{{ course.title }}</td>
            <td class="border px-4 py-2">{{ course.category }}</td>
            <td class="border px-4 py-2">{{ course.price }} 元</td>
            <td class="border px-4 py-2">
              <router-link
                :to="`/admin/course/edit/${course.courseId}`"
                class="text-blue-500 hover:underline mr-2"
              >
                編輯
              </router-link>
              <button
                @click="deleteCourse(course.courseId)"
                class="text-red-500 hover:underline"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const courses = ref([])
  const router = useRouter()
  
  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses')
      courses.value = res.data
    } catch (error) {
      console.error('載入課程失敗：', error)
    }
  }
  
  const deleteCourse = async (id) => {
    if (confirm('確定要刪除這門課程嗎？')) {
      try {
        await axios.delete(`/api/courses/${id}`)
        await fetchCourses()
      } catch (error) {
        console.error('刪除課程失敗：', error)
      }
    }
  }
  
  onMounted(fetchCourses)
  </script>
  
  <style scoped>
  th, td {
    white-space: nowrap;
  }
  </style>
  