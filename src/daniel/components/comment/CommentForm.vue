<template>
    <div class="comment-form-container">
        <div class="avatar-wrapper">
            <UserAvatar :imageUrl="imageUrl" />
        </div>
        <textarea v-model="content" placeholder="輸入留言..." rows="1" class="comment-input"></textarea>
        <button @click="submit" class="submit-btn">送出</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';

import myAxios from '@/plugins/axios.js'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ postId: Number })
const emit = defineEmits(['added'])
const authStore = useAuthStore()

const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

const content = ref('')

const submit = async () => {
    await myAxios.post('/api/comments', {
        content: content.value,
        user: {
            userId: authStore.user.userId
        },
        post: {
            postId: props.postId
        },
    })
    content.value = ''
    emit('added')
}
</script>

<style scoped>
.comment-form-container {
    display: flex;
    align-items: center;
    width: 100%;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 12px;
    box-sizing: border-box;
    gap: 0.5rem;
}

/* .avatar-wrapper {
    flex-shrink: 0;
} */

.comment-input {
    flex: 1;
    resize: none;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.95rem;
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
    font-size: 0.9rem;
    transition: background 0.2s ease;
}

.submit-btn:hover {
    background: var(--color-btn-secondary-bg-hover);
}
</style>
