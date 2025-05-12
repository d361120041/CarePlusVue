<!-- src/components/GlobalBanner.vue -->
<template>
    <div class="global-banner" :style="{
        background: `
            linear-gradient(
            rgba(var(--color-bg-page-rgb), 0.6),
            rgba(var(--color-bg-page-rgb), 0.6)
        ),
            url(${imgSrc}) center/cover no-repeat
        `,
        padding: '6rem 0',
        width: '100%',
    }">
        <div class="banner-overlay text-center">
            <!-- slot 裡可以放標題、按鈕… -->
            <slot>
                <!-- 預設內容（若父元件沒提供 slot），可以空著也可以放 fallback -->
            </slot>
        </div>
    </div>
</template>

<script setup>
// 預設圖片：牽手圖
import defaultImg from '@/assets/images/GlobalBanner/nurse-holding-senior-man-s-hands-sympathy.jpg'

const props = defineProps({
    imgSrc: {
        type: String,
        default: defaultImg,
    },
})
</script>

<style scoped>
.global-banner {
    /* 背景與間距都透過 inline style 動態綁定 */
    position: relative;
}

.banner-overlay {
    position: relative;
    z-index: 1;
    /* 讓 slot 內容置中 */
    max-width: 800px;
    margin: 0 auto;
    color: var(--color-text-primary);
}

/* 若想讓背景有更暗的遮罩層， 可以再加一層偽元素： */
.global-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 0;
}
</style>