<template>
    <!-- <router-link to="/user-center/myPost"> -->
        <img class="user-avatar" :src="src" alt="User Avatar" />
    <!-- </router-link> -->

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    imageUrl: {
        type: String,
        default: '@/assets/daniel/circle-user-solid.svg'
    }
})

const src = computed(() => props.imageUrl || '@/assets/daniel/circle-user-solid.svg')
</script>

<style scoped>
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    /* margin-right: 0.5rem; */
    transition: transform 0.2s, box-shadow 0.2s;
    /* cursor: pointer; */
    /* box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.15); */
}

/* .user-avatar:hover {
    transform: scale(1.01);
} */
</style>