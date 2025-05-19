<template>
  <GlobalBanner :imgSrc="bannerImg">

    <div class="banner-text">
      <h1>線上課程</h1>
      <p class="sub-text">讓學習成為照顧之路上最堅實的力量</p>
    </div>
  </GlobalBanner>



  <!-- <h1>Course</h1> -->
  <!-- <RouterLink to="/my-courses">
      <button class="btn btn-primary mb-3">我的課程</button>
    </RouterLink> -->
  <CourseList />
</template>

<script setup>
import CourseList from '@/yuni/components/CourseList.vue'
import GlobalBanner from '@/components/GlobalBanner.vue'
import bannerImg from '@/assets/images/GlobalBanner/nurse-holding-senior-man-s-hands-sympathy.webp'
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.banner-text {
  font-weight: 800;
  color: #2D3748;
  text-shadow: 3px 3px 6px rgba(255, 255, 255, 0.8);  /* 更明顯的光暈效果 */
  letter-spacing: 1px;  /* 增加字間距 */
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  text-align: center;
}

.sub-text {
  font-size: 1.5rem;  /* 縮小副標題 */
  font-weight: 600;
  color: #2D3748;
  margin-top: 10px;
}
</style>
