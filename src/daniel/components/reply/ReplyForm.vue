<template>
    <div style="margin-bottom: 10px;">
        <UserAvatar :imageUrl="imageUrl" />
        <textarea v-model="content" placeholder="輸入回覆..." rows="1"></textarea>
        <button @click="submit">送出回覆</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import myAxios from '@/plugins/axios.js'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({ commentId: Number })
const emit = defineEmits(['added'])
const authStore = useAuthStore()

const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

const content = ref('')

const submit = async () => {
    await myAxios.post('/api/replies', {
        content: content.value,
        user: {
            userId: authStore.user.userId
        },
        comment: {
            commentId: props.commentId
        },
    })
    content.value = ''
    emit('added')
}
</script>