<template>
  <div class="login-select">
    <h1 class="title">請選擇登入身分</h1>
    <div class="login-options">
      <!-- 照顧者登入 -->
      <div class="option caregiver" @click="goToCaregiverLogin">
        <div class="overlay">
          <h2>照顧者登入</h2>
        </div>
      </div>

      <!-- 超級使用者登入 -->
      <div class="option admin" @click="goToAdminLogin">
        <div class="overlay">
          <h2>超級使用者登入</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToCaregiverLogin = () => {
  router.push('/login-caregiver')
}

const goToAdminLogin = () => {
  router.push('/login-admin')
}
</script>

<style scoped>
.login-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 100vh;
  background-color: #f1fef3; /* 比白色更柔的綠底 */
}

.title {
  font-size: 2rem;
  margin-bottom: 2.5rem;
  color: #2e7d32; /* 深綠色 */
}

.login-options {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.option {
  width: 350px;
  height: 220px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 64, 0, 0.2);
  border: 3px solid #a5d6a7; /* 淺綠邊框 */
}

.option:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 64, 0, 0.3);
}

.option .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.option:hover .overlay {
  background: rgba(0, 0, 0, 0.5);
}

.option h2 {
  font-size: 1.6rem;
  text-shadow: 1px 1px 4px #000;
  font-weight: bold;
}

/* 背景圖 */
.caregiver {
  background-image: url('@/assets/yuuhou/caregiver-bg.jpg');
}

.admin {
  background-image: url('@/assets/yuuhou/admin-bg.jpg');
}
</style>
