<template>
  <div class="navbar">
    <ul>
      <li>
        <router-link to="/">首頁</router-link>
      </li>
      <li>
        <router-link to="/空白1">空白1</router-link>
      </li>
      <li>
        <router-link to="/空白2">空白2</router-link>
      </li>
      <li>
        <router-link to="/空白3">空白3</router-link>
      </li>
      <li>
        <router-link to="/news">新聞列表</router-link>
      </li>
      <li>
        <router-link to="/course">線上課程</router-link>
      </li>
      <li>
        <router-link to="/social">討論區</router-link>
      </li>
    </ul>
    <div class="login-button">
  <button @click="goLogin" >照顧者登入</button>
</div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
const router = useRouter()

const goLogin = () => {
  router.push('/caregiverLogin')
}

</script>

<style scoped>
.navbar {
  background-color: #0366d6;
  padding: 0.5rem 1rem;
}

.navbar ul {
  display: flex;
  justify-content: center;
  list-style: none;
}

.navbar li {
  margin: 0 0.75rem;
}

.navbar a {
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background 0.2s ease, color 0.2s ease;
  text-decoration: none;
}

/* 當前路由（包含子路由）被點擊時套用 */
.active {
  background-color: rgba(255, 255, 255, 0.2);  /* 半透明底色 */
  font-weight: bold;                            /* 加粗文字 */
  border-bottom: 2px solid #fff;                /* 底線強調 */
}

/* 精確對應當前路由才套用 */
.active--exact {
  background-color: #ffffff33;                  /* 較淡半透明底色 */
  color: #000 !important;                       /* 強制文字變黑，與底色對比 */
}

/* 手機垂直版保留前述設定 */
@media (max-width: 600px) {
  .navbar ul {
    flex-direction: column;
    align-items: stretch;
  }
  .navbar li {
    margin: 0.25rem 0;
  }
}
</style>
