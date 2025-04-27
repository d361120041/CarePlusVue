<template>
    <div>
        <div v-for="c in comments" :key="c.commentId">
            <CommentItem :comment="c" @replied="reloadComments" @updated="reloadComments" @deleted="onDeleted" />
        </div>
        <CommentForm :postId="props.postId" @added="reloadComments" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'
import CommentForm from '@/daniel/components/comment/CommentForm.vue'
import CommentItem from '@/daniel/components/comment/CommentItem.vue'

const props = defineProps({ postId: Number })
const comments = ref([])

const reloadComments = async () => {
    const { data } = await myAxios.get(`/api/comments?postId=${props.postId}`)
    comments.value = data
}

function onDeleted(deletedId) {
    // 過濾掉已刪除的評論
    comments.value = comments.value.filter(c => c.commentId !== deletedId)
}

onMounted(reloadComments)
</script>
