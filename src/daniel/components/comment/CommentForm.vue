<template>
    <div style="margin-bottom: 10px;">
        <UserAvatar :imageUrl="imageUrl"/>
        <textarea v-model="content" placeholder="輸入留言..." rows="1"></textarea>
        <button @click="submit">送出評論</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';

import myAxios from '@/plugins/axios.js'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ postId: Number })
const emit = defineEmits(['added'])
const authStore = useAuthStore()

const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

const content = ref('')

const submit = async () => {
    await myAxios.post('/api/comments', {
        content: content.value, 
        user: {
            userId: 3
        },
        post: { 
            postId: props.postId 
        }, 
    })
    content.value = ''
    emit('added')
}
</script>
