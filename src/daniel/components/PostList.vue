<template>
    <div>
        <div v-for="post in posts" :key="post.postId">
            <PostItem :post="post" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import myAxios from '@/plugins/axios.js'
import PostItem from '@/daniel/components/PostItem.vue';

const posts = ref([]);

const reloadPosts = async () => {
    const getPosts = await myAxios.get('/api/posts');
    posts.value = getPosts.data
}
onMounted(reloadPosts)

defineExpose({ reloadPosts })

</script>