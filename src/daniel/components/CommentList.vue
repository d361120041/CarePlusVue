<template>
    <div>
        <div v-for="c in comments" :key="c.commentId">
            <CommentItem :comment="c" @replied="reloadComments" />
        </div>
        <CommentForm :postId="props.postId" @added="reloadComments" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import myAxios from '@/plugins/axios.js'
import CommentForm from '@/daniel/components/CommentForm.vue'
import CommentItem from '@/daniel/components/CommentItem.vue'

const props = defineProps({ postId: Number })
const comments = ref([])

const reloadComments = async () => {
    const { data } = await myAxios.get(`/api/comments?postId=${props.postId}`)
    comments.value = data
}

onMounted(reloadComments)
</script>
