<template>
    <div class="comment-item">

        <!-- 漢堡選單 -->
        <div class="comment-menu-wrapper">
            <button class="hamburger-btn" @click.stop="toggleMenu">☰</button>
            <ul v-if="menuOpen" class="comment-dropdown">
                <li @click="startEdit">編輯評論</li>
                <li @click="confirmDelete">刪除評論</li>
            </ul>
        </div>

        <!-- 編輯表單與顯示切換 -->
        <div v-if="editing">
            <EditCommentForm :comment="comment" @updated="onUpdated" @cancel="stopEdit" />
        </div>
        <div v-else>
            <p>{{ comment.content }}</p>
        </div>

        <small>由 User {{ comment.userId }} 發佈於 {{ comment.createdAt }}</small>
        <ReplyList :commentId="comment.commentId" @reloaded="emitReload" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'
import ReplyList from '@/daniel/components/reply/ReplyList.vue'
import EditCommentForm from '@/daniel/components/comment/EditCommentForm.vue'

const props = defineProps({ comment: Object })
const emit = defineEmits(['replied', 'updated', 'deleted'])

// 下拉選單
const menuOpen = ref(false)
function toggleMenu() {
    menuOpen.value = !menuOpen.value
}
function closeMenu() {
    menuOpen.value = false
}

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

const emitReload = () => emit('replied')
</script>

<style scoped>
.comment-item {
    position: relative;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
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
</style>