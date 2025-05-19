<template>
  <div class="page-wrapper">
    <!-- 麵包屑 -->
    <div class="container py-4" style="padding-bottom: 0.5em;" v-if="course">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link to="/course" class="breadcrumb-dynamic">線上課程</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">課程資訊</li>
        </ol>
      </nav>
    </div>

    <!-- 課程卡片區域 -->
    <div class="page-content">
      <div class="container py-4" v-if="course">
        <div class="card p-4 course-card-wrapper mx-auto d-flex flex-column">
          <!-- 上方課程資訊 -->
          <div class="flex-grow-1 d-flex justify-content-between flex-wrap align-items-start gap-3 mb-4 inner-content">
            <div class="course-info pe-3">
              <h2 class="mb-3">{{ course.title }}</h2>
              <p class="course-category">＃{{ getCategoryLabel(course.category) }}</p>
              <p class="course-description">{{ course.description }}</p>
              <p class="course-duration">時長：{{ course.duration }}小時</p>
            </div>

            <div class="text-end" style="min-width: 200px; padding-right: 80px; padding-top: 150px;">
              <div class="btn-group-vertical w-100" role="group">
                <button class="btn btn-outline enroll-btn mb-2"
                        :class="enrolled ? 'btn-danger' : ''"
                        @click="toggleEnrollment">
                  {{ enrolled ? '取消加入' : '加入課程' }}
                </button>
                <button v-if="authStore.isAuthenticated"
                        :class="['btn', isFavorited ? 'btn-secondary' : 'btn-outline-danger']"
                        @click="toggleFavorite">
                  {{ isFavorited ? '取消收藏' : '加入收藏' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 章節列表 -->
          <div class="chapter-section p-4 rounded mt-2">
            <h4 class="mb-3">章節列表</h4>
            <ul v-if="chapters.length > 0" class="list-group list-group-flush">
              <li v-for="chapter in chapters" :key="chapter.chapterId" class="list-group-item bg-transparent">
                {{ chapter.position }}. {{ chapter.title }}
              </li>
            </ul>
            <p v-else class="text-muted">此課程目前無章節。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const route = useRoute()
const courseId = Number(route.params.id)
const router = useRouter()

const userId = ref(null)
const course = ref(null)
const chapters = ref([])
const enrolled = ref(false)
const isFavorited = ref(false)

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
    selfcare: '自主健康',
  }
  return map[key] || key
}

const checkEnrolled = async () => {
  try {
    const res = await axios.get(`/api/progress/user/${userId.value}/course/${courseId}`)
    enrolled.value = res.data.length > 0
  } catch {
    enrolled.value = false
  }
}

// const toggleEnrollment = async () => {
//   try {
//     if (!enrolled.value) {
//       await axios.post('/api/progress/enroll', { userId: userId.value, courseId })
//       enrolled.value = true
//     } else {
//       await axios.delete(`/api/progress/user/${userId.value}/course/${courseId}`)
//       enrolled.value = false
//     }
//   } catch (err) {
//     console.error(err)
//     alert('操作失敗，請稍後再試')
//   }
// }

// added sweetalert

// const toggleEnrollment = async () => {
//   try {
//     if (!enrolled.value) {
//       await axios.post('/api/progress/enroll', { userId: userId.value, courseId })
//       enrolled.value = true
//       Swal.fire({
//   icon: 'success',
//   title: '已加入課程',
//   text: '歡迎開始學習！',
//   showCancelButton: true,
//   confirmButtonText: '前往我的課程',
//   cancelButtonText: '繼續瀏覽',
//   confirmButtonColor: '#4DB6AC',
//   cancelButtonColor: '#ccc'
// }).then((result) => {
//   if (result.isConfirmed) {
//     router.push('/my-courses')
//   }
// })
//     } else {
//       await axios.delete(`/api/progress/user/${userId.value}/course/${courseId}`)
//       enrolled.value = false
//       Swal.fire({
//         icon: 'info',
//         title: '已取消加入',
//         text: '您已退出本課程',
//         confirmButtonColor: '#d33'
//       })
//     }
//   } catch (err) {
//     console.error(err)
//     Swal.fire({
//       icon: 'error',
//       title: '操作失敗',
//       text: '請稍後再試',
//     })
//   }
// }

