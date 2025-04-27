// src/components/ReplyList.vue
<template>
    <div style="padding-left: 20px;">
        <div v-for="reply in replies" :key="reply.replyId">
            <ReplyItem :reply="reply" @updated="reloadReplies" @deleted="onDeleted" />
        </div>
        <ReplyForm :commentId="props.commentId" @added="reloadReplies" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'
import ReplyForm from '@/daniel/components/reply/ReplyForm.vue'
import ReplyItem from '@/daniel/components/reply/ReplyItem.vue'

const props = defineProps({ commentId: Number })
const replies = ref([])

const reloadReplies = async () => {
    const getReplies = await myAxios.get(`/api/replies?commentId=${props.commentId}`)
    replies.value = getReplies.data
}

onMounted(reloadReplies)

function onDeleted(id) {
    replies.value = replies.value.filter(r => r.replyId !== id)
}
</script>
