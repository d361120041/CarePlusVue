<template>
    <!-- <router-link to="/user-center/myPost"> -->
    <img class="user-avatar" :src="src" alt="User Avatar" />
    <!-- </router-link> -->

</template>

<script setup>
import { computed } from 'vue'
import defaultAvatar from '@/assets/defaultImg/default-avatar.jpg'

const props = defineProps({
    imageUrl: {
        type: String,
        default: ''
    }
})

const src = computed(() => {
    if (props.imageUrl === 'data:image/png;base64,null') {
        return defaultAvatar
    }
    return props.imageUrl
})
</script>

<style scoped>
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
    object-fit: cover;
    /* ← 核心：裁切填滿容器，保留比例 */
    object-position: center;
    /* ← 可選：決定裁切的圖片焦點 */
}

/* .user-avatar:hover {
    transform: scale(1.01);
} */
</style>