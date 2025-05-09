<template>
  <div class="navbar">
    <ul>
      <li>
        <router-link to="/">首頁</router-link>
      </li>
      <li>
        <router-link to="/caregivers/search">找看護</router-link>
      </li>
      <li>
        <router-link to="/news">新聞列表</router-link>
      </li>
      <li>
        <router-link to="/social">討論區</router-link>
      </li>
      <!-- Dropdown menu -->
      <li class="dropdown">
        <span class="dropdown-label">線上課程</span>
        <ul class="dropdown-menu">
          <li><router-link to="/course">課程列表</router-link></li>
          <li v-if="isUserLogin"><router-link to="/my-courses">我的課程</router-link></li>
        </ul>
      </li>
    </ul>

    <div class="login-button">
      <!-- ✅ 使用者登入後 -->
      <template v-if="isUserLogin">
        <div class="user-info">
          <!-- ✅ 純文字歡迎語 -->
          <span class="welcome-text" v-if="auth.user"
            >歡迎：{{ auth.user.userName }}</span
          >

          <!-- ✅ 點擊頭像導向個人資料頁 -->
          <router-link to="/user-center/profile" class="user-icon-wrapper">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="使用者頭像"
              class="user-icon"
              title="編輯個人資料"
            />
          </router-link>

          <button @click="userLogout" class="logout-button">登出</button>
        </div>
      </template>

      <!-- ✅ 照顧者登入後 -->
      <template v-else-if="isCaregiverLogin">
        <div class="user-info">
          <img src="@/assets/user-icon.png" alt="user" class="user-icon" />
          <span class="welcome">歡迎，{{ caregiver.email }}</span>
          <button @click="caregiverLogout" class="logout-button">登出</button>
        </div>
      </template>

      <!-- ✅ 都沒登入 -->
      <template v-else>
        <div class="dropdown-login">
          <button class="login-dropdown-btn">登入/註冊</button>
          <div class="dropdown-login-menu">
            <button @click="goUserLogin">一般用戶登入</button>
            <button @click="goCaregiverLogin">照服人員登入</button>
            <button @click="goAdminLogin">系統管理員登入</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

// ✅ 使用者：Session-based 登入狀態
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const isUserLogin = computed(() => auth.isAuthenticated);
const imageUrl = ref(null);
const fetchImage = async () => {
  try {
    const res = await fetch("http://localhost:8082/user/profile-picture", {
      credentials: "include",
    });
    if (res.ok) {
      const blob = await res.blob();
      imageUrl.value = URL.createObjectURL(blob);
    }
  } catch (e) {
    imageUrl.value = null;
  }
};

// ✅ 照顧者：JWT-based 登入狀態
import { useCaregiverAuth } from "@/stores/useCaregiverAuth";
const caregiver = useCaregiverAuth();
const isCaregiverLogin = computed(() => !!caregiver.token);

const router = useRouter();
const route = useRoute();

// 使用者登入狀態每次進入都確認（照顧者用 restoreLogin 不需要）
onMounted(() => {
  auth.checkAuth?.();
  if (auth.isAuthenticated && auth.user) {
    fetchImage(); // 只在使用者登入時取得頭像
  }
});

// 登入／登出事件
//使用者登入按鈕
const goUserLogin = () => router.push("/userlogin");
//照護者登入按鈕
const goCaregiverLogin = () => router.push("/caregiverLogin");
const goAdminLogin = () => router.push("/login-admin");

const userLogout = async () => {
  await auth.logout();
  router.push("/");
};

const caregiverLogout = () => {
  caregiver.logout();
  router.push("/");
};
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4db6ac;
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

/* 讓 dropdown 定位正確 */
.dropdown {
  position: relative;
}

/* 初始不顯示 */
.dropdown-menu {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  /* 改成你想要的底色 */
  padding: 0.5rem 0;
  margin: 0;
  border-radius: 4px;
  z-index: 999;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

/* hover 才顯示 */
.dropdown:hover .dropdown-menu {
  visibility: visible;
  opacity: 1;
}

/* 調整 span 樣式與 router-link 一致 */
.dropdown-label {
  color: #fff;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 4px;
}

/* hover 時出現箭頭 ⬇ */
.dropdown-label::after {
  content: "";
  margin-left: 0.3em;
  transition: transform 0.2s ease;
}

/* .dropdown:hover .dropdown-label::after {
  content: ' ⬇';
} */

/* hover 整塊變底色 */
.dropdown:hover .dropdown-label {
  background-color: rgba(255, 255, 255, 0.2);
}

.dropdown-menu li a {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  /* 改為深色字體以配合白底 */
  text-decoration: none;
}

.dropdown-menu li a:hover {
  background-color: #f0f0f0;
  /* hover 時的淺灰底色 */
  color: #000;
}

/* 當前路由（包含子路由）被點擊時套用 */
.active {
  background-color: rgba(255, 255, 255, 0.2); /* 半透明底色 */
  font-weight: bold; /* 加粗文字 */
  border-bottom: 2px solid #fff; /* 底線強調 */
}

/* 精確對應當前路由才套用 */
.active--exact {
  background-color: #ffffff33;
  color: #000 !important;
}

/* 登入區域 */
.login-button {
  display: flex;
  align-items: center;
}

.login-button button {
  margin-left: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.login-button .logout-button {
  background-color: #dc3545;
}

.welcome {
  color: white;
  margin-right: 0.5rem; /* 強制文字變黑，與底色對比 */
}

/* 手機垂直版 */
@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
  }

  .navbar ul {
    flex-direction: column;
    align-items: stretch;
  }

  .navbar li {
    margin: 0.25rem 0;
  }
}

.logout-button {
  margin-left: 0.5rem;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.welcome-text {
  color: #fff;
  font-weight: bold;
}
.user-icon-wrapper {
  display: inline-block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 0.5rem;
  vertical-align: middle;
  background-color: transparent;
  border: none;
}

.user-icon-wrapper:focus {
  outline: none;
  box-shadow: none;
}

.user-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border: none;
}

.dropdown-login {
  position: relative;
  display: inline-block;
}

.login-dropdown-btn {
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown-login-menu {
  display: none;
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 160px;
  border-radius: 6px;
  overflow: hidden;
  right: 0;
}

.dropdown-login-menu button {
  background-color: white;
  border: none;
  color: #333;
  padding: 10px 16px;
  text-align: left;
  width: 100%;
  cursor: pointer;
}

.dropdown-login-menu button:hover {
  background-color: #f0f0f0;
}

/* 顯示下拉選單 */
.dropdown-login:hover .dropdown-login-menu {
  display: block;
}
</style>
