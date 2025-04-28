<template>
    <form @submit.prevent="submitEdit" class="edit-comment-form">
        <textarea v-model="content" rows="1"></textarea>
        <button type="submit">確認</button>
        <button type="button" @click="$emit('cancel')">取消</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'

const props = defineProps({ comment: Object })
const emit = defineEmits(['updated', 'cancel'])

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