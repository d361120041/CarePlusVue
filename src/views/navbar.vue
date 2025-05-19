<template>
    <div class="navbar">
        <router-link to="/" class="logo">
            <img src="@/assets/logo/care+_logo.png" alt="網站 Logo" />
        </router-link>
        <ul>
            <li @mouseenter="showCharacter('caregiver')" @mouseleave="hideCharacter('caregiver')">
                <router-link to="/caregivers/search">照護服務</router-link>
                <img src="@/assets/caregiver_walk.png" alt="caregiver" class="character" ref="caregiver" />
            </li>
            <li @mouseenter="showCharacter('course')" @mouseleave="hideCharacter('course')">
                <router-link to="/course">課程資訊</router-link>
                <img src="@/assets/course_walk.png" alt="course" class="character" ref="course" />
            </li>
            <li @mouseenter="showCharacter('news')" @mouseleave="hideCharacter('news')">
                <router-link to="/news">新聞列表</router-link>
                <img src="@/assets/news_walk.png" alt="news" class="character" ref="news" />
            </li>
            <li @mouseenter="showCharacter('social')" @mouseleave="hideCharacter('social')">
                <router-link to="/social">貼文互動</router-link>
                <img src="@/assets/social_walk.png" alt="social" class="character" ref="social" />
            </li>
        </ul>

        <div class="login-button">
            <!-- ✅ 使用者登入後 -->
            <template v-if="isUserLogin">
                <div class="user-info">
                    <!-- ✅ 純文字歡迎語 -->
                    <router-link to="/user-center/profile" class="user-icon-wrapper">
                        <img v-if="imageUrl" :src="imageUrl" alt="使用者頭像" class="user-icon" title="編輯個人資料" />
                        <img v-else src="@/assets/defaultImg/default-avatar.jpg" alt="預設頭像" class="user-icon"
                            title="編輯個人資料" />
                    </router-link>

                    <span class="welcome-text" v-if="auth.user">
                        歡迎：{{ auth.user.userName }}
                    </span>

                    <button @click="userLogout" class="logout-button" style="font-size: 1.25rem">
                        登出
                        <span style="font-size: 1.5rem">⍈</span>
                    </button>
                </div>
            </template>

            <!-- ✅ 照顧者登入後 -->
            <!-- Navbar.vue -->
            <template v-else-if="isCaregiverLogin">
                <div class="user-info">
                    <router-link to="/caregiver" class="user-icon-wrapper">
                        <!-- ✅ 確保從 Pinia 取得 photo -->
                        <img v-if="caregiver.photo" :src="caregiver.photo" alt="照顧者大頭貼" class="avatar" />
                    </router-link>
                    <span class="welcome">歡迎，{{ caregiver.email }}</span>
                    <button @click="caregiverLogout" class="logout-button">登出</button>
                </div>
            </template>

            <!-- ✅ 都沒登入 -->
            <template v-else>
                <div class="dropdown-login">
                    <button class="login-dropdown-btn">登入 / 註冊</button>
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
import { useCaregiverAuth } from "@/stores/useCaregiverAuth";
// ✅ 使用者：Session-based 登入狀態
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const imageUrl = computed(() => auth.userPhotoUrl);
const isUserLogin = computed(() => auth.isAuthenticated);
// const imageUrl = ref(null);
// const fetchImage = async () => {
//   try {
//     const res = await fetch("http://192.168.66.54:8082/user/profile-picture", {
//       credentials: "include",
//     });
//     if (res.ok) {
//       const blob = await res.blob();
//       imageUrl.value = URL.createObjectURL(blob);
//     }
//   } catch (e) {
//     imageUrl.value = null;
//   }
// };
const goToCaregiverPage = () => {
    router.push("/caregiver"); // ⬅️ 改成你想導向的網址
};

// ✅ 照顧者：JWT-based 登入狀態

const caregiver = useCaregiverAuth();
const isCaregiverLogin = computed(() => !!caregiver.token);

const router = useRouter();
const route = useRoute();

// 使用者登入狀態每次進入都確認（照顧者用 restoreLogin 不需要）
onMounted(async () => {
    auth.checkAuth?.();
    caregiver.restoreLogin();
    await caregiver.restoreLogin();
    // 確保初次登入同步
    if (!caregiver.email || !caregiver.photo) {
        caregiver.fetchProfile(); // **✅ 新增：如果 email 或 photo 不存在，就強制同步**
    }

    console.log("✅ 初始化 - token:", caregiver.token);
    console.log("✅ 初始化 - email:", caregiver.email);
    console.log("✅ 初始化 - photo:", caregiver.photo);
});

