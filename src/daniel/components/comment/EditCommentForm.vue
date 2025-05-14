<template>
    <div class="comment-form-container edit-mode">
        <div class="avatar-wrapper">
            <UserAvatar :imageUrl="imageUrl" />
        </div>
        <textarea v-model="content" placeholder="編輯留言..." rows="1" class="comment-input"></textarea>
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

const props = defineProps({ comment: Object })
const emit = defineEmits(['updated', 'cancel'])
const authStore = useAuthStore()

// prepare avatar
const imageUrl = ref(
    `data:image/png;base64,${authStore.user.profilePicture}`
)

// editable content
const content = ref(props.comment.content)

async function submitEdit() {
    await myAxios.put(`/api/comments/${props.comment.commentId}`, {
        content: content.value
    })
    emit('updated', {
        ...props.comment,
        content: content.value
    })
}
</script>

<style scoped>
.comment-form-container {
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff8e1;
    padding: 1rem;
    border-radius: 12px;
    box-sizing: border-box;
    gap: 0.5rem;
}

.avatar-wrapper {
    flex-shrink: 0;
}

.comment-input {
    flex: 1;
    resize: none;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.95rem;
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
    font-size: 0.9rem;
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