<template>
    <form @submit.prevent="submitEdit" class="edit-reply-form">
        <textarea v-model="content" rows="1"></textarea>
        <button type="submit">確認</button>
        <button type="button" @click="$emit('cancel')">取消</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'
const props = defineProps({ reply: Object })
const emit = defineEmits(['updated', 'cancel'])

const content = ref(props.reply.content)

async function submitEdit() {
    await myAxios.put(`/api/replies/${props.reply.replyId}`, { content: content.value })
    emit('updated', { ...props.reply, content: content.value })
}
</script>

<style scoped>
.edit-reply-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.edit-reply-form textarea {
    width: 100%;
    padding: 0.3rem;
}

.edit-reply-form button {
    align-self: flex-end;
    padding: 0.3rem 0.6rem;
}
</style>