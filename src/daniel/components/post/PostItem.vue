<template>
    <article class="post-item">
        <div class="post-header">
            <!-- 使用者資訊區塊 -->
            <UserAvatar :imageUrl="imageUrl" style="margin-right: 0.5rem;" />
            <div class="user-info">
                <div class="user-name">{{ post.user.userName }}
                    <span v-if="post.createdAt !== post.modifiedAt" class="edited-marker">已編輯</span>
                </div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>

            <!-- 分類標籤 -->
            <div class="post-categories">
                <span v-for="cat in post.postCategoryClassifiers" :key="cat.postCategoryClassifierId"
                    class="post-category-tag">
                    {{ cat.postCategory.postCategory }}
                </span>
            </div>

            <!-- 主題標籤 -->
            <div class="post-topics">
                <span v-for="top in post.postTopicClassifiers" :key="top.postTopicClassifierId" class="post-topic-tag">
                    {{ top.postTopic.topic }}
                </span>
            </div>

            <!-- 漢堡選單 -->
            <div class="menu-wrapper" v-click-outside="closeMenu">
                <button class="hamburger-btn" @click.stop="toggleMenu" v-if="post.user.userId === currentUser.userId">⋯
                </button>
                <ul v-if="menuOpen" class="post-dropdown">
                    <li @click="() => postStore.edit(post)">編輯貼文</li>
                    <li @click="onDelete">刪除貼文</li>
                </ul>
            </div>
        </div>

        <!-- 貼文內容 -->
        <h2>{{ post.title }}</h2>
        <div class="post-content-wrapper">
            <!-- 使用 span 使文字與按鈕同層顯示 -->
            <span ref="contentRef" :class="['post-content', { expanded: isExpanded }]">
                {{ post.content }}
            </span>
            <!-- Toggle 按鈕放在文字後，span 同一層級 -->
            <span v-if="needsToggle" class="show-more-btn" @click="isExpanded = !isExpanded">
                {{ isExpanded ? '顯示較少' : '顯示更多' }}
            </span>
        </div>

        <!-- 圖片列表 -->
        <div class="post-images" v-if="imgList.length">
            <img v-for="(src, idx) in imgList" :key="idx" :src="src" alt="Post Image" @click="openLightbox(idx)"
                class="clickable-img" />
        </div>

        <!-- vue-easy-lightbox -->
        <vue-easy-lightbox :visible="lightboxVisible" :imgs="imgList" :index="currentIndex"
            @hide="lightboxVisible = false" />

        <!-- 觀看次數 -->
        <div style="text-align: right;">
            <small>觀看次數{{ formatCount(post.views) }}次</small>
        </div>

        <!-- 貼文動作列 -->
        <div class="post-actions">
            <button class="action-btn" @click="likePost">
                👍 按讚({{ formatCount(post.reactions.length ?? 0) }})
            </button>
            <button class="action-btn" @click="() => postStore.openDetailModal(post)"> 💬 留言</button>
            <button class="action-btn" @click="sharePost">
                🔗 分享 ({{ post.share }})
            </button>
        </div>
    </article>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
import { useToggle } from '@/daniel/composables/useToggle'
import { formatCount } from '@/daniel/composables/number.js'
import { usePostStore } from '@/daniel/stores/posts'
import { useAuthStore } from '@/stores/auth'

import VueEasyLightbox from 'vue-easy-lightbox'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({
    post: Object, required: true
})
const emit = defineEmits(['refresh'])

// 時間格式化
const { formattedTime } = useTimeFormat(props.post.createdAt)

// 漢堡選單
const [menuOpen, toggleMenu] = useToggle(false)

const postStore = usePostStore()
const authStore = useAuthStore()

// 使用者頭貼
const currentUser = authStore.user
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${props.post.user.profilePicture}`

// 內容「顯示更多/較少」
const contentRef = ref(null)
const isExpanded = ref(false)
const needsToggle = ref(false)

// Lightbox
const lightboxVisible = ref(false)
const currentIndex = ref(0)
const imgList = computed(() => props.post.images.map(img => `data:image/jpeg;base64,${img.imageData}`))

function closeMenu() {
    menuOpen.value = false
}

// 刪除貼文
async function onDelete() {
    toggleMenu()
    if (!confirm('確定要刪除此貼文？此操作無法復原')) return
    try {
        await postStore.deletePost(props.post.postId)
        emit('refresh')
    } catch {
        alert('刪除失敗，請稍後再試')
    }
}

// lightbox
function openLightbox(idx) {
    currentIndex.value = idx
    lightboxVisible.value = true
}

// 按讚貼文
async function likePost() {
    try {
        await postStore.like(
            props.post.postId,
            props.post.user.userId
        )
    } catch {
        console.error('貼文按讚失敗');
    }
}

// 更新分享次數
async function sharePost() {
    try {
        // 呼叫原生分享介面
        await navigator.share({
            title: props.post.title,
            text: props.post.content,
            url: window.location.href
        })
        // 統一呼叫 store 裡更新並同步的 action
        await postStore.sharePost(props.post.postId)
        // 通知父元件重新抓最新資料，讓 UI 跟著更新
        emit('refresh')
    } catch (e) {
        console.error('分享失敗或取消', e)
    }
}

onMounted(async () => {
    // 更新觀看次數
    postStore.view(props.post.postId)

    // 顯示更多、顯示更少
    const el = contentRef.value
    // 取得實際內容高度與單行高度
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)   /* 行高 */
    needsToggle.value = el.scrollHeight > lineHeight * 5
})
</script>

<style scoped>
.post-item {
    width: 450px;
    max-width: 600px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin: 0 auto 2rem;
    position: relative;
}

.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
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

.edited-marker {
    font-size: 0.75rem;
    color: var(--color-text-muted);
}

.post-categories {
    margin-top: 0.25rem;
    margin-left: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.post-category-tag {
    font-size: 0.75rem;
    background: #eef;
    color: #336;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
    margin-right: 0.25rem;
}

.post-topics {
    margin-top: 0.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.post-topic-tag {
    font-size: 0.75rem;
    background: #fee;
    color: #633;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
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
    line-height: 1;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}

.hamburger-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

.post-dropdown {
    position: absolute;
    right: 0;
    top: 1.5rem;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    padding: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    z-index: 100;
}

.post-dropdown li {
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

.post-dropdown li:hover {
    background: #f5f5f5;
    border-radius: 4px;
}

.post-content-wrapper {
    line-height: 1.5;
}

.post-content-wrapper {
    /* 父容器轉為 inline-block, 讓 span 同行 */
    display: inline-block;
    max-width: 100%;
}

.post-content {
    /* 使用 span 並保持彈性盒字數截斷 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    vertical-align: top;
    transition: max-height 0.3s ease;
}

.post-content.expanded {
    -webkit-line-clamp: unset;
    overflow: visible;
}

.show-more-btn {
    display: inline;
    margin-left: 0.5em;
    cursor: pointer;
    font-size: 0.9rem;
    color: #007bff;
    vertical-align: top;
}

.show-more-btn:hover {
    text-decoration: underline;
}

.post-images {
    margin-bottom: 1em;
}

.post-images img {
    max-width: 100px;
    margin-right: 10px;
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
</style>