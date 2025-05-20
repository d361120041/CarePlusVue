<template>
    <div class="reply-item">
        <!-- 1. 編輯模式 -->
        <div v-if="editing">
            <EditReplyForm :reply="reply" @updated="onUpdated" @cancel="stopEdit" />
        </div>

        <!-- 2. 顯示模式 -->
        <div v-else>
            <div class="reply-top">
                <UserAvatar :imageUrl="imageUrl" />
                <div class="reply-main">
                    <div class="user-name">{{ reply.user.userName }}</div>
                    <div class="reply-content">{{ reply.content }}</div>
                </div>
                <div class="reply-menu-wrapper" v-click-outside="closeMenu">
                    <button class="hamburger-btn" @click.stop="toggleMenu" v-if="reply.user.userId === currentUser.userId">...</button>
                    <ul v-if="menuOpen" class="reply-dropdown">
                        <li @click="startEdit">編輯</li>
                        <li @click="confirmDelete">刪除</li>
                    </ul>
                </div>
            </div>

            <div class="reply-bottom">
                <div class="reply-time">{{ formattedTime }}</div>
                <div class="reply-actions">
                    <button class="action-btn" @click="likeReply">讚</button>
                    <span>(👍{{ likeCount }})</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTimeFormat } from '@/daniel/composables/useTimeFormat'
import { useToggle } from '@/daniel/composables/useToggle'
import { useAuthStore } from '@/stores/auth'

import myAxios from '@/plugins/axios.js'
import EditReplyForm from '@/daniel/components/reply/EditReplyForm.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'
import Swal from 'sweetalert2'

const props = defineProps({ reply: Object })
const emit = defineEmits(['updated', 'deleted'])

const { formattedTime } = useTimeFormat(props.reply.createdAt)
const [menuOpen, toggleMenu] = useToggle(false)
const authStore = useAuthStore()

function closeMenu() {
    menuOpen.value = false
}

// 使用者資訊區塊
const currentUser = authStore.user
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${props.reply.user.profilePicture}`

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

    const result = await Swal.fire({
        title: '確定要刪除嗎？',
        text: '刪除後將無法復原',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#aaa',
    })
    if (!result.isConfirmed) return

    try {
        await myAxios.delete(`/api/replies/${props.reply.replyId}`)
        emit('deleted', props.reply.replyId)
    } catch (err) {
        console.error('刪除回覆失敗', err)
        Swal.fire({
            icon: 'error',
            title: '發生錯誤',
            text: '請稍後再試',
            confirmButtonColor: '#3e9bdc',
        })
    }
}

const likeCount = ref(props.reply.reactions?.length || 0)
async function likeReply() {
    try {
        const res = await myAxios.post(`/api/reactions/replies/${props.reply.replyId}?userId=${currentUser.userId}&type=1`)
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
    border-radius: 4px;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
}

.reply-top {
    display: flex;
    position: relative;
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

.reply-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
}

.user-name {
    font-weight: bold;
    font-size: 0.95rem;
}

.reply-content {
    font-size: 0.9rem;
    margin: 0;
    white-space: pre-wrap;
}

.reply-menu-wrapper {
    position: absolute;
    top: 0;
    right: 0.5rem;
}

.hamburger-btn {
    background: none;
    border: none;
    font-size: 1rem;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}

.hamburger-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

.reply-dropdown {
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

.reply-dropdown li {
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

.reply-dropdown li:hover {
    background: #f5f5f5;
    border-radius: 4px;
}

.reply-bottom {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #666;
    margin-left: calc(36px + 0.75rem);
    gap: 0.5rem;
}

.reply-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.action-btn:hover {
    text-decoration: underline;
}
</style>