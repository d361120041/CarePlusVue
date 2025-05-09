<template>
    <div class="reply-item">
        <div class="reply-header">
            <!-- 使用者資訊區塊 -->
            <UserAvatar :imageUrl="imageUrl" />
            <div class="user-info">
                <div class="user-name">{{ reply.user.userName }}</div>
                <div class="reply-time">{{ formattedTime }}</div>
            </div>
            <!-- 漢堡選單 -->
            <div class="reply-menu-wrapper">
                <button class="hamburger-btn" @click.stop="toggleMenu">...</button>
                <ul v-if="menuOpen" class="reply-dropdown">
                    <li @click="startEdit">編輯回覆</li>
                    <li @click="confirmDelete">刪除回覆</li>
                </ul>
            </div>
        </div>

        <!-- 編輯表單與顯示內容切換 -->
        <div v-if="editing">
            <EditReplyForm :reply="reply" @updated="onUpdated" @cancel="stopEdit" />
        </div>
        <div v-else>
            <p>{{ reply.content }}</p>
        </div>

        <!-- 按讚按鈕 -->
        <div class="reply-actions">
            <button class="action-btn" @click="likeReply">讚</button>
            <span>(👍{{ likeCount }})</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'

import EditReplyForm from '@/daniel/components/reply/EditReplyForm.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ reply: Object })
const emit = defineEmits(['updated', 'deleted'])

import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
const { formattedTime } = useTimeFormat(props.reply.createdAt)

import { useToggle } from '@/daniel/composables/useToggle'
const [menuOpen, toggleMenu] = useToggle(false)

// 使用者資訊區塊
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${props.reply.user.profilePicture}`

// 下拉選單狀態
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

const likeCount = ref(props.reply.reactions?.length || 0)
async function likeReply() {
    try {
        const res = await myAxios.post(`/api/reactions/replies/${props.reply.replyId}?userId=${props.reply.user.userId}&type=1`)
        likeCount.value = res.data
    } catch (e) {
        console.error('回覆按讚失敗', e)
    }
}

onMounted(() => {
    likeCount.value = props.reply.reactions?.length || 0
})
</script>

<style scoped>
.reply-item {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    position: relative;
}

.reply-header {
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

.reply-time {
    font-size: 0.8rem;
    color: #666;
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

.reply-actions {
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