<template>
  <div class="sidebar">
    <h1>🌱 我的工作平台</h1>
    <div class="menu-items">
      <!-- 📝 個人資訊管理 -->
      <div class="dropdown">
        <button class="dropdown-title">👤 個人資訊管理</button>
        <div class="dropdown-content">
          <button @click="go('/caregiver/profile')">📝 編輯個人資料</button>
          <button @click="go('/caregiver/pricing')">💰 可服務區域與收費設定</button>
        </div>
      </div>

      <!-- 其他選項 -->
      <button @click="go('/caregiver/orderss')">📦 我的訂單紀錄</button>
     
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const go = (path) => {
  router.push(path);
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #FFE5B4; /* 溫暖的奶油橘 */
  color: #333;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
  border-radius: 0 20px 20px 0;
  font-family: "Noto Sans TC", Arial, sans-serif;
}

.sidebar h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #FFDFD3; /* 淡粉杏色的底線 */
  padding-bottom: 0.5rem;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 主選單按鈕 */
.menu-items button {
  background-color: #ffffff;
  color: #333;
  border: 2px solid #ccc;
  padding: 0.75rem 1.5rem;
  border-radius: 15px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
  width: 100%;
}

/* 主選單按鈕 hover */
.menu-items button:hover {
  background-color: #FFDAB9; /* 更深一點的奶油橘 */
  border-color: #FFB380;
  color: #007bff;
  box-shadow: 0 4px 15px rgba(255, 179, 128, 0.3);
}

/* 下拉選單 */
.dropdown {
  position: relative;
  width: 100%;
}

/* 下拉選單標題 */
.dropdown-title {
  background-color: #ffffff;
  color: #333;
  border: 2px solid #ccc;
  padding: 0.75rem 1.5rem;
  border-radius: 15px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

/* 下拉選單標題 hover */
.dropdown-title:hover {
  background-color: #FFDAB9; /* 更深一點的奶油橘 */
  border-color: #FFB380;
  color: #007bff;
  box-shadow: 0 4px 15px rgba(255, 179, 128, 0.3);
}

/* 隱藏下拉內容 */
.dropdown-content {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
}

/* 滑過標題時顯示下拉內容 */
.dropdown:hover .dropdown-content {
  display: flex;
}

/* 下拉選項 */
.dropdown-content button {
  background-color: #f9f9f9;
  color: #333;
  border: 2px solid #ddd;
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

/* 下拉選項 hover */
.dropdown-content button:hover {
  background-color: #FFE5B4; /* 與背景一致，強調溫暖感 */
  border-color: #FFB380;
  color: #007bff;
  box-shadow: 0 4px 15px rgba(255, 179, 128, 0.3);
}
</style>
