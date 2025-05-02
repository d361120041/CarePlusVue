<template>
    <section class="reply-section">
        <div v-for="reply in replies" :key="reply.replyId">
            <ReplyItem :reply="reply" @updated="reloadReplies" @deleted="onDeleted" />
        </div>
        <ReplyForm :commentId="props.commentId" @added="reloadReplies" />
    </section>
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

<style scoped>
.reply-section {
    margin-top: 0.5rem;
    padding-left: 1.5rem;
    border-left: 2px dashed #ddd;
}

.reply-item {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>
