<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">

        <!-- 區塊 1：服務說明 -->
        <div class="footer-column">
          <h5 class="footer-title">服務說明</h5>
          <ul>
            <li><a href="#">平台介紹</a></li>
            <li><a href="#">服務中心</a></li>
            <li><a href="#">常見問題</a></li>
            <li><a href="#">聯絡我們</a></li>
          </ul>
        </div>

        <!-- 區塊 2：相關資訊 -->
        <div class="footer-column">
          <h5 class="footer-title">相關資訊</h5>
          <ul>
            <li><a href="#">使用條款</a></li>
            <li><a href="#">隱私權政策</a></li>
            <li><a href="#">著作權聲明</a></li>
            <li><a href="#">退費政策</a></li>
          </ul>
        </div>

        <!-- 區塊 3：CarePlus 團隊 -->
        <div class="footer-column">
          <h5 class="footer-title">CarePlus 團隊</h5>
          <ul>
            <li><a href="#">關於我們</a></li>
            <li><a href="#">里程碑</a></li>
            <li><a href="#">經營團隊</a></li>
            <li><a href="#">加入我們</a></li>
          </ul>
        </div>

        <!-- 區塊 4：課程導覽 -->
        <div class="footer-column">
          <h5 class="footer-title">課程導覽</h5>
          <ul>
            <li><a href="#">所有課程</a></li>
            <li><a href="#">課程分類</a></li>
            <li><a href="#">最新課程</a></li>
            <li><a href="#">熱門課程</a></li>
          </ul>
        </div>

        <!-- 區塊 5：社群與聯繫 -->
        <div class="footer-column">
          <h5 class="footer-title">關注我們</h5>
          <ul>
            <li><a href="#">客服信箱</a></li>
            <li><a href="#">LINE 官方帳號</a></li>
            <li><a href="#">Facebook 粉絲專頁</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom mt-4 text-center small text-muted">
        &copy; 2025 CarePlus 長照學習平台｜All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f9f9fb;
  border-top: 1px solid #e0e0e0;
}

.footer-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.footer-column ul {
  list-style: none;
  padding-left: 0;
}

.footer-column li {
  margin-bottom: 0.5rem;
}

.footer-column a {
  text-decoration: none;
  color: #555;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #007bff;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
  margin-top: 2rem;
}
</style>
