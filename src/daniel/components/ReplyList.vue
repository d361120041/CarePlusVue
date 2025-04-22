// src/components/ReplyList.vue
<template>
    <div style="padding-left: 20px;">
        <ReplyForm :commentId="props.commentId" @added="reloadReplies" />
        <div v-for="reply in replies" :key="reply.replyId">
            <ReplyItem :reply="reply" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'
import ReplyForm from '@/daniel/components/ReplyForm.vue'
import ReplyItem from '@/daniel/components/ReplyItem.vue'

const props = defineProps({ commentId: Number })
const replies = ref([])

const reloadReplies = async () => {
    const getReplies = await myAxios.get(`/api/replies?commentId=${props.commentId}`)
    replies.value = getReplies.data
}

onMounted(reloadReplies)
</script>
