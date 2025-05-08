<template>
    <section class="hero-section">
        <div class="container text-center">
            <h1>歡迎來到 Care+ 照護平台</h1>
            <p>一站式長期照護解決方案…</p>
            <router-link to="/caregivers/search" class="btn btn-primary me-3">
                立即找看護
            </router-link>
            <router-link to="/course" class="btn btn-outline-secondary">
                探索課程
            </router-link>
        </div>
    </section>
</template>

<style scoped>
.hero-section {
    background: linear-gradient(rgba(var(--color-bg-page)), var(--color-bg-page)),
        url('@/assets/hero_bg.jpg') center/cover no-repeat;
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