// const fetchCaregiverPhoto = async () => {
//   try {
//     const res = await fetch(`http://localhost:8082/api/auth/caregiver/photo?email=${caregiver.email}`, {
//       headers: {
//         Authorization: `Bearer ${caregiver.token}`
//       }
//     })
//     if (res.ok) {
//       const blob = await res.blob()
//       caregiverPhotoUrl.value = URL.createObjectURL(blob)
//     } else {
//       caregiverPhotoUrl.value = null
//     }
//   } catch (err) {
//     console.error('載入大頭貼失敗', err)
//   }
// }
const showCharacter = (character) => {
    const charEl = document.querySelector(`[alt="${character}"]`);
    if (charEl) {
        charEl.style.opacity = 1;
        charEl.style.animation = "walk-across 2s linear forwards";
    }
};

const hideCharacter = (character) => {
    const charEl = document.querySelector(`[alt="${character}"]`);
    if (charEl) {
        charEl.style.opacity = 0;
        charEl.style.animation = "none";
    }
};
// 登入／登出事件
//使用者登入按鈕
const goUserLogin = () => router.push("/userlogin");
//照護者登入按鈕
const goCaregiverLogin = () => router.push("/caregiverLogin");
const goAdminLogin = () => {
    window.open("/login-admin", "_blank");
};

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
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #f0f0f0;
    /* ✅ 預防沒有圖片時顯示空白 */
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* ✅ 修改：原本是 align-items: stretch，改成 center 讓內容垂直置中 */
    background-color: #fff8f0;
    padding: 0;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 80px;
    font-size: 26px;
    margin-top: 10px;
}

/* ----- Logo 開始 ----- */
.logo {
    transition: none !important;
    background-color: transparent !important;
    /* ✅ 移除背景 */
    padding: 0;
    /* ✅ 移除多餘 padding */
    margin: -15px 0 0 0;
    /* ✅ 向上移動 15px */
    width: 200px;
    /* ✅ 控制整體寬度 */
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ----- Logo 大小設定 ----- */
.logo img {
    height: 150px;
    /* ✅ 調整圖片高度 */
    max-width: 200px;
    /* ✅ 調整最大寬度 */
    object-fit: contain;
    margin: 0;
    /* ✅ 移除多餘 margin */
    transition: none !important;
    transform: none !important;
    box-shadow: none !important;
}

.logo:hover,
.logo img:hover {
    background-color: transparent !important;
    transform: none !important;
    box-shadow: none !important;
}

/* ----- Logo 結束 ----- */

/* ----- User 開始 -----*/
.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    /* ✅ 新增：加入項目間距避免黏在一起 */
    flex-wrap: nowrap;
    /* ✅ 新增：避免元素換行擠到下一層 */
    position: relative;
    /* ✅ 新增：防止 logout button 意外蓋住其他元素 */
}

.user-icon {
    width: 36px;
    /* ✅ 修改：原本是 32px */
    height: 36px;
    /* ✅ 修改：原本是 32px */
    border-radius: 50%;
    overflow: hidden;
    background-color: transparent;
    border: none;
    flex-shrink: 0;
    /* ✅ 新增：防止太小畫面被擠爆 */
}

/* ----- User 結束 -----*/

/* ----- Menu Items ----- */
.navbar ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 2rem;
    align-items: center;
}

.navbar li {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 1rem;
}

.navbar ul li {
    position: relative;
    display: flex;
    align-items: center;
}

.navbar a,
.navbar .dropdown-label {
    display: flex;
    align-items: center;
    height: 100%;
    color: var(--color-text-primary);
    text-decoration: none;
    padding: 0 0.5rem;
    border-radius: 4px;
    transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.character {
    position: absolute;
    bottom: 0;
    left: -20px;
    width: 50px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 10;
}

@keyframes walk-across {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(150%);
    }
}

.navbar ul li a {
    display: flex;
    align-items: center;
    height: 50px;
    /* ✅ 控制整個區域的高度 */
    padding-left: 10px;
    /* ✅ 增加一點內距避免重疊 */
}

