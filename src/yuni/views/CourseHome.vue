<template>
  <GlobalBanner :imgSrc="bannerImg">
    <h1>線上課程</h1>
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
</style>
