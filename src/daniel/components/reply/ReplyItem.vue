<template>
    <div class="reply-item">

        <!-- 漢堡選單 -->
        <div class="reply-menu-wrapper">
            <button class="hamburger-btn" @click.stop="toggleMenu">☰</button>
            <ul v-if="menuOpen" class="reply-dropdown">
                <li @click="startEdit">編輯回覆</li>
                <li @click="confirmDelete">刪除回覆</li>
            </ul>
        </div>

        <!-- 編輯表單與顯示內容切換 -->
        <div v-if="editing">
            <EditReplyForm :reply="reply" @updated="onUpdated" @cancel="stopEdit" />
        </div>
        <div v-else>
            <p>{{ reply.content }}</p>
        </div>

        <small>由 User {{ reply.userId }} 發佈於 {{ reply.createdAt }}</small>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'
import EditReplyForm from '@/daniel/components/reply/EditReplyForm.vue'

const props = defineProps({ reply: Object })
const emit = defineEmits(['updated', 'deleted'])

// 下拉選單狀態
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
function onUpdated(newReply) {
    editing.value = false
    emit('updated', newReply)
}

// 刪除功能
async function confirmDelete() {
    menuOpen.value = false
    if (!window.confirm('確定要刪除此則回覆？此操作無法復原')) return
    try {
        await myAxios.delete(`/api/replies/${props.reply.replyId}`)
        emit('deleted', props.reply.replyId)
    } catch (err) {
        console.error('刪除回覆失敗', err)
        alert('刪除回覆失敗，請稍後再試')
    }
}
</script>

<style scoped>
.reply-item {
    position: relative;
    padding-left: 20px;
    margin-bottom: 0.5rem;
}

.reply-menu-wrapper {
    position: absolute;
    top: 0;
    right: 0;
}

.hamburger-btn {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
}

.reply-dropdown {
    position: absolute;
    right: 0;
    top: 1.2rem;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    padding: 0.5rem 0;
    margin: 0;
    z-index: 100;
}

.reply-dropdown li {
    padding: 0.3rem 0.8rem;
    cursor: pointer;
}

.reply-dropdown li:hover {
    background-color: #f5f5f5;
}
</style>