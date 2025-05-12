<template>
  <footer class="footer py-4">
    <div class="container">
      <div class="row row-cols-1 row-cols-md-5 g-4">

        <!-- 區塊 1：服務說明 -->
        <div class="footer-column">
          <h5 class="footer-title">服務說明</h5>
          <ul>
            <li>平台介紹</li>
            <li>服務中心</li>
            <li>常見問題</li>
            <li>聯絡我們</li>
          </ul>
        </div>

        <!-- 區塊 2：相關資訊 -->
        <div class="footer-column">
          <h5 class="footer-title">相關資訊</h5>
          <ul>
            <li>使用條款</li>
            <li>隱私權政策</li>
            <li>著作權聲明</li>
            <li>退費政策</li>
          </ul>
        </div>

        <!-- 區塊 3：CarePlus 團隊 -->
        <div class="footer-column">
          <h5 class="footer-title">CarePlus 團隊</h5>
          <ul>
            <li>關於我們</li>
            <li>里程碑</li>
            <li>經營團隊</li>
            <li>加入我們</li>
          </ul>
        </div>

        <!-- 區塊 4：課程導覽 -->
        <div class="footer-column">
          <h5 class="footer-title">課程導覽</h5>
          <ul>
            <li>所有課程</li>
            <li>課程分類</li>
            <li>最新課程</li>
            <li>熱門課程</li>
          </ul>
        </div>

        <!-- 區塊 5：社群與聯繫 -->
        <div class="footer-column">
          <h5 class="footer-title">關注我們</h5>
          <ul>
            <li>客服信箱</li>
            <li>LINE 官方帳號</li>
            <li>Facebook 粉絲專頁</li>
            <li>Instagram</li>
          </ul>
        </div>

      </div>

      <div class="text-center mt-4 small text-muted">
        &copy; 2025 CarePlus｜All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>


.footer {
  background-color: #FFFFFF;
}

.footer-column {
  flex: 1;
}
.footer-title {
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.footer-column ul {
  list-style: none;
  padding: 0;
}
.footer-column li {
  margin-bottom: 0.5rem;
}
.footer-column a {
  text-decoration: none;
  color: #333;
}
.footer-column a:hover {
  color: #007bff;
}
</style>
