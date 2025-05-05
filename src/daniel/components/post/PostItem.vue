<template>
    <article class="post-item">
        <div class="post-header">
            <!-- 使用者資訊區塊 -->
            <img class="user-avatar" :src="currentUser.avatarUrl" alt="User Avatar" />
            <div class="user-info">
                <div class="user-name">{{ post.user.userName }}</div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>

            <!-- 漢堡選單 -->
            <div class="menu-wrapper">
                <button class="hamburger-btn" @click.stop="toggleMenu">⋯</button>
                <ul v-if="menuOpen" class="post-dropdown">
                    <li @click="onEdit">編輯貼文</li>
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
            <img v-for="(src, idx) in imgList" :key="idx" :src="src"
                alt="Post Image" @click="openLightbox(idx)" class="clickable-img" />
        </div>

        <!-- vue-easy-lightbox -->
        <vue-easy-lightbox :visible="lightboxVisible" :imgs="imgList" :index="currentIndex" @hide="lightboxVisible = false" />

        <!-- 觀看次數 -->
        <div style="text-align: right;">
            <small>觀看次數{{ post.views }}次</small>
        </div>

        <!-- 貼文動作列 -->
        <div class="post-actions">
            <button class="action-btn" @click="likePost">
                👍 按讚({{ likeCount }})
            </button>
            <button class="action-btn" @click="isDetailOpen = true"> 💬 留言</button>
            <button class="action-btn" @click="sharePost">
                🔗 分享 ({{ shareCount }})
            </button>
        </div>

        <!-- 詳細 Modal -->
        <PostDetailModal :visible="isDetailOpen" :post="post" @close="isDetailOpen = false" @refresh="emit('refresh')" />
    </article>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
import { useToggle } from '@/daniel/composables/useToggle'
import myAxios from '@/plugins/axios.js'
import VueEasyLightbox from 'vue-easy-lightbox'

import PostDetailModal from '@/daniel/components/post/PostDetailModal.vue'

const props = defineProps({ 
    post: Object, required: true 
})
const emit = defineEmits([
    'refresh', 'edit-post', 'delete-post'
])

// 時間格式化
const { formattedTime } = useTimeFormat(props.post.createdAt)

// 漢堡選單
const [menuOpen, toggleMenu] = useToggle(false)

//================= ref, computed 開始 =================
// 使用者資訊區塊
const currentUser = ref({
    avatarUrl: '/circle-user-solid.svg'
})

// PostFormModal 編輯/檢視模式
// const isFormModalOpen = ref(false)

// 內容「顯示更多/較少」
const contentRef = ref(null)
const isExpanded = ref(false)
const needsToggle = ref(false)

// Lightbox
const lightboxVisible = ref(false)
const currentIndex = ref(0)
const imgList = computed(() => props.post.images.map(img => `data:image/jpeg;base64,${img.imageData}`))

// 讚與分享
const isDetailOpen = ref(false)
const likeCount = ref(props.post.reactions?.length || 0)
const shareCount = ref(props.post.share || 0)
//================= ref, computed 結束 =================

//================= 漢堡選單 開始 =================
// function closeMenu() {
//     menuOpen.value = false
// }
//================= 漢堡選單 結束 =================

//================= 編輯貼文 開始 =================
// PostFormModal 狀態
// function openEdit() {
//     toggleMenu()
//     isFormModalOpen.value = true
// }
// function closeEdit() {
//     isFormModalOpen.value = false
// }

// 編輯貼文
function onEdit() {
    toggleMenu()
    emit('edit-post', props.post)
}

// 刪除貼文
async function onDelete() {
    toggleMenu()
    if (!confirm('確定要刪除此貼文？此操作無法復原')) return
    try {
        await myAxios.delete(`/api/posts/${props.post.postId}`)
        emit('delete-post', props.post.postId)
    } catch (error) {
        alert('刪除失敗，請稍後再試')
    }
}

// 編輯或新增完成後
// function handleSaved(updatedPost) {
//     isFormModalOpen.value = false
    // 刷新當前貼文資料（包含標題、內容、images）
    // props.post.title = updatedPost.title
    // props.post.content = updatedPost.content
    // if (updatedPost.images) props.post.images = updatedPost.images
    // 通知列表重載整體列表
    // emit('refresh')
// }
//================= 編輯貼文 結束 =================

//================= 刪除貼文 開始 =================
// 刪除貼文
// async function confirmDelete() {
//     menuOpen.value = false
//     if (!window.confirm('確定要刪除此貼文？此操作無法復原')) return
//     try {
//         await myAxios.delete(`/api/posts/${props.post.postId}`)
//         emit('refresh')
//     } catch (err) {
//         console.error('刪除貼文失敗', err)
//         alert('刪除失敗，請稍後再試')
//     }
// }
//================= 刪除貼文 結束 =================

// ================= Lightbox 開始 =================
// Lightbox
// function showImage(idx) {
//     currentIndex.value = idx
//     lightboxVisible.value = true
// }

// 關閉 Lightbox
// function hideLightbox() {
//     lightboxVisible.value = false
// }

// lightbox
function openLightbox(idx) {
    currentIndex.value = idx
    lightboxVisible.value = true
}
// ================= Lightbox 結束 =================

//================= 按讚 開始=================
async function likePost() {
    try {
        const res = await myAxios.post(`/api/reactions/posts/${props.post.postId}?userId=${props.post.user.userId}&type=1`)
        likeCount.value = res.data
    } catch (error) {
        console.error('貼文按讚失敗', error);
    }
}
//================= 按讚 結束=================

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

onMounted(async () => {
    // 更新觀看次數
    try {
        await myAxios.post(`/api/posts/${props.post.postId}/view`)
    } catch (e) {
        console.error('更新觀看次數失敗', e)
    }

    // 顯示更多、顯示更少
    const el = contentRef.value
    // 取得實際內容高度與單行高度
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)   /* 行高 */
    needsToggle.value = el.scrollHeight > lineHeight * 5

    // likeCount.value = props.post.reactions?.length || 0;
})
</script>

<style scoped>
.post-item {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 2rem;
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