<template>
    <div class="success-page">
      <h2>✅ 驗證成功</h2>
      <p>感謝您的註冊，請返回登入頁面開始使用！</p>
      <router-link to="/caregiverLogin">
        <button>前往登入</button>
      </router-link>
    </div>
  </template>
  
  <style scoped>
  .success-page {
    max-width: 600px;
    margin: 5rem auto;
    text-align: center;
  }
  .success-page button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
  }
  </style>
  