const toggleEnrollment = async () => {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: '請先登入',
      text: '登入後才能加入課程',
      confirmButtonText: '前往登入頁',
      confirmButtonColor: '#4DB6AC'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/userlogin')
      }
    })
    return // 提早結束函式
  }

  try {
    if (!enrolled.value) {
      await axios.post('/api/progress/enroll', { userId: userId.value, courseId })
      enrolled.value = true
      Swal.fire({
        icon: 'success',
        title: '已加入課程',
        text: '歡迎開始學習！',
        showCancelButton: true,
        confirmButtonText: '前往我的課程',
        cancelButtonText: '繼續瀏覽',
        confirmButtonColor: '#4DB6AC',
        cancelButtonColor: '#ccc'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/my-courses')
        }
      })
    } else {
      await axios.delete(`/api/progress/user/${userId.value}/course/${courseId}`)
      enrolled.value = false
      Swal.fire({
        icon: 'info',
        title: '已取消加入',
        text: '您已退出本課程',
        confirmButtonColor: '#d33'
      })
    }
  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: '操作失敗',
      text: '請稍後再試',
    })
  }
}



const checkFavorite = async () => {
  try {
    const res = await axios.get('/favorites/courses')
    const ids = res.data.map((item) => item.courseId)
    isFavorited.value = ids.includes(courseId)
  } catch (err) {
    console.error('取得收藏課程失敗：', err)
  }
}

const toggleFavorite = async () => {
  try {
    if (isFavorited.value) {
      await axios.delete('/favorites/deleteCourse', { params: { courseId } })
      isFavorited.value = false
    } else {
      await axios.post('/favorites/addCourse', null, { params: { courseId } })
      isFavorited.value = true
    }
  } catch (err) {
    console.error('收藏操作失敗：', err)
  }
}

onMounted(async () => {
  try {
    const resProfile = await axios.get('/user/profile', { withCredentials: true })
    userId.value = resProfile.data.userId
    await checkEnrolled()
    await checkFavorite()
  } catch {
    userId.value = null
  }

  try {
    const resCourse = await axios.get(`/api/courses/${courseId}`)
    course.value = resCourse.data

    const resChapters = await axios.get(`/api/chapters/chapters/course/${courseId}`)
    chapters.value = resChapters.data
  } catch (err) {
    console.error('課程或章節載入失敗：', err)
  }
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
)
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

.page-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-bottom: 1rem;
}

.course-card-wrapper {
  background-color: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  max-width: 1000px;
  width: 100%;
  margin-bottom: 1.5rem;
  padding-left: 3rem;
  padding-right: 3rem;
}

.chapter-section {
  background-color: #fff8e1;
  min-height: 269px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.course-info p,
.course-info h2 {
  line-height: 1.8;
}

.course-category {
  padding-left: 35px;
  margin-bottom: 35px;
  color: #666;
}

.course-description {
  padding-left: 45px;
  margin-bottom: 35px;
      width: 650px;
}

.course-duration {
  padding-left: 45px;
  margin-bottom: 0;
}

.breadcrumb-dynamic {
  color: #6c757d;
  font-weight: normal;
  transition: transform 0.2s ease, color 0.2s ease;
}

.breadcrumb-dynamic:hover {
  transform: scale(1.05);
  color: #4DB6AC;
  text-decoration: none;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  color: #6c757d;
}

.enroll-btn {
  border: 1px solid #4DB6AC;
  color: #4DB6AC;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

.enroll-btn:hover {
  background-color: #4DB6AC;
  color: white;
}
</style>
