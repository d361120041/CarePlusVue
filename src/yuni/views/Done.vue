<template>
  <div class="done-page text-center py-5">
    <h1 class="text-success mb-4">🎉 恭喜{{ auth.userName }}完成課程！</h1>
    <h3 class="mb-3">{{ course.title }}</h3>
    <p class="text-muted mb-4">
      你已完成 {{ totalChapters }} 個章節，完成時間：{{ completionDate }}
    </p>

    <div class="btn-group mt-4">
      <router-link to="/my-courses" class="button-green">回到我的課程</router-link>
      <!-- <router-link to="/" class="btn btn-outline-secondary">回首頁</router-link> -->
      <!-- <button class="btn btn-success">📄 下載證書</button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios.js'

import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();

const route = useRoute()
const courseId = Number(route.params.courseId)
//   const userId = 3  // 暫時寫死
const userId = ref(null)

const course = ref({})
const totalChapters = ref(0)
const completionDate = ref('')

// 取得課程資料
const fetchCourseData = async () => {
  try {
    const resCourse = await axios.get(`/api/courses/${courseId}`)
    course.value = resCourse.data

    const resChapters = await axios.get(`/api/chapters/chapters/course/${courseId}`)
    totalChapters.value = resChapters.data.length

    // 更新所有進度為完成，並取得當下時間作為完成時間
    await axios.patch(`/api/progress/user/${userId.value}/course/${courseId}/complete-all`)
    completionDate.value = new Date().toLocaleString()
    console.log('完成時間：', completionDate.value)
  } catch (err) {
    console.error('載入或更新失敗：', err)
    // 可根據需要顯示提示或導頁
  }
}

// 取得使用者資訊，從後端 session 中取得
const fetchUserProfile = async () => {
  try {
    const res = await axios.get('/user/profile', { withCredentials: true })
    // 假設後端回傳的 user 物件中有 userId 與 userName 等資訊，
    // 並且 auth store 會同時更新這些資訊（或你直接在此 ref 設定）
    userId.value = res.data.userId
    // 若 auth store 中有存 userName，也會顯示在頁面上
    // 例如：auth.userName = res.data.userName;
  } catch (err) {
    console.error('無法取得使用者資訊', err)
    alert('請先登入')
    router.push('/login')
  }
}



onMounted(async () => {
  // 先取得 session 中的使用者資訊
  await fetchUserProfile()
  // 確保 userId 已經不為 null 再呼叫後續 API
  if (userId.value) {
    await fetchCourseData()
  }
})

// onMounted(async () => {
//   try {
//     const resCourse = await axios.get(`/api/courses/${courseId}`)
//     course.value = resCourse.data

//     const resChapters = await axios.get(`/api/chapters/chapters/course/${courseId}`)
//     totalChapters.value = resChapters.data.length

//     // 更新為完成狀態
//     await axios.patch(`/api/progress/user/${userId.value}/course/${courseId}/complete-all`)

//     // 顯示完成時間為當下時間
//     completionDate.value = new Date().toLocaleString()
//     console.log('✅ 完成時間：', completionDate.value)
//   } catch (err) {
//     console.error('載入或更新失敗：', err)
//   }
// })



</script>

<style scoped>
.done-page {
  max-width: 600px;
  margin: 0 auto;
}

.btn-group>* {
  margin: 0 0.5rem;
}
</style>