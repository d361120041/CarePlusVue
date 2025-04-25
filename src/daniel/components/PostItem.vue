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

        <!-- 觀看次數 -->
        <small>{{ post.title }} (已觀看：{{ post.views }} 次)</small>

        <!-- 分享貼文 -->
        <button @click="sharePost">
            <small>分享 (已分享：{{ shareCount }} 次)</small>
        </button>
    </article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import myAxios from '@/plugins/axios.js';
import CommentList from '@/daniel/components/CommentList.vue';
import PostImageUpload from '@/daniel/components/PostImageUpload.vue';

const props = defineProps({ post: Object });
const shareCount = ref(props.post.share || 0)

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

// 更新觀看次數
onMounted(async () => {
    try {
        await myAxios.post(`/api/posts/${props.post.postId}/view`);
    } catch (e) {
        console.error('更新觀看次數失敗', e);
    }
});

// 更新分享次數
const sharePost = async () => {
    try {
        // 1. 觸發實際的分享機制，如 navigator.share()、社群 SDK 等
        await navigator.share({
            title: props.post.title,
            text: props.post.content,
            url: window.location.href
        });
        // 2. 成功後呼叫後端
        await myAxios.post(`/api/posts/${props.post.postId}/share`);
        shareCount.value++;
    } catch (e) {
        console.error('分享失敗或使用者取消', e);
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