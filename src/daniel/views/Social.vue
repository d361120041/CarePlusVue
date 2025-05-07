<template>
    <div class="social-layout">
        <!-- 左側貼文篩選欄 -->
        <aside class="filter-sidebar">
            <h3 class="sidebar-title">你想找什麼？</h3>
            <div class="categories">
                <button v-for="cat in categoryStore.categories" :key="cat.id"
                    @click="categoryStore.toggleCategory(cat.id)" :class="{
                        'category-btn': true,
                        active: categoryStore.selectedIds.includes(cat.id),
                    }">
                    {{ cat.name }}
                </button>
            </div>
        </aside>

        <!-- 主要貼文區塊 -->
        <PostMain />
    </div>
</template>

<script setup>
import { useCategoryStore } from '@/daniel/stores/categories.js'
import PostMain from '@/daniel/components/post/PostMain.vue'

const categoryStore = useCategoryStore()
</script>

<style scoped>
.social-layout {
    display: grid;
    grid-template-columns: 1fr min(80ch, 100%) 1fr;
    gap: 1rem;
}

.filter-sidebar {
    background: #fff;
    padding: 1rem;
    margin: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    justify-self: center;
    font-size: 0.9rem;
    max-width: 20vw;
}

.sidebar-title {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
}

.categories {
    display: inline-box;
    /* text-align: center; */
}

.category-btn {
    padding: 0.2rem 0.5rem;
    margin: 0.2rem 0.5rem;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background: #f0f0f0;
    transition: all 0.2s;
    font-weight: 500;
}

.category-btn:hover {
    background: #e0e0e0;
}

.category-btn.active {
    background: #007bff;
    color: #fff;
    border-color: #0056b3;
    transform: scale(1.05);
}
</style>
