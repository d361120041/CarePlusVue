<template>
    <article>
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>

        <!-- 圖片上傳元件 -->
        <PostImageUpload :postId="post.postId" @uploaded="reloadImages" />
        
        <!-- 圖片列表 -->
        <div class="post-images" v-if="post.images && post.images.length">
            <img v-for="img in post.images" :key="img.imageId" :src="`data:image/jpeg;base64,${img.imageData}`"
            alt="Post Image" />
        </div>
        
        <!-- 留言列表 -->
        <CommentList :postId="post.postId" />
        
    </article>
</template>

<script setup>
import myAxios from '@/plugins/axios.js';

import CommentList from '@/daniel/components/CommentList.vue';
import PostImageUpload from '@/daniel/components/PostImageUpload.vue';

const props = defineProps({ post: Object });

// 在上傳完成後重新讀取最新圖片
const reloadImages = async () => {
    try {
        const getImages = await myAxios.get(`/api/posts/${props.post.postId}/images`);
        // 直接更新 prop 內 images 欄位
        props.post.images = getImages.data;
    } catch (err) {
        console.error('載入圖片失敗:', err);
    }
};
</script>

<style scoped>
.post-images {
  margin-bottom: 1em;
}
.post-images img {
  max-width: 100px;
  margin-right: 10px;
}
</style>