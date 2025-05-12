<template>
    <footer class="footer-wrapper">
      <div class="footer-container">
        <!-- 三欄式資訊區 -->
        <div class="footer-columns">
          <!-- 區塊 1：服務說明 -->
          <div class="footer-column">
            <h5 class="footer-title">服務說明</h5>
            <ul>
              <li><router-link to="/guide">方案介紹</router-link></li>
              <li><router-link to="/support">服務中心</router-link></li>
            </ul>
          </div>
  
          <!-- 區塊 2：相關資訊 -->
          <div class="footer-column">
            <h5 class="footer-title">相關資訊</h5>
            <ul>
              <li><router-link to="/about">關於</router-link></li>
              <li><router-link to="/terms">使用條款</router-link></li>
              <li><router-link to="/privacy">隱私權政策</router-link></li>
              <li><router-link to="/copyright">著作權聲明</router-link></li>
            </ul>
          </div>
  
          <!-- 區塊 3：CarePlus 團隊 -->
          <div class="footer-column">
            <h5 class="footer-title">CarePlus 團隊</h5>
            <ul>
              <li><router-link to="/about-us">關於我們</router-link></li>
              <li><router-link to="/milestones">里程事蹟</router-link></li>
              <li><router-link to="/team">經營團隊</router-link></li>
              <li><router-link to="/join-us">加入我們</router-link></li>
            </ul>
          </div>
        </div>
  
        <!-- 版權區 -->
        <div class="footer-copyright">
          <small>Copyright©2025 CAREPLUS TAIWAN TEAM. ALL RIGHTS RESERVED.</small>
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer-wrapper {
    background-color: var(--color-bg-card);
    color: var(--color-text-primary);
    padding: 2rem 1rem 1rem;
    font-size: 0.875rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-container {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  
  .footer-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
  }
  
  .footer-column {
    flex: 1;
    min-width: 160px;
  }
  
  .footer-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: var(--color-text-primary);
  }
  
  .footer-column ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-column li {
    margin-bottom: 0.3rem;
  }
  
  .footer-column a {
    color: var(--color-text-tertiary);
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .footer-column a:hover {
    text-decoration: underline;
  }
  
  .footer-copyright {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.75rem;
    color: #999;
  }
  </style>
  