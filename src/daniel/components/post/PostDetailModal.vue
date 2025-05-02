<template>
    <BaseModal :visible="visible" :title="`${post.user.userName}的貼文`" @close="$emit('close')">
        <div class="post-detail">
            <div class="post-header">
                <!-- 使用者資訊區塊 -->
                <img class="user-avatar" :src="currentUser.avatarUrl" alt="User Avatar" />
                <!-- <img class="user-avatar" :src="post.user.profilePicture" alt="User Avatar" /> -->
                <div class="user-info">
                    <div class="user-name">{{ post.user.userName }}</div>
                    <div class="post-time">{{ formattedTime }}</div>
                </div>

                <!-- 漢堡選單 -->
                <div class="menu-wrapper">
                    <button class="hamburger-btn" @click.stop="toggleMenu">⋯</button>
                    <ul v-if="menuOpen" class="post-dropdown">
                        <li @click="openEdit">編輯貼文</li>
                        <li @click="confirmDelete">刪除貼文</li>
                    </ul>
                </div>
            </div>

            <!-- PostFormModal 編輯/檢視模式 -->
            <PostFormModal :visible="isFormModalOpen" :post="post" @close="closeEdit" @saved="handleSaved" />

            <!-- 貼文內容 -->
            <h2>{{ post.title }}</h2>
            <div class="post-content">
                <p>{{ post.content }}</p>
            </div>

            <!-- 圖片列表 -->
            <div class="post-images" v-if="post.images && post.images.length">
                <img v-for="(img, idx) in post.images" :key="img.imageId"
                    :src="`data:image/jpeg;base64,${img.imageData}`" alt="Post Image" @click="showImage(idx)"
                    class="clickable-img" />
            </div>

            <!-- vue-easy-lightbox -->
            <vue-easy-lightbox :visible="lightboxVisible" :imgs="imgs" :index="currentIndex" @hide="hideLightbox" />

            <!-- 觀看次數 -->
            <div style="text-align: right;">
                <small>觀看次數{{ post.views }}次</small>
            </div>

            <!-- 貼文動作列 -->
            <div class="post-actions">
                <button class="action-btn"> <!-- @click="likePost" -->
                    👍 按讚<!-- ({{ likeCount }}) -->
                </button>
                <button class="action-btn"> 💬 留言</button>
                <button class="action-btn" @click="sharePost">
                    🔗 分享 ({{ shareCount }})
                </button>
            </div>

            <!-- 留言列表 -->
            <div v-if="post.comments && post.comments.length">
                <CommentList ref="commentList" :postId="post.postId" class="comment-list" />
            </div>

            <!-- 留言表單 -->
            <div class="comment-form-wrapper">
                <CommentForm :postId="post.postId" @added="onCommentAdded" />
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'
import VueEasyLightbox from 'vue-easy-lightbox'

import BaseModal from '@/daniel/components/BaseModal.vue'
import PostFormModal from '@/daniel/components/post/PostFormModal.vue'
import CommentList from '@/daniel/components/comment/CommentList.vue'
import CommentForm from '@/daniel/components/comment/CommentForm.vue'

const props = defineProps({
    visible: Boolean,
    post: Object
})
const emit = defineEmits(['close', 'refresh'])

import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
const { formattedTime } = useTimeFormat(props.post.createdAt)

import { useToggle } from '@/daniel/composables/useToggle'
const [menuOpen, toggleMenu] = useToggle(false)

//================= ref, computed 開始 =================
// 使用者資訊區塊
const currentUser = ref({
    // avatarUrl: '/circle-user-regular.svg'
    avatarUrl: '/circle-user-solid.svg'
    // avatarUrl: '/user-regular.svg'
    // avatarUrl: '/user-solid.svg'
})
// PostFormModal 編輯/檢視模式
const isFormModalOpen = ref(false)
// 貼文動作列
const isDetailOpen = ref(false)
const shareCount = ref(props.post.share || 0)
// 評論清單
const commentList = ref(null)
//================= ref, computed 結束 =================

//================= 漢堡選單 開始 =================
// 下拉選單狀態
function closeMenu() {
    menuOpen.value = false
}
//================= 漢堡選單 結束 =================

//================= 編輯貼文 開始 =================
// PostFormModal 狀態
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

// ================= Lightbox 開始 =================
// Lightbox 狀態：visible 控制顯示，imgs 是圖片陣列，index 是預設開啟的那張
const lightboxVisible = ref(false)
const imgs = computed(() => props.post.images.map(img => `data:image/jpeg;base64,${img.imageData}`))
const currentIndex = ref(0)

// 開啟 Lightbox
function showImage(idx) {
    currentIndex.value = idx
    lightboxVisible.value = true
    console.log(`props.post.images->`, props.post.images)
}

// 關閉 Lightbox
function hideLightbox() {
    lightboxVisible.value = false
}
// ================= Lightbox 結束 =================

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

function onCommentAdded() {
    // 當表單送出後，刷新留言清單
    if (commentList.value && typeof commentList.value.reloadComments === 'function') {
        commentList.value.reloadComments()
    }
}
</script>

<style scoped>
.post-detail {
    /* 讓裡面 sticky 生效 */
    max-height: 70vh;
    overflow-y: auto;
    position: relative;
}

.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.75rem;
}

.user-info {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
}

.user-name {
    font-weight: bold;
}

.post-time {
    font-size: 0.8rem;
    color: #666;
}

.menu-wrapper {
    position: absolute;
    top: 1rem;
    right: 1rem;
}

.hamburger-btn {
    background: none;
    border: none;
    font-size: 1rem;
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
    background: #c7a0a0;
}

.post-content {
    white-space: pre-wrap;
    word-break: break-word;
}

.post-images {
    margin-bottom: 1em;
}

.post-images img {
    max-width: 100px;
    margin-right: 0.5rem;
}

.post-images img.clickable-img {
    cursor: pointer;
    transition: transform .2s;
}

.post-images img.clickable-img:hover {
    transform: scale(1.05);
}

.post-actions {
    display: flex;
    border-top: 1px solid #eee;
    margin-top: 1rem;
}

.action-btn {
    flex: 1;
    /* 三等分 */
    padding: 0.75rem 0;
    /* 上下留白 */
    text-align: center;
    /* 文字置中 */
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
}

.action-btn:not(:last-child) {
    border-right: 1px solid #eee;
    /* 區塊間隔線 */
}

/* Hover / Active 樣式 */
.action-btn:hover {
    background: #f5f5f5;
}

.action-btn:active {
    background: #e0e0e0;
}

/* 留言列表底下距離留給表單黏底 */
.comment-list {
    margin-bottom: 0;
    /* 這裡已經用 padding-bottom 處理 */
}

/* 黏底表單 */
.comment-form-wrapper {
    position: sticky;
    bottom: 0;
    background: #fff;
    /* 遮住後面的內容 */
    padding: 0.75rem 1rem;
    /* 依表單內部間距調整 */
    border-top: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
}
</style>