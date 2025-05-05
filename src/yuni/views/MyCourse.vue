<template>
  <div class="container py-4">
    <h2 class="mb-4">我的課程</h2>

    <div class="d-flex justify-content-end mb-3">
      <select v-model="sortOption" class="form-select w-auto">
        <option value="id-asc">依課程編號（小 → 大）</option>
        <option value="id-desc">依課程編號（大 → 小）</option>
      </select>
    </div>

    <div v-if="courses.length > 0" class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="course in sortedCourses" :key="course.courseId" class="col">
        <div class="card h-100 position-relative">
          <!-- 移除按鈕 -->
          <button
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 opacity-0 hover-opacity"
            @click.stop="removeCourse(course.courseId, course.title)"
            title="移除這門課程"
          >
            ✕
          </button>

          <div class="row g-0 h-100">
            <div class="col-md-4">
              <img
                :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                class="img-fluid rounded-start h-100 object-fit-cover"
                alt="封面"
              />
            </div>
            <div class="col-md-8">
              <!-- ✅ 僅將內容部分包進 router-link -->
              <router-link
                :to="`/course-progress/${course.courseId}`"
                class="text-decoration-none text-dark"
              >
                <div class="card-body">
                  <h5 class="card-title">{{ course.title }}</h5>
                  <div class="ribbon" v-if="course.isCompleted">已完成</div>
                  <p class="card-text text-muted">#{{ getCategoryLabel(course.category) }}</p>
                  <p class="card-text">{{ course.description }}</p>
                  <p class="card-text"><small class="text-muted">No.{{ course.courseId }}</small></p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-muted text-center mt-4">
      尚未加入任何課程。
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'

const userId = 3 // TODO: 改成登入後動態取得

const courses = ref([])
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

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
    const res = await axios.get(`/api/progress/user/${userId}/my-courses`)
    const myCourses = res.data

    for (const course of myCourses) {
      const progressRes = await axios.get(`/api/progress/user/${userId}/course/${course.courseId}`)
      const progresses = progressRes.data
      course.isCompleted = progresses.every(p => p.isCompleted)
    }

    courses.value = myCourses
  } catch (err) {
    console.error('無法取得課程清單', err)
  }
}


const sortOption = ref('id-asc')
const sortedCourses = computed(() => {
  return [...courses.value].sort((a, b) => {
    if (sortOption.value === 'id-asc') return a.courseId - b.courseId
    if (sortOption.value === 'id-desc') return b.courseId - a.courseId
    return 0
  })
})

const removeCourse = async (courseId, courseTitle) => {
  const confirmed = confirm(`確定要移除「${courseTitle}」這門課程嗎？`)
  if (!confirmed) return

  try {
    await axios.delete(`/api/progress/user/${userId}/course/${courseId}`)
    courses.value = courses.value.filter(course => course.courseId !== courseId)

  } catch (err) {
    console.error('移除課程失敗', err)
    alert('移除失敗，請稍後再試')
  }
}

onMounted(fetchMyCourses)
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
  right: 0;
  background-color: #28a745;
  color: white;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: bold;
  border-bottom-left-radius: 8px;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

</style>
