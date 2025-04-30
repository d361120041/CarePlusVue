<template>
    <div class="container py-4">
      <h2 class="mb-4">我的課程</h2>
  
      <div v-if="courses.length > 0" class="row row-cols-1 row-cols-md-2 g-4">
        <div v-for="course in courses" :key="course.courseId" class="col">
          <!-- <router-link :to="`/courses/${course.courseId}`" class="text-decoration-none"> -->
            <!-- <router-link :to="`/learn/${course.courseId}`" class="text-decoration-none"> -->
                <router-link :to="`/course-progress/${course.courseId}`" class="text-decoration-none">

            <!-- </router-link> -->
            <div class="card h-100">
              <div class="row g-0 h-100">
                <div class="col-md-4">
                  <img
                    :src="`${apiBaseUrl}/api/courses/${course.courseId}/image`"
                    class="img-fluid rounded-start h-100 object-fit-cover"
                    alt="封面"
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body text-dark">
                    <h5 class="card-title">{{ course.title }}</h5>
                    <p class="card-text text-muted">#{{ getCategoryLabel(course.category) }}</p>
                    <p class="card-text">{{ course.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
  
      <div v-else class="text-muted text-center mt-4">
        尚未加入任何課程。
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/plugins/axios'
  const userId = 3 // 暫時寫死你的 userId
  
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
      courses.value = res.data
    } catch (err) {
      console.error('無法取得課程清單', err)
    }
  }
  
  onMounted(fetchMyCourses)
  </script>
  
  <style scoped>
  .object-fit-cover {
    object-fit: cover;
  }
  </style>  