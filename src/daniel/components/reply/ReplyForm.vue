<template>
    <div class="reply-form-container">
        <UserAvatar :imageUrl="imageUrl" class="avatar-wrapper" />
        <textarea v-model="content" placeholder="輸入回覆..." rows="1" class="reply-input"></textarea>
        <button class="submit-btn" @click="submit">送出</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import myAxios from '@/plugins/axios.js'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ commentId: Number })
const emit = defineEmits(['added'])
const authStore = useAuthStore()

const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

const content = ref('')

const submit = async () => {
    await myAxios.post('/api/replies', {
        content: content.value,
        user: {
            userId: authStore.user.userId
        },
        comment: {
            commentId: props.commentId
        },
    })
    content.value = ''
    emit('added')
}
</script>

<style scoped>
.reply-form-container {
    display: flex;
    align-items: center;
    width: 95%;
    background: #f5f5f5;
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

.submit-btn {
    padding: 0.5rem 1rem;
    background: var(--color-btn-secondary-bg);
    color: var(--color-btn-secondary-text);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s ease;
}

.submit-btn:hover {
    background: var(--color-btn-secondary-bg-hover);
}
</style>
