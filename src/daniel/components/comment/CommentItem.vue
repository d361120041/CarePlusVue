<template>
    <div class="comment-item">

        <!-- 第一行：大頭貼 + 使用者姓名與內容區塊 -->
        <div class="comment-top">
            <UserAvatar :imageUrl="imageUrl" class="user-avatar" />
            <div class="comment-main">
                <div class="user-name">{{ comment.user.userName }}</div>
                <div class="comment-content">{{ comment.content }}</div>
            </div>

            <!-- 漢堡選單 -->
            <div class="comment-menu-wrapper">
                <button class="hamburger-btn" @click.stop="toggleMenu">...</button>
                <ul v-if="menuOpen" class="comment-dropdown">
                    <li @click="startEdit">編輯</li>
                    <li @click="confirmDelete">刪除</li>
                </ul>
            </div>
        </div>

        <!-- 第二行：時間與按讚，對齊 comment-main 開頭 -->
        <div class="comment-bottom">
            <div class="comment-time">{{ formattedTime }}</div>
            <!-- 按讚按鈕 -->
            <div class="comment-actions">
                <button class="action-btn" @click="likeComment">讚</button>
                <span>(👍{{ likeCount }})</span>
                <button class="action-btn" @click="onReplyClick">回覆</button>
            </div>
        </div>

        <!-- 編輯表單與顯示切換 -->
        <div v-if="editing">
            <EditCommentForm :comment="comment" @updated="onUpdated" @cancel="stopEdit" />
        </div>

        <ReplyList :commentId="comment.commentId" :showForm="showReplyForm" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
import { useToggle } from '@/daniel/composables/useToggle'

import myAxios from '@/plugins/axios.js'
import ReplyList from '@/daniel/components/reply/ReplyList.vue'
import EditCommentForm from '@/daniel/components/comment/EditCommentForm.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ comment: Object })
const emit = defineEmits(['replied', 'updated', 'deleted', 'toggle-reply'])

const { formattedTime } = useTimeFormat(props.comment.createdAt)
const [menuOpen, toggleMenu] = useToggle(false)
const [showReplyForm, toggleReply] = useToggle(false)

// 使用者資訊區塊
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${props.comment.user.profilePicture}`

// 編輯狀態
const editing = ref(false)
function startEdit() {
    menuOpen.value = false
    editing.value = true
}
function stopEdit() {
    editing.value = false
}
function onUpdated(newComment) {
    editing.value = false
    emit('updated', newComment)
}

// 刪除功能
async function confirmDelete() {
    menuOpen.value = false
    if (!window.confirm('確定要刪除此則評論？此操作無法復原')) return
    try {
        await myAxios.delete(`/api/comments/${props.comment.commentId}`)
        emit('deleted', props.comment.commentId)
    } catch (err) {
        console.error('刪除評論失敗', err)
        alert('刪除評論失敗，請稍後再試')
    }
}

// 按讚
const likeCount = ref(props.comment.reactions?.length || 0)
async function likeComment() {
    try {
        const res = await myAxios.post(`/api/reactions/comments/${props.comment.commentId}?userId=${props.comment.user.userId}&type=1`)
        likeCount.value = res.data
    } catch (error) {
        console.error('評論按讚失敗', error);
    }
}

function onReplyClick() {
    toggleReply()
    emit('toggle-reply', props.comment.commentId)
}

onMounted(() => {
    likeCount.value = props.comment.reactions?.length || 0
})

</script>

<style scoped>
.comment-item {
    background: #fff;
    border-radius: 4px;
    padding: 0.75rem 0.75rem 0;
    /* margin-bottom: 1rem; */
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.comment-top {
    display: flex;
    /* align-items: flex-start; */
    position: relative;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

.comment-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: #f9f9f9;
    /* 淺色區隔 */
    padding: 0.5rem;
    border-radius: 4px;
}

.user-name {
    font-weight: bold;
    font-size: 0.95rem;
}

.comment-content {
    font-size: 0.9rem;
    white-space: pre-wrap;
}

.comment-menu-wrapper {
    position: absolute;
    top: 0rem;
    right: 0.5rem;
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

.comment-dropdown {
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
    /* 允許換行 */
    gap: 0.5rem;
    z-index: 100;
}

.comment-dropdown li {
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

.comment-dropdown li:hover {
    background: #f5f5f5;
    border-radius: 4px;
}

.comment-bottom {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #666;
    margin-left: calc(40px + 0.75rem);
    /* 對齊 comment-main 開頭 */
    gap: 0.5rem;
}

.comment-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.action-btn:hover {
    text-decoration: underline
}
</style>