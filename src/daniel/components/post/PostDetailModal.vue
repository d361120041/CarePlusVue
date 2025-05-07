<template>
    <BaseModal v-if="post" :visible="visible" :title="`${post.user.userName}的貼文`" @close="$emit('close')">
        <div class="post-detail">
            <div class="post-header">
                <!-- 使用者資訊區塊 -->
                <img class="user-avatar" :src="imageURL" alt="User Avatar" />
                <div class="user-info">
                    <div class="user-name">{{ post.user.userName }}</div>
                    <div class="post-time">{{ formattedTime }}</div>
                </div>

                <!-- 漢堡選單 -->
                <div class="menu-wrapper">
                    <button class="hamburger-btn" @click.stop="toggleMenu" v-if="post.user.userId === currentUser.userId">⋯</button>
                    <ul v-if="menuOpen" class="post-dropdown">
                        <li @click="() => postStore.edit(post)">編輯貼文</li>
                        <li @click="onDelete">刪除貼文</li>
                    </ul>
                </div>
            </div>

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
                <small>觀看次數{{ formatCount(post.views) }}次</small>
            </div>

            <!-- 貼文動作列 -->
            <div class="post-actions">
                <button class="action-btn" @click="likePost">
                    👍 按讚({{ likeCount }})
                </button>
                <button class="action-btn"> 💬 留言</button>
                <button class="action-btn" @click="sharePost">
                    🔗 分享 ({{ shareCount }})
                </button>
            </div>

            <!-- 留言列表 -->
            <CommentList ref="commentList" :postId="post.postId" class="comment-list" />

            <!-- 留言表單 -->
            <div class="comment-form-wrapper">
                <CommentForm :postId="post.postId" @added="onCommentAdded" />
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
import { useToggle } from '@/daniel/composables/useToggle'
import { formatCount } from '@/daniel/composables/number.js'
import { usePostStore } from '@/daniel/stores/posts'
import { useAuthStore } from '@/stores/auth'
import VueEasyLightbox from 'vue-easy-lightbox'

import BaseModal from '@/daniel/components/BaseModal.vue'
import CommentList from '@/daniel/components/comment/CommentList.vue'
import CommentForm from '@/daniel/components/comment/CommentForm.vue'

const props = defineProps({
    visible: Boolean,
    post: Object
})
const emit = defineEmits(['close', 'refresh'])

// 時間格式化
const { formattedTime } = useTimeFormat(props.post.createdAt)

// 漢堡選單
const [menuOpen, toggleMenu] = useToggle(false)

const postStore = usePostStore()
const authStore = useAuthStore()

// 使用者頭貼
const currentUser = authStore.user
const imageURL = ref(null)
imageURL.value = `data:image/png;base64,${props.post.user.profilePicture}`

// 貼文動作列
const likeCount = computed(() => props.post.reactions?.length || 0)
const shareCount = computed(() => props.post.share || 0)

// 評論清單
const commentList = ref(null)

// 刪除貼文
async function onDelete() {
    toggleMenu()
    // menuOpen.value = false
    if (!confirm('確定要刪除此貼文？此操作無法復原')) return
    try {
        await postStore.deletePost(props.post.postId)
        emit('refresh')
    } catch {
        alert('刪除失敗，請稍後再試')
    }
}

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

// 按讚貼文
async function likePost() {
    try {
        await postStore.like(props.post.postId, authStore.user.userId)
    } catch {
        console.error('貼文按讚失敗');
    }
}

// 更新觀看次數
onMounted(async () => {
    postStore.view(props.post.postId)
    // likeCount.value = props.post.reactions?.length || 0;
})

// 更新分享次數
async function sharePost() {
    try {
        await navigator.share({
            title: props.post.title,
            text: props.post.content,
            url: window.location.href
        })
        await postStore.share(props.post.postId)
        shareCount.value++
    } catch {
        console.error('分享失敗或使用者取消')
    }
}

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