.navbar a:hover,
.navbar .dropdown-label:hover,
.navbar li.active>a,
.navbar li.active--exact>a {
    /* background-color: rgba(0, 0, 0, 0.05); */
    color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.1);
}

/* ----- Navbar 結束 ----- */

/* ----- yuni 開始 -----
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
    color: var(--color-text-primary);
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
    color: #4db6ac;
}

/* ----- yuni 結束 -----

/* 當前路由（包含子路由）被點擊時套用 */
.active {
    background-color: #fff8f0;
    /* 半透明底色 */
    font-weight: bold;
    /* 加粗文字 */
    /* border-bottom: 2px solid #fff8f0; */
    /* 底線強調 */
}

/* 精確對應當前路由才套用 */
.active--exact {
    background-color: #fff8f0;
    color: #000 !important;
}

/* ----- 登入 開始 ----- */
/* 登入區域 */
.login-button {
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    /* ✅ 微調右邊距離 */
    padding-top: 10px;
    /* ✅ 增加一點上內距讓按鈕更居中 */
    padding-bottom: 10px;
    /* ✅ 確保上下對稱 */
    height: 100%;
    /* ✅ 與 navbar 高度一致 */
    margin-top: -5px;
}

.login-button button {
    margin-left: 1rem;
    background-color: #4db6ac;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 80%;
}

.login-button .logout-button {
    background-color: #dc3545;
    font-size: 80%;
}

.welcome {
    color: rgb(7, 7, 7);
    margin-right: 0.5rem;
    /* 強制文字變黑，與底色對比 */
}

/* ----- 登入 結束 ----- */

/* ===== RWD 開始 ===== */
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

/* ----- user ----- */
.logout-button {
    background-color: #dc3545;
    /* ✅ 修改：原本是 transparent，改為明確紅色背景 */
    color: white;
    border: none;
    /* ✅ 修改：原本有白框，改為無邊框更簡潔 */
    padding: 6px 12px;
    /* ✅ 修改：調整 padding 更好看 */
    border-radius: 6px;
    font-size: 14px;
    /* ✅ 新增：統一文字大小 */
    white-space: nowrap;
    /* ✅ 新增：防止文字換行 */
    cursor: pointer;
    flex-shrink: 0;
    /* ✅ 新增：防止被壓縮過窄 */
}

.logout-button:hover {
    background-color: #dd4857;
    /* ✅ 新增：hover 效果更明顯 */
}

.welcome {
    color: rgb(7, 7, 7);
    margin-right: 0.5rem;
    font-size: 18px;
    /* ✅ 調整文字大小 */
    font-weight: normal;
    /* ✅ 取消加粗 */
}

/* 頭像容器 */
.user-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 0.5rem;
    background-color: transparent;
    border: none;
    /* flex-shrink: 0; ✅ 新增：防止太小畫面被擠爆 */
}

.user-icon-wrapper:focus {
    outline: none;
    box-shadow: none;
}

.user-icon {
    width: 130%;
    /* ✅ 剛好填滿容器 */
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid #ccc;
}

/* ----- login ----- */
.dropdown-login {
    position: relative;
    display: inline-block;
    z-index: 10;
    padding-bottom: 20px;
    /* ✅ 增加 padding 讓 hover 區域更大 */
}

.login-dropdown-btn {
    background-color: #28a745;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    /* ✅ 調整下移距離 */
}


.login-dropdown-btn:hover {
    background-color: #218838;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}



.dropdown-login-menu {
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 999;
    min-width: 200px;
    border-radius: 12px;
    overflow: hidden;
    right: 0;
    margin-top: 10px;
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
    visibility: hidden;
}

/* 滑入顯示 */
.dropdown-login:hover .dropdown-login-menu,
.dropdown-login-menu:hover {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.dropdown-login-menu button {
    background: none;
    border: none;
    color: #333;
    padding: 12px 20px;
    text-align: left;
    width: 100%;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}



.dropdown-login-menu button:hover {
    background-color: #f5f5f5;
    color: #00796b;
}

.dropdown-login-menu:hover {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    visibility: visible;
}

.dropdown-login-menu button:first-child {
    border-radius: 12px 12px 0 0;
}

.dropdown-login-menu button:last-child {
    border-radius: 0 0 12px 12px;
}

/* 顯示下拉選單 */
.dropdown-login:hover .dropdown-login-menu {
    display: block;
}


/* ===== RWD 結束 ===== */
</style>
