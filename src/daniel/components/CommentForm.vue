<template>
  <div style="margin-bottom: 10px;">
    <textarea v-model="content" placeholder="輸入留言..."></textarea>
    <button @click="submit">送出留言</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'
const props = defineProps({ postId: Number })
const emit = defineEmits(['added'])
const content = ref('')

const submit = async () => {
  await myAxios.post('/api/comments', { content: content.value, post: { postId: props.postId }, userId: 1 })
  content.value = ''
  emit('added')
}
</script>
