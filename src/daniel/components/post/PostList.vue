<template>
    <div>
        <PostItem v-for="post in postStore.posts" :key="post.postId" :post="post" @edit="() => $emit('edit-post', post)"
            @refresh="loadAgain" />
    </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import PostItem from '@/daniel/components/post/PostItem.vue'

const postStore = usePostStore()

const props = defineProps({
    filterCategoryIds: { filterCategoryIds: Array }
})

function loadAgain() {
    postStore.loadPosts({
        postCategoryIds: props.filterCategoryIds
    })
}

onMounted(() => {
    watch(() => props.filterCategoryIds, loadAgain, { deep: true })
})

watch(
    () => props.filterCategoryIds,
    () => loadAgain(),
    { deep: true }
)
</script>