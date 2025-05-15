<template>
    <div class="reply-form-container edit-mode">
        <div class="avatar-wrapper">
            <UserAvatar :imageUrl="imageUrl" />
        </div>
        <textarea v-model="content" placeholder="編輯回覆..." rows="1" class="reply-input"></textarea>
        <div class="button-group">
            <button @click="submitEdit" class="submit-btn">確認</button>
            <button @click="$emit('cancel')" class="cancel-btn">取消</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import myAxios from '@/plugins/axios.js'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ reply: Object })
const emit = defineEmits(['updated', 'cancel'])
const authStore = useAuthStore()

const content = ref(props.reply.content)

const imageUrl = ref(
    `data:image/png;base64,${authStore.user.profilePicture}`
)

async function submitEdit() {
    await myAxios.put(`/api/replies/${props.reply.replyId}`, { content: content.value })
    emit('updated', { ...props.reply, content: content.value })
}
</script>

<style scoped>
.reply-form-container {
    display: flex;
    align-items: center;
    width: 95%;
    background: #fff8e1;
    padding: 0.5rem;
    border-radius: 12px;
    box-sizing: border-box;
    gap: 0.5rem;
    margin-left: calc(15px + 0.75rem);
}

.avatar-wrapper {
    flex-shrink: 0;
}

.reply-input {
    flex: 1;
    resize: none;
    padding: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.85rem;
    margin: 0;
    box-sizing: border-box;
}

.button-group {
    display: flex;
    gap: 0.5rem;
}

.submit-btn,
.cancel-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
}

.submit-btn {
    background: var(--color-btn-primary-bg);
    color: var(--color-btn-primary-text);
}

.submit-btn:hover {
    background: var(--color-btn-primary-bg-hover);
}

.cancel-btn {
    background: var(--color-btn-secondary-bg);
    color: var(--color-btn-secondary-text);
}

.cancel-btn:hover {
    background: var(--color-btn-secondary-bg-hover);
}
</style>