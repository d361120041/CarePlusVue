<template>
    <div>
        <transition-group name="fade-list" tag="div">
            <PostItem v-for="post in postStore.posts" :key="post.postId" :post="post" @refresh="$emit('refresh')" />
        </transition-group>
    </div>
</template>

<script setup>
import { usePostStore } from '@/daniel/stores/posts'
import PostItem from '@/daniel/components/post/PostItem.vue'

const props = defineProps({
    filterCategoryIds: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['refresh'])

const postStore = usePostStore()
</script>

<style scoped>
-list-enter-active {
    transition: all 0.4s ease;
}

.fade-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-list-enter-to {
    opacity: 1;
    transform: translateY(0);
}
</style>