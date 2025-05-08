<template>
    <div class="course-intro-wrapper">
      <div class="left-section">
        <h2>不是專業，也能照顧得安心</h2>
        <p>
          簡單易懂的線上課程，溫暖支持您照顧家人的每一步，從容應對日常挑戰。
        </p>
        <RouterLink to="/course" class="btn">點我探索課程去</RouterLink>
      </div>
  
      <div class="right-section">
        <h3>多元課程，照護知識一次掌握！</h3>
        <div class="stats-box">
          <div class="stat">
            <p class="number">{{ categoryCount }}</p>
            <p class="label">種類別</p>
          </div>
          <div class="stat">
            <p class="number">{{ courseCount }}</p>
            <p class="label">門課</p>
          </div>
        </div>
        <!-- <button class="btn-outline" @click="goToCourses">立即瀏覽</button> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from '@/plugins/axios'
  
  const router = useRouter()
  const courseCount = ref(0)
  const categoryCount = ref(0)
  
  const fetchCourseStats = async () => {
    try {
      const courseRes = await axios.get('/api/courses/count')
      courseCount.value = courseRes.data
  
      // 這裡你可以依照實際後端邏輯修改
      // 例如從 ENUM 或 API 回傳分類數量
      categoryCount.value = 9
    } catch (err) {
      console.error('取得課程統計失敗', err)
    }
  }
  
  const goToCourses = () => {
    router.push('/courses')
  }
  
  onMounted(fetchCourseStats)
  </script>
  
  <style scoped>
  .course-intro-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 48px 20px;
    flex-wrap: wrap;
  }
  
  .left-section {
    flex: 1;
    min-width: 300px;
  }
  
  .left-section h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 16px;
  }
  
  .left-section p {
    font-size: 1.1rem;
    margin-bottom: 24px;
    color: #374151;
    line-height: 1.6;
  }
  
  .right-section {
    flex: 1;
    text-align: center;
    background: #f0fdf4;
    border: 2px solid #4ade80;
    border-radius: 20px;
    padding: 32px 16px;
    min-width: 280px;
  }
  
  .right-section h3 {
    font-size: 1.5rem;
    margin-bottom: 24px;
    color: #065f46;
    font-weight: 600;
  }
  
  .stats-box {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 20px;
  }
  
  .stat {
    background: white;
    padding: 20px 16px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    width: 100px;
  }
  
  .number {
    font-size: 28px;
    font-weight: bold;
    color: #16a34a;
  }
  
  .label {
    font-size: 16px;
    color: #6b7280;
  }
  
  .btn, .btn-outline {
    padding: 10px 24px;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: inline-block;
    text-decoration: none;
  }
  
  .btn {
    background: #16a34a;
    color: white;
  }
  
  .btn:hover {
    background: #15803d;
  }
  
  .btn-outline {
    border: 2px solid #16a34a;
    background: transparent;
    color: #16a34a;
  }
  
  .btn-outline:hover {
    background: #d1fae5;
  }
  </style>
  