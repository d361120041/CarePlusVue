<template>

    <!-- 頁首 開始 -->
    <header>
        <h1>頁首</h1>
    </header>
    <!-- 頁尾 結束-->

    <!-- 導覽列 開始-->
    <nav>
        <Navigationbar></Navigationbar>
    </nav>
    <!-- 導覽列 結束-->

    <!-- 輪播圖 開始-->
    <!-- 輪播圖 結束-->

    <main>
        <RouterView></RouterView>
    </main>

    <!-- 頁尾 -->
    <footer>
        <h1>頁尾</h1>
    </footer>
    <!-- 頁尾 -->
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { RouterView, RouterLink } from 'vue-router'
import Navigationbar from '@/views/Navigationbar.vue';
</script>

<style scoped>

</style>