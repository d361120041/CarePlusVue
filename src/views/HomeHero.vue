<template>
    <div class="hero-font" >
        <GlobalBanner :imgSrc="homeBannerImg">
            <section class="hero-section">
                <div class="container text-center">
                    <h1>照護更簡單，陪伴更長久</h1>
                    <p>一Care+用心守護每一刻，讓愛與關懷更貼近</p>
                    <router-link to="/caregivers/search" class="button-green">
                        立即找看護
                    </router-link>
                    <!-- <router-link to="/course" class="button-pink">
                        探索課程
                    </router-link> -->
                </div>
            </section>
        </GlobalBanner>
    
        <!-- rita -->
        <div>
            <div>
                <Rita />
            </div>
        </div>
        <!-- rita -->
    
        <!-- allen: 新聞預覽區塊 -->
        <!-- 最新消息標籤 -->
        <div style="background-color: #fff0de;" class="news-preview-container">
            <!-- 單一新聞卡片 -->
            <router-link v-for="news in previewNews.slice(0, 3)" :key="news.newsId" :to="`/news/${news.newsId}`"
                class="news-preview-card">
                <img :src="getFullImageUrl(news.thumbnail)" alt="新聞圖片" class="news-image" @error="handleImgError" />
    
                <div class="news-content">
                    <h3 class="news-title">{{ news.title }}</h3>
                    <p class="news-date">發布日期：{{ news.publishAt }}</p>
                    <p class="news-views">瀏覽次數：{{ news.viewCount }}</p>
                </div>
            </router-link>
    
            <router-link to="/news" class="news-preview-card">
                <img :src="moreNewsImage" alt="更多新聞圖片" class="news-image" />
                <div class="news-content">
                    <h3 class="more-news-title">更多新聞....</h3>
                </div>
            </router-link>
        </div>
        <!-- allen end-->
    
        <!-- yuni -->
        <div>
            <div>
                <CourseFeat />
            </div>
        </div>
        <!-- yuni -->
    </div>
</template>

<script setup>
import GlobalBanner from '@/components/GlobalBanner.vue'
import homeBannerImg from '@/assets/images/GlobalBanner/mediums-hot-smiley-people-indoors.webp'

// -----Rita start
import Rita from '@/rita/components/Introduction.vue';

// ------yuni start
import CourseFeat from '@/yuni/components/CourseFeat.vue';
// ------yuni end

// ------allen start
import { ref, onMounted } from 'vue';
import myAxios from '@/plugins/axios';
import { getFullImageUrl } from '@/allen/utils/urlHelper';
import { useRouter } from "vue-router";
import moreNewsImage from '@/assets/allen/more_news.png';

const previewNews = ref([]);
const loading = ref(false);

//時間格式化
const formatDate = (datetime) => {
  if (!datetime) return '';

  const date = new Date(datetime);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

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
        const response = await myAxios.post(`/news/public/search?page=0&size=3&sort=publishAt,DESC`, params);
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
.hero-font {
    font-size: 28px;
}

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

/*allen start*/
.news-content {
    text-align: center;
    padding: 8px 0;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.news-list-container {
    background-color: var(--color-bg-page);
}

.news-header {
    display: flex;
    align-items: center;
    background: var(--color-btn-primary-bg);
    padding: 12px 20px;
    border-radius: var(--radius-pill);
    color: var(--color-btn-primary-text);
    font-weight: bold;
    font-size: var(--font-size-xl);
    margin-bottom: 24px;
    width: 180px;
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
    gap: 24px;
    padding: 24px 48px;
}

.news-preview-card {
    flex: 0 0 380px;
    max-width: 380px;
    height: 380px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    transition: transform 0.3s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

.news-preview-card:hover {
    transform: scale(1.05);
}

.news-image {
    width: 100%;
    max-width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
}

.news-content {
    width: 100%;
    /* 讓它與 .news-preview-card 同寬 */
    max-width: 348px;
    /* 與 .news-preview-card - padding */
    padding: 8px 0;
    position: relative;
    flex-grow: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.news-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.4;
    max-height: calc(1.4em * 2);
    font-size: var(--font-size-lg);
    margin-bottom: 16px;
    margin-top: 40px;
    /* 向下移動 40px */
    z-index: 1;
}

.more-news-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.4;
    max-height: calc(1.4em * 2);
    font-size: var(--font-size-xxl);
    /* 調整為較大字體 */
    font-weight: bold;
    margin-bottom: 16px;
    margin-top: 32px;
    /* 與圖片間距 */
    z-index: 1;
    text-align: center;
}

.news-date,
.news-views {
    font-size: 1rem;
    color: #555555;
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
}

.news-date {
    bottom: 36px;
}

.news-views {
    bottom: 10px;
}

/* allen end */
</style>