<template>
    <h1>Social</h1>
    <button @click="isModalOpen = true">新增貼文</button>
    <PostList ref="postListRef" />

    <!-- 將 Modal 與表單元件放在同一層級 -->
    <BaseModal :visible="isModalOpen" title="新增貼文" @close="isModalOpen = false">
        <CreatePostForm @created="onPostCreated" />
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import PostList from '@/daniel/components/PostList.vue'
import BaseModal from '@/daniel/components/BaseModal.vue'
import CreatePostForm from '@/daniel/components/CreatePostForm.vue'

const isModalOpen = ref(false)
const postListRef = ref(null)

// 貼文建立後：關閉 Modal，並重載貼文列表
function onPostCreated(newPost) {
    isModalOpen.value = false;
    postListRef.value.reloadPosts()
}

</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    padding: 20px;
}

h1 {
    margin-bottom: 1rem;
}

button {
    margin-bottom: 1rem;
}
</style>