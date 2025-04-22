<template>
    <div class="upload-form">
        <input type="file" multiple @change="onFileChange" />
        <button @click="upload" :disabled="!files.length">上傳圖片</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import myAxios from '@/plugins/axios.js';

const props = defineProps({
    postId: Number
});
const emit = defineEmits(['uploaded']);
const files = ref([]);

// 當檔案選好後存到 ref
const onFileChange = (e) => {
    files.value = Array.from(e.target.files);
};

// 將檔案組成 FormData，上傳到後端
const upload = async () => {
    if (!files.value.length) return;
    const form = new FormData();
    files.value.forEach(file => form.append('files', file));
    try {
        await myAxios.post(`/api/posts/${props.postId}/images`, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        files.value = [];
        emit('uploaded');  // 通知父元件刷新圖片
    } catch (err) {
        console.error('圖片上傳失敗:', err);
    }
};
</script>

<style scoped>
.upload-form {
    margin: 10px 0;
}

.upload-form button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>