<template>
    <div style="margin-bottom: 10px;">
        <input v-model="content" placeholder="輸入回覆..." />
        <button @click="submit">送出回覆</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'
const props = defineProps({ commentId: Number })
const emit = defineEmits(['added'])
const content = ref('')

const submit = async () => {
    await myAxios.post('/api/replies', { content: content.value, comment: { commentId: props.commentId }, userId: 1 })
    content.value = ''
    emit('added')
}
</script>