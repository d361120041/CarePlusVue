<template>
    <div>
        <PostItem v-for="post in postStore.posts" :key="post.postId" :post="post" 
        @edit-post="() => $emit('edit-post', post)"
        @delete-post="() => $emit('delete-post', post)"
        @refresh="loadAgain" />
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import PostItem from '@/daniel/components/post/PostItem.vue'

const props = defineProps({
    filterCategoryIds: { 
        type: Array,
        default: () => []
    }
})

const emit = defineEmits([
    'edit-post', 'delete-post', 'refresh'
])

function loadAgain() {
    postStore.loadPosts({
        postCategoryIds: props.filterCategoryIds
    })
}

const postStore = usePostStore()

onMounted(loadAgain)

watch(
    () => props.filterCategoryIds,
    () => loadAgain(),
    { deep: true }
)
</script>