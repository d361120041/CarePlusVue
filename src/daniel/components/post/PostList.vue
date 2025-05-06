<template>
    <div>
        <PostItem v-for="post in postStore.posts" :key="post.postId" :post="post" 
        @refresh="$emit('refresh')" />
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