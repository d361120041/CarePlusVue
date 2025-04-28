<template>
    <div>
      <h2>課程列表</h2>
  
      <div>
        <input
          type="text"
          v-model="searchKeyword"
          @input="searchCourses"
          placeholder="輸入關鍵字搜尋課程"
          class="border p-2 w-full"
        />
      </div>
  
      <div v-if="courses.length > 0">
        <ul>
          <li v-for="course in courses" :key="course.courseId" class="border-b p-4 flex gap-4 items-center">
            <!-- 封面圖片 -->
            <img
              :src="`/api/courses/${course.courseId}/image`"
              alt="封面圖"
              class="w-8 h-8 object-cover rounded shadow"
            />
            <!-- 課程資訊 -->
            <div>
              <strong class="text-lg">{{ course.title }}</strong><br />
              分類：{{ course.category }}<br />
              價格：{{ course.price }} 元
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>查無課程資料。</p>
      </div>
    </div>
  </template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])
const searchKeyword = ref('')

const fetchCourses = async () => {
  try {
    const res = await axios.get('/api/courses')
    courses.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const searchCourses = async () => {
  try {
    if (searchKeyword.value.trim() === '') {
      fetchCourses()
      return
    }
    const res = await axios.get('/api/courses/search', {
      params: { keyword: searchKeyword.value }
    })
    courses.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchCourses)
</script>