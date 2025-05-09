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
</template>

<script setup>
import GlobalBanner from '@/components/GlobalBanner.vue'
import homeBannerImg from '@/assets/images/GlobalBanner/mediums-hot-smiley-people-indoors.jpg'
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
</style>