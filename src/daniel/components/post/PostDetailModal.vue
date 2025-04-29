<template>
    <BaseModal :visible="visible" :title="post.title" @close="$emit('close')">
        <div class="post-detail">
            <p>{{ post.content }}</p>
            <div class="post-images" v-if="post.images && post.images.length">
                <img v-for="img in post.images" :key="img.imageId" :src="`data:image/jpeg;base64,${img.imageData}`"
                    alt="Post Image" />
            </div>
            <hr />

            <!-- 留言列表 -->
            <CommentList ref="commentList" :postId="post.postId" class="comment-list" />

            <!-- 留言表單 -->
            <div class="comment-form-wrapper">
                <CommentForm :postId="post.postId" @added="onCommentAdded" />
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/daniel/components/BaseModal.vue'
import CommentList from '@/daniel/components/comment/CommentList.vue'
import CommentForm from '@/daniel/components/comment/CommentForm.vue'

const props = defineProps({
    visible: Boolean,
    post: Object
})
const emit = defineEmits(['close'])
const commentList = ref(null)

function onCommentAdded() {
    // 當表單送出後，刷新留言清單
    if (commentList.value && typeof commentList.value.reloadComments === 'function') {
        commentList.value.reloadComments()
    }
}
</script>

<style scoped>
.post-detail {
    /* 讓裡面 sticky 生效 */
    max-height: 70vh;
    overflow-y: auto;
    position: relative;
}

.post-images img {
    max-width: 100px;
    margin-right: 0.5rem;
}

/* 留言列表底下距離留給表單黏底 */
.comment-list {
    margin-bottom: 0;
    /* 這裡已經用 padding-bottom 處理 */
}

/* 黏底表單 */
.comment-form-wrapper {
    position: sticky;
    bottom: 0;
    background: #fff;
    /* 遮住後面的內容 */
    padding: 0.75rem 1rem;
    /* 依表單內部間距調整 */
    border-top: 1px solid #eee;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
}
</style>