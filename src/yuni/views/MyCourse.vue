<template>

  <GlobalBanner :imgSrc="bannerImg">
    <h1>我的課程</h1>
  </GlobalBanner>
  <div class="container py-4">
    <!-- 麵包屑 -->
    <!-- <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item">
          <router-link to="/course" class="text-decoration-none">線上課程</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">我的課程</li>
      </ol>
    </nav> -->

    <!-- 排序 -->
    <!-- <div class="d-flex justify-content-end mb-3">
      <select v-model="sortOption" class="form-select w-auto">
        <option value="id-asc">依課程編號（小 → 大）</option>
        <option value="id-desc">依課程編號（大 → 小）</option>
      </select>
    </div> -->

    <!-- 麵包屑 + 排序按鈕 同排 -->
    <!-- 麵包屑 + 排序按鈕 同排 -->
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-2">
      <!-- 麵包屑 -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link to="/course" class="breadcrumb-dynamic">
              線上課程
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">我的課程</li>
        </ol>
      </nav>

      <!-- 排序選單 -->
      <!-- <select v-model="sortOption" class="form-select w-auto">
    <option value="id-asc">依課程編號（小 → 大）</option>
    <option value="id-desc">依課程編號（大 → 小）</option>
  </select> -->

      <!-- 排序選單（取代原本 select） -->
      <div class="dropdown m-1">
        <!-- <button class="btn btn-outline-green dropdown-toggle" type="button" data-bs-toggle="dropdown">
    排序方式
  </button> -->

        <button class="btn btn-outline-green dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="fa-solid fa-sliders"></i> </button>

        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="#" @click.prevent="sortOption = 'id-asc'">依課程 舊 → 新</a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click.prevent="sortOption = 'id-desc'">依課程 新 → 舊</a>
          </li>
        </ul>
      </div>
    </div>


    <!-- 課程列表 -->
    <div v-if="courses.length > 0" class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="course in sortedCourses" :key="course.courseId" class="col">
        <div class="card h-100 position-relative">
          <!-- Ribbon -->
          <!-- <div class="ribbon" v-if="completedCourseIds.includes(course.courseId)">已完成</div> -->
          <div class="ribbon" v-if="course.isCompleted">已完成</div>

          <!-- <div class="ribbon" v-if="completedCourseIds.includes(course.courseId)"><i class="fa-solid fa-check-double"></i></div> -->


          <!-- 移除按鈕 -->
          <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 opacity-0 hover-opacity"
            @click.stop="removeCourse(course.courseId, course.title)" title="移除這門課程">
            ✕
          </button>

          <div class="row g-0 h-100">
            <div class="col-md-4">
              <router-link :to="`/course-progress/${course.courseId}`">
                <img :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                  class="img-fluid rounded-start h-100 object-fit-cover" alt="封面" />
              </router-link>
            </div>
            <div class="col-md-8">
              <router-link :to="`/course-progress/${course.courseId}`" class="text-decoration-none text-dark">
                <div class="card-body">
                  <h5 class="card-title">{{ course.title }}</h5>
                  <p class="card-text text-muted">#{{ getCategoryLabel(course.category) }}</p>
                  <p class="card-text">{{ course.description }}</p>
                  <!-- <p class="card-text"><small class="text-muted">No.{{ course.courseId }}</small></p> -->
                  <div class="progress mt-2" style="height: 8px;">
                    <div class="progress-bar bg-success" role="progressbar"
                      :style="{ width: course.progressPercent + '%' }" :aria-valuenow="course.progressPercent"
                      aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p class="card-text text-end small text-muted">
                    完成進度：{{ course.progressPercent }}%
                  </p>

                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-muted text-center mt-4">
      尚未加入任何課程。
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import GlobalBanner from '@/components/GlobalBanner.vue'

const router = useRouter()
const userId = ref(null) // 改為 ref，從後端 session 取得
// const userId = 3 // 先寫死  之後改成登入後動態取得
const courses = ref([])
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const completedCourseIds = ref([])
const sortOption = ref('id-asc')

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

const fetchMyCourses = async () => {
  try {
    const res = await axios.get(`/api/progress/user/${userId.value}/my-courses`)
    const myCourses = res.data

    // for (const course of myCourses) {
    //   const progressRes = await axios.get(`/api/progress/user/${userId.value}/course/${course.courseId}`)
    //   const progresses = progressRes.data
    //   course.isCompleted = progresses.every(p => p.isCompleted)
    //  }
    for (const course of myCourses) {
      const progressRes = await axios.get(`/api/progress/user/${userId.value}/course/${course.courseId}`)
      const progresses = progressRes.data

      const total = progresses.length
      const completed = progresses.filter(p => p.isCompleted).length

      course.isCompleted = total > 0 && completed === total
      course.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0
    }

    courses.value = myCourses
  } catch (err) {
    console.error('無法取得課程清單', err)
  }
}

const sortedCourses = computed(() => {
  return [...courses.value].sort((a, b) => {
    if (sortOption.value === 'id-asc') return a.courseId - b.courseId
    if (sortOption.value === 'id-desc') return b.courseId - a.courseId
    return 0
  })
})
const removeCourse = async (courseId, courseTitle) => {
  // const confirmed = confirm(`確定要移除「${courseTitle}」這門課程嗎？`)
  // if (!confirmed) return

  try {
    await axios.delete(`/api/progress/user/${userId.value}/course/${courseId}`)
    courses.value = courses.value.filter(course => course.courseId !== courseId)

  } catch (err) {
    console.error('移除課程失敗', err)
    alert('移除失敗，請稍後再試')
  }
}
// 先取得使用者，再載入課程

onMounted(async () => {
  try {
    const res = await axios.get('/user/profile', { withCredentials: true })
    userId.value = res.data.userId

    // 拿到 userId 再載入資料
    const completedRes = await axios.get(`/api/progress/user/${userId.value}/completed-courses`)
    completedCourseIds.value = completedRes.data

    await fetchMyCourses()
  } catch (err) {
    console.error('無法取得使用者資訊', err)
    alert('尚未登入或 session 失效')
    router.push('/login') // 導回登入頁
  }
})

</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}

.hover-opacity {
  transition: opacity 0.2s ease;
}

.card:hover .hover-opacity {
  opacity: 1 !important;
}

.ribbon {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #28a745;
  color: white;
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
  border-bottom-right-radius: 8px;
}



.breadcrumb-item+.breadcrumb-item::before {
  content: ">";
  color: #6c757d;
}

.breadcrumb-link {
  color: #212529;
  font-weight: bold;
  transition: transform 0.2s ease, color 0.2s ease;
  display: inline-block;
}

.breadcrumb-link:hover {
  transform: scale(1.05);
  color: var(--color-primary, #4db6ac);
  text-decoration: none;
}

.breadcrumb-dynamic {
  color: #6c757d;
  font-weight: normal;
  display: inline-block;
  transition: transform 0.2s ease, color 0.2s ease;
}

.breadcrumb-dynamic:hover {
  transform: scale(1.05);
  color: #4db6ac;
  text-decoration: none;
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  font-size: 0.9rem;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: ">";
  color: #6c757d;
}

.btn-outline-green {
  color: var(--color-btn-primary-bg);
  border: 1px solid var(--color-btn-primary-bg);
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

.btn-outline-green:hover,
.btn-outline-green:focus {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
}


.dropdown-item:focus,
.btn-primary:hover,
.btn-primary:focus {
  background-color: #399e95 !important;
  border-color: #399e95 !important;
}
</style>
