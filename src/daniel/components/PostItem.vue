<template>
    <article class="post-item">

        <!-- 漢堡選單 -->
        <div class="menu-wrapper">
            <button class="hamburger-btn" @click.stop="toggleMenu">☰</button>
            <ul v-if="menuOpen" class="post-dropdown">
                <li @click="openEdit">編輯貼文</li>
                <li @click="confirmDelete">刪除貼文</li>
                <!-- 可以擴充更多選項 -->
            </ul>
        </div>

        <!-- 統一 PostFormModal 編輯／檢視模式 -->
        <PostFormModal :visible="isFormModalOpen" :post="post" @close="closeEdit" @saved="handleSaved" />

        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>

        <!-- 圖片列表 -->
        <div class="post-images" v-if="post.images && post.images.length">
            <img v-for="img in post.images" :key="img.imageId" :src="`data:image/jpeg;base64,${img.imageData}`"
                alt="Post Image" />
        </div>

        <!-- 留言列表 -->
        <CommentList :postId="post.postId" />

        <!-- 觀看次數 -->
        <small>{{ post.title }} (已觀看：{{ post.views }} 次)</small>

        <!-- 分享貼文 -->
        <button @click="sharePost">
            <small>分享 (已分享：{{ shareCount }} 次)</small>
        </button>

    </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'

import CommentList from '@/daniel/components/CommentList.vue'
import PostFormModal from '@/daniel/components/PostFormModal.vue'

const props = defineProps({ post: Object })
const emit = defineEmits(['refresh']) // 父層 PostList.vue 會用到
const shareCount = ref(props.post.share || 0)

//================= 漢堡選單 開始 =================
// 下拉選單狀態
const menuOpen = ref(false)
function toggleMenu() {
    menuOpen.value = !menuOpen.value
}
function closeMenu() {
    menuOpen.value = false
}
//================= 漢堡選單 結束 =================

//================= 編輯貼文 開始 =================
// PostFormModal 狀態
const isFormModalOpen = ref(false)
function openEdit() {
    toggleMenu()
    isFormModalOpen.value = true
}
function closeEdit() {
    isFormModalOpen.value = false
}
// 編輯或新增完成後
function handleSaved(updatedPost) {
    isFormModalOpen.value = false
    // 刷新當前貼文資料（包含標題、內容、images）
    props.post.title = updatedPost.title
    props.post.content = updatedPost.content
    if (updatedPost.images) props.post.images = updatedPost.images
    // 通知列表重載整體列表
    emit('refresh')
}
//================= 編輯貼文 結束 =================

//================= 刪除貼文 開始 =================
// 刪除貼文
async function confirmDelete() {
    menuOpen.value = false
    if (!window.confirm('確定要刪除此貼文？此操作無法復原')) return
    try {
        await myAxios.delete(`/api/posts/${props.post.postId}`)
        emit('refresh')
    } catch (err) {
        console.error('刪除貼文失敗', err)
        alert('刪除失敗，請稍後再試')
    }
}
//================= 刪除貼文 結束 =================

//================= 觀看次數 開始 =================
// 更新觀看次數
onMounted(async () => {
    try {
        await myAxios.post(`/api/posts/${props.post.postId}/view`)
    } catch (e) {
        console.error('更新觀看次數失敗', e)
    }
})
//================= 觀看次數 結束 =================

//================= 分享次數 開始 =================
// 更新分享次數
async function sharePost() {
    try {
        await navigator.share({
            title: props.post.title,
            text: props.post.content,
            url: window.location.href
        })
        await myAxios.post(`/api/posts/${props.post.postId}/share`)
        shareCount.value++
    } catch (e) {
        console.error('分享失敗或使用者取消', e)
    }
}
//================= 分享次數 結束 =================
</script>

<style scoped>
.post-item {
    position: relative;
    padding: 1rem;
    border-bottom: 1px solid #eee;
}
.menu-wrapper {
    position: absolute;
    top: 1rem;
    right: 1rem;
}
.hamburger-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
}
.post-dropdown {
    position: absolute;
    right: 0;
    top: 1.8rem;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    padding: 0.5rem 0;
    margin: 0;
    z-index: 10;
}
.post-dropdown li {
    padding: 0.5rem 1rem;
    cursor: pointer;
}
.post-dropdown li:hover {
    background: #f0f0f0;
}
.post-images {
    margin-bottom: 1em;
}
.post-images img {
    max-width: 100px;
    margin-right: 10px;
}
</style>