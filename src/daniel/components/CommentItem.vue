<template>
    <div style="margin-bottom: 10px;">
        <p>{{ comment.content }}</p>
        <small>由 User {{ comment.userId }} 發佈於 {{ comment.createdAt }}</small>
        <ReplyList :commentId="comment.commentId" @reloaded="emitReload" />
    </div>
</template>

<script setup>
import ReplyList from '@/daniel/components/ReplyList.vue'
import { defineEmits } from 'vue'
const props = defineProps({ comment: Object })
const emit = defineEmits(['replied'])
const emitReload = () => emit('replied')
</script>