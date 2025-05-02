<template>
    <div class="container py-4" v-if="course">
      <h2>{{ course.title }}</h2>
      <p class="text-muted">#{{ getCategoryLabel(course.category) }}</p>
  
      <h4 class="mt-4">學習進度</h4>
      <ul v-if="progressList.length > 0" class="list-group">
  <li
    v-for="progress in progressList"
    :key="progress.progressId"
    class="list-group-item d-flex justify-content-between align-items-center"
  >
    <router-link
      :to="`/learn/${courseId}?chapterId=${progress.chapterId.chapterId}`"
      class="text-decoration-none flex-grow-1"
    >
      {{ progress.chapterId.position }}. {{ progress.chapterId.title }}
    </router-link>

    <span>
      <span v-if="progress.isCompleted" class="badge bg-success">完成</span>
      <span v-else class="badge bg-secondary">未完成</span>
    </span>
  </li>
</ul>
      <p v-else class="text-muted">尚無進度紀錄。</p>
  
      <button class="btn btn-primary mt-3" @click="goLearn">📖 開始上課</button>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.courseId)
const userId = 3 // 暫時寫死

const course = ref(null)
const progressList = ref([])

const getCategoryLabel = (key) => {
  const map = {
    daily_care: '日常生活',
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

const fetchData = async () => {
  try {
    const resCourse = await axios.get(`/api/courses/${courseId}`)
    course.value = resCourse.data

    const resChapters = await axios.get(`/api/chapters/chapters/course/${courseId}`)
    const allChapters = resChapters.data

    let userProgress = []
    try {
      const resProgress = await axios.get(`/api/progress/user/${userId}/course/${courseId}`)
      
      userProgress = resProgress.data
    } catch (err) {
      console.warn('目前尚無進度紀錄')
    }

    // 建立章節進度清單
    progressList.value = allChapters.map(ch => {
      const found = userProgress.find(p => p.chapterId.chapterId === ch.chapterId)
      return {
        chapterId: ch,
        isCompleted: found?.isCompleted || false,
        progressId: found?.progressId || null
      }
    }).sort((a, b) => a.chapterId.position - b.chapterId.position)

  } catch (err) {
    console.error('資料載入失敗', err)
  }
}

const goLearn = () => {
  const firstUnfinished = progressList.value.find(p => !p.isCompleted)
  const chapterId = firstUnfinished?.chapterId.chapterId || progressList.value[0].chapterId.chapterId
  router.push(`/learn/${courseId}?chapterId=${chapterId}`)
}

const goPrevious = async () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    chapter.value = chapters.value[currentIndex.value]
    await ensureProgress()
  }
}

onMounted(fetchData)
</script>

  
  <style scoped>
  .badge {
    font-size: 0.9rem;
    padding: 0.4em 0.75em;
  }
  </style>
  