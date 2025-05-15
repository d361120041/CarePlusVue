<template>
  <div class="sidebar">
    <h1> 我的工作平台</h1>
    <div class="menu-items">
      <!-- 📊 統計總覽 -->
      <button @click="go('/caregiver')">首頁</button>

      <!-- 📝 個人資訊管理 -->
      <div class="dropdown">
        <button class="dropdown-title">👤 個人資訊管理</button>
        <div class="dropdown-content">
          <button @click="go('/caregiver/profile')"> 編輯個人資料</button>
          <button @click="go('/caregiver/pricing')"> 可服務區域與收費設定</button>
        </div>
      </div>

      <!-- 其他選項 -->
      <button @click="go('/caregiver/orderss')"> 我的訂單紀錄</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const go = (path) => {
  console.log(`Navigating to: ${path}`);
  router.push(path);
};
</script>


<style scoped>
.sidebar {
  width: 220px;
  background-color: #FFF4E0; /* 更輕柔的奶油色 */
  color: #333;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
  border-radius: 0 15px 15px 0;
  font-family: "Noto Sans TC", Arial, sans-serif;
}

.sidebar h1 {
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 2px solid #FFE5B4;
  padding-bottom: 0.5rem;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 主選單按鈕 */
.menu-items button {
  background-color: #ffffff;
  color: #333;
  border: 1.5px solid #ddd;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
  width: 100%;
}

/* 主選單按鈕 hover */
.menu-items button:hover {
  background-color: #FFEDCC; /* 更柔和的奶油橘 */
  border-color: #FFB380;
  color: #007bff;
  box-shadow: 0 4px 12px rgba(255, 179, 128, 0.25);
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
  border: 1.5px solid #ddd;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

/* 下拉選單標題 hover */
.dropdown-title:hover {
  background-color: #FFEDCC; 
  border-color: #FFB380;
  color: #007bff;
  box-shadow: 0 4px 12px rgba(255, 179, 128, 0.25);
}

/* 隱藏下拉內容 */
.dropdown-content {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
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
  border: 1.5px solid #ddd;
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

/* 下拉選項 hover */
.dropdown-content button:hover {
  background-color: #FFE5B4;
  border-color: #FFB380;
  color: #007bff;
  box-shadow: 0 4px 12px rgba(255, 179, 128, 0.25);
}
</style>

