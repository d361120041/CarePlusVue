<template>
    <form @submit.prevent="submitPost" class="form-container">
        <div>
            <label>標題：</label>
            <input v-model="title" />
        </div>
        <div>
            <label>內容：</label>
            <textarea v-model="content"></textarea>
        </div>
        <button type="submit">送出</button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import myAxios from '@/plugins/axios.js';

const emit = defineEmits(['created']);

const title = ref('');
const content = ref('');

async function submitPost() {

    title.value = '新增貼文標題Vue'
    content.value = '新增貼文內容Vue'
    const payload = {
        title: title.value,
        content: content.value,
        user: {
            userId: 1
        }
    };

    const newPost = await myAxios.post('/api/posts', payload);
    emit('created', newPost.data);  // 提交成功後通知父元件
    title.value = ''; content.value = '';
}
</script>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-container input,
.form-container textarea {
    width: 100%;
    padding: .5rem;
}
</style>