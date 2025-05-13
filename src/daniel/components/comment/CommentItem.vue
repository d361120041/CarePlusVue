<template>
    <div class="comment-item">
        <div class="comment-header">
            <!-- 使用者資訊區塊 -->
            <UserAvatar :imageUrl="imageUrl" />
            <div class="user-info">
                <div class="user-name">{{ comment.user.userName }}</div>
                <div class="comment-time">{{ formattedTime }}</div>
            </div>

            <!-- 漢堡選單 -->
            <div class="comment-menu-wrapper">
                <button class="hamburger-btn" @click.stop="toggleMenu">...</button>
                <ul v-if="menuOpen" class="comment-dropdown">
                    <li @click="startEdit">編輯評論</li>
                    <li @click="confirmDelete">刪除評論</li>
                </ul>
            </div>
        </div>

        <!-- 編輯表單與顯示切換 -->
        <div v-if="editing">
            <EditCommentForm :comment="comment" @updated="onUpdated" @cancel="stopEdit" />
        </div>
        <div v-else>
            <p>{{ comment.content }}</p>
        </div>

        <!-- 按讚按鈕 -->
        <div class="comment-actions">
            <button class="action-btn" @click="likeComment">讚</button>
            <span>(👍{{ likeCount }})</span>
        </div>

        <ReplyList :commentId="comment.commentId" @reloaded="emitReload" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'

import ReplyList from '@/daniel/components/reply/ReplyList.vue'
import EditCommentForm from '@/daniel/components/comment/EditCommentForm.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ comment: Object })
const emit = defineEmits(['replied', 'updated', 'deleted'])
const emitReload = () => emit('replied')

import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
const { formattedTime } = useTimeFormat(props.comment.createdAt)

import { useToggle } from '@/daniel/composables/useToggle'
const [menuOpen, toggleMenu] = useToggle(false)

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

//================= 按讚 開始=================
const likeCount = ref(props.comment.reactions?.length || 0)
async function likeComment() {
    try {
        const res = await myAxios.post(`/api/reactions/comments/${props.comment.commentId}?userId=${props.comment.user.userId}&type=1`)
        likeCount.value = res.data
    } catch (error) {
        console.error('評論按讚失敗', error);
    }
}
//================= 按讚 結束=================

onMounted(() => {
    likeCount.value = props.comment.reactions?.length || 0
})

</script>

<style scoped>
.comment-item {
    background: #fff;
    /* border: 1px solid #eee; */
    border-radius: 4px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    position: relative;
}

.comment-header {
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

.comment-time {
    font-size: 0.8rem;
    color: #666;
}

.comment-menu-wrapper {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
}

.hamburger-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}

.comment-dropdown {
    position: absolute;
    right: 0;
    top: 1.5rem;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 0.5rem 0;
    z-index: 100;
}

.comment-dropdown li {
    padding: 0.5rem 1rem;
    cursor: pointer;
}

.comment-dropdown li:hover {
    background-color: #f5f5f5;
}

.comment-actions {
    display: flex;
    justify-content: flex-start;
    margin: 0.5rem 0;
    font-size: 0.9rem;
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