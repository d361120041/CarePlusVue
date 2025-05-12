<template>
    <GlobalBanner :imgSrc="homeBannerImg">
        <section class="hero-section">
            <div class="container text-center">
                <h1>歡迎來到 Care+ 照護平台</h1>
                <p>一站式長期照護解決方案…</p>
                <router-link to="/caregivers/search" class="button-green">
                    立即找看護
                </router-link>
                <router-link to="/course" class="button-pink">
                    探索課程
                </router-link>
            </div>
        </section>
    </GlobalBanner>

    <!-- allen: 新聞預覽區塊 -->
    <!-- 最新消息標籤 -->
    <br>
    <div class="news-header" @click="goToNews">
        <span class="news-icon">📢</span>
        <span class="news-title">最新消息</span>
    </div>

    <div class="news-preview-container">
        <div v-for="news in previewNews" :key="news.newsId" class="news-preview-card">
            <router-link :to="`/news/${news.newsId}`" class="news-link">
                <img :src="getFullImageUrl(news.thumbnail) || defaultThumbnail" alt="新聞圖片" class="news-image"
                    @error="handleImgError" />
            </router-link>

            <div class="news-content">
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-date">發布日期：{{ news.publishAt }}</p>
                <p class="news-views">瀏覽次數：{{ news.viewCount }}</p>
            </div>
        </div>
    </div>
    <!-- allen -->

    <!-- rita -->
    <div >
        <div>
            <Rita />
        </div>
    </div>


    <!-- yuni -->
    <div>
        <div>
            <CourseFeat />
        </div>
    </div>
    <!-- yuni -->


</template>

<script setup>
import GlobalBanner from '@/components/GlobalBanner.vue'
import homeBannerImg from '@/assets/images/GlobalBanner/mediums-hot-smiley-people-indoors.jpg'

// -----Rita start
import Rita from '@/yuni/components/Rita.vue';

// ------yuni start
import CourseFeat from '@/yuni/components/CourseFeat.vue';
// ------yuni end

// ------allen start
import { ref, onMounted } from 'vue';
import myAxios from '@/plugins/axios';
import { getFullImageUrl } from '@/allen/utils/urlHelper';
import { useRouter } from "vue-router";

const previewNews = ref([]);
const defaultThumbnail = '/src/assets/allen/no-image.jpg';
const loading = ref(false);

//按鈕導到新聞首頁
const router = useRouter();
const goToNews = () => {
    router.push('/news');
};

// 圖片錯誤處理
const handleImgError = (event) => {
    event.target.src = defaultThumbnail;
};

// 取得前三筆新聞
const fetchNews = async () => {
    loading.value = true;
    const params = {
        keyword: null,
        categoryId: null,
        dateFrom: null,
        dateTo: null
    };

    try {
        const response = await myAxios.post(`/news/public/search?page=0&size=4&sort=publishAt,DESC`, params);
        previewNews.value = response.data.content;
    } catch (error) {
        console.error('取得新聞預覽失敗:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchNews();
});
// ------allen end
</script>

<style scoped>
.hero-section {
    color: var(--color-text-primary);
    padding: 6rem 0;
}

.hero-section h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-section p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
}

/* allen start*/
.news-header {
    display: flex;
    align-items: center;
    background: var(--color-btn-primary-bg);
    /* 大圓角 */
    padding: 12px 20px;
    border-radius: var(--radius-pill);
     /* 字體字型 */
    color: var(--color-btn-primary-text);
    font-weight: bold;
    font-size: var(--font-size-xl);
    /*按鈕大小*/
    margin-bottom: 24px;
    width: 180px;
    /**/
    user-select: none;
    cursor: pointer;
    transition: background-color var(--transition-medium), box-shadow var(--transition-medium), transform var(--transition-fast);
}
.news-header:hover {
  background-color: var(--color-btn-primary-bg-hover);
  box-shadow: var(--shadow-lg);
  transform: scale(1.05);
}

.news-icon {
    margin-right: 8px;
    font-size: 1.4rem;
}

.news-preview-container {
    display: flex;
    justify-content: center;
    /* 置中對齊 */
    gap: 24px;
    /* 間距縮小 */
    padding: 24px 48px;
    /* 上下留白加大 */
    background-color: #f9f9f9;
}

.news-preview-card {
    flex: 0 0 320px;
    /* 卡片寬度固定 */
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    transition: transform 0.3s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 400px;
    /* 高度調整 */
}

.news-preview-card:hover {
    transform: scale(1.05);
}

.news-image {
    width: 100%;
    max-width: 280px;
    /* 放大圖片 */
    height: 180px;
    /* 調整圖片高度 */
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 16px;
}

.news-content {
    text-align: center;
    padding: 8px 0;
}

.news-date,
.news-views {
    font-size: 1rem;
    /* 字體加大 */
    color: #555555;
    margin-bottom: 4px;
}

/* allen end*/
</style>