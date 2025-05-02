<template>
  <div class="dashboard">
    <h2>👤 照顧者後台功能選單</h2>
    <p>請選擇要執行的功能：</p>
    <div class="button-grid">
      <button @click="go('/caregiver/profile')">📝 1. 編輯個人資料</button>
      <button @click="go('/caregiver/pricing')">💰 2. 可服務區域與收費設定</button>
      <button @click="go('/caregiver/schedule')">📅 3. 我的排班表</button>
      <button @click="go('/caregiver/orders')">📦 4. 我的訂單紀錄</button>
      <button @click="go('/caregiver/reviews')">⭐ 5. 我的評價</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const go = (path) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 3rem auto;
  text-align: center;
}
.button-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.button-grid button {
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.button-grid button:hover {
  background-color: #1c7430;
}
</style>
