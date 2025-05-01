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
        <router-link to="/空白4">空白4</router-link>
      </li>
      <li>
        <router-link to="/course">線上課程</router-link>
      </li>
      <li>
        <router-link to="/social">討論區</router-link>
      </li>
    </ul>
    <div class="login-button">
      <!-- //更新登入後介面 -->
      <!-- 登入之前 -->
      <template v-if="!isAuthenticated">
        <button @click="goLogin">照顧者登入</button>
        <button @click="userLogin">使用者登入</button>
      </template>
      <!-- 登入之前 -->
      <!-- 使用者已登入：顯示歡迎文字 -->
      <template v-else>
        <span class="welcome-text">歡迎，老頭的家人： {{ userName }}</span>
        <button @click="logout" class="logout-button">登出</button>
      </template>
      <!-- 使用者已登入：顯示歡迎文字 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "@/plugins/axios";
const router = useRouter();
const route = useRoute();

/////////////////////////////////////看使用者有沒有登入 有的話就不顯示登入按鈕了///////////////////////////
const isAuthenticated = ref(false);
const userName = ref("");

// 登入後去抓後端 /user/profile
async function checkAuth() {
  try {
    const res = await axios.get("/user/profile");
    isAuthenticated.value = true;
    userName.value = res.data.userName;
  } catch {
    isAuthenticated.value = false;
    userName.value = "";
  }
}

onMounted(() => {
  checkAuth();
});

// 每次路由變動時也重新檢查
watch(
  () => route.fullPath,
  () => {
    checkAuth();
  }
);

const goLogin = () => {
  router.push("/caregiverLogin");
};

const userLogin = () => {
  router.push("/userLogin");
};

// 呼叫後端登出，並清除前端狀態
const logout = async () => {
  try {
    await axios.post("/user/logout");
  } catch {
    // ignore
  } finally {
    await checkAuth();
    router.push("/");
  }
};
/////////////////////////////////////看使用者有沒有登入 有的話就不顯示登入按鈕了///////////////////////////
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
  background-color: rgba(255, 255, 255, 0.2); /* 半透明底色 */
  font-weight: bold; /* 加粗文字 */
  border-bottom: 2px solid #fff; /* 底線強調 */
}

/* 精確對應當前路由才套用 */
.active--exact {
  background-color: #ffffff33; /* 較淡半透明底色 */
  color: #000 !important; /* 強制文字變黑，與底色對比 */
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
</style>
