

<template>
  <div class="page-wrapper">
    <!-- ✅ 麵包屑仍在頂部 -->
    <div class="container py-4" v-if="course">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link to="/course" class="breadcrumb-dynamic">線上課程</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/my-courses" class="breadcrumb-dynamic">我的課程</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">我的章節學習進度</li>
        </ol>
      </nav>
    </div>

    <!-- ✅ 主要卡片區域 -->
    <div class="page-content">
      <div class="card shadow-sm p-4" v-if="course" style="width: 100%; max-width: 1000px;">
        <h3 class="fw-bold mb-4">{{ course.title }}</h3>
        <p class="course-category text-muted">#{{ getCategoryLabel(course.category) }}</p>

        <ul v-if="progressList.length > 0" class="list-group list-group-flush">
          <li
            v-for="progress in progressList"
            :key="progress.progressId"
            class="list-group-item d-flex justify-content-between align-items-center px-0"
          >
            <router-link
              :to="`/learn/${courseId}?chapterId=${progress.chapterId.chapterId}`"
              class="text-decoration-none text-dark fw-medium"
            >
              {{ progress.chapterId.position }}. {{ progress.chapterId.title }}
            </router-link>

            <span>
              <span v-if="progress.status === 'completed'" class="badge bg-success">完成</span>
              <span v-else-if="progress.status === 'in_progress'" class="badge bg-warning text-dark">進行中</span>
              <span v-else class="badge bg-secondary">未開始</span>
            </span>
          </li>
        </ul>

        <p v-else class="text-muted">尚無進度紀錄</p>

        <div class="text-end mt-4">
          <button class="button-green" @click="goLearn">開始上課</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'

import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.courseId)
// const userId = 3 // 暫時寫死
const userId = ref(null)

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
      const resProgress = await axios.get(`/api/progress/user/${userId.value}/course/${courseId}`)

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
        status: found?.status || 'not_started',
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

onMounted(async () => {
  try {
    // 先取得目前登入的使用者資訊
    const res = await axios.get('/user/profile', { withCredentials: true })
    userId.value = res.data.userId

    // 拿到 userId 後再載入課程與進度資料
    await fetchData()
  } catch (err) {
    console.error('無法取得使用者資訊', err)
    alert('尚未登入或 session 失效')
    router.push('/login') // 導回登入頁或首頁
  }
})


</script>




<style scoped>
.progress-card-wrapper {
  background-color: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  max-width: 1000px;
  min-height: 65vh;
  margin-top: 3rem;
  margin-bottom: 3rem;
  padding: 3rem;
}

/* 章節背景與排版 */
.chapter-section {
  background-color: #fff8e1;
  min-height: 269px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 統一字體行距與間距 */
.course-info p,
.course-info h2 {
  line-height: 1.8;
}

/* 自定義分類標籤排版 */
.course-category {
  padding-left: 35px;
  color: #666;
}

.badge {
  font-size: 0.85rem;
  padding: 0.4em 0.75em;
  border-radius: 1em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.badge.bg-success {
  background-color: #28a745 !important;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
}

.card {
  background-color: var(--color-bg-card, #fff);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.list-group-item {
  border: none;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.list-group-item:last-child {
  border-bottom: none;
}

.breadcrumb-dynamic {
  color: #6c757d; /* Bootstrap 的 text-muted */
  font-weight: normal;
  display: inline-block;
  transition: transform 0.2s ease, color 0.2s ease;
}

.breadcrumb-dynamic:hover {
  transform: scale(1.05);
  color: #007bff; /* Hover 時變藍 */
  text-decoration: none;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  color: #6c757d;
}

/* 保證外層容器撐滿頁面高度 */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px); /* 120px 為 navbar + footer 預估高度，可微調 */
}

/* 撐開內容區域 */
.page-content {
  flex: 1;
  display: flex;
  justify-content: center; /* 讓卡片置中 */
  align-items: flex-start;
  padding-bottom: 2rem;
}
</style>