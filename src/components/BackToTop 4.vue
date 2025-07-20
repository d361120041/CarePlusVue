<template>
    <!-- 只有捲動超過 200px 時才顯示按鈕 -->
    <button v-show="visible" @click="scrollToTop" class="back-to-top" aria-label="回到頂端">
        ↑
    </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const visible = ref(false);

// 滾動事件處理
const handleScroll = () => {
    visible.value = window.pageYOffset > 200;
};

// 點擊時平滑滾回頂端
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 50%;
    background-color: var(--color-btn-tertiary-bg);
    color: var(--color-btn-tertiary-text);
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s, opacity 0.2s;
    opacity: 0.7;
    z-index: 2000;
}

.back-to-top:hover {
    transform: scale(1.1);
    opacity: 1;
}
</style>
