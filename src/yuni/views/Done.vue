<template>
  <div class="done-page text-center py-5">
    <h1 class="text-success mb-4">🎉 恭喜完成課程！</h1>
    <h3 class="mb-3">{{ course.title }}</h3>
    <p class="text-muted mb-4">
      你已完成 {{ totalChapters }} 個章節，完成時間：{{ completionDate }}
    </p>

    <div class="btn-group mt-4">
      <router-link to="/my-courses" class="btn btn-outline-primary">回到我的課程</router-link>
      <!-- <router-link to="/" class="btn btn-outline-secondary">回首頁</router-link> -->
      <!-- <button class="btn btn-success">📄 下載證書</button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios.js'

const route = useRoute()
const courseId = Number(route.params.courseId)
//   const userId = 3  // 暫時寫死
const userId = Number(localStorage.getItem('userId'))


const course = ref({})
const totalChapters = ref(0)
const completionDate = ref('')

onMounted(async () => {
  try {
    const resCourse = await axios.get(`/api/courses/${courseId}`)
    course.value = resCourse.data

    const resChapters = await axios.get(`/api/chapters/chapters/course/${courseId}`)
    totalChapters.value = resChapters.data.length

    // 更新為完成狀態
    await axios.patch(`/api/progress/user/${userId}/course/${courseId}/complete-all`)

    // 顯示完成時間為當下時間
    completionDate.value = new Date().toLocaleString()
    console.log('✅ 完成時間：', completionDate.value)
  } catch (err) {
    console.error('載入或更新失敗：', err)
  }
})



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