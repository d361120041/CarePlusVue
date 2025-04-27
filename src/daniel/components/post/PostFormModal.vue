<template>
    <BaseModal :visible="visible" :title="title" @close="handleClose">
        <form @submit.prevent="submitAll" class="form-container">

            <!-- 文字欄位 -->
            <div>
                <label>標題：</label>
                <input v-model="form.title" required />
            </div>
            <div>
                <label>內容：</label>
                <textarea v-model="form.content" required></textarea>
            </div>

            <!-- 統一圖片預覽與刪除 -->
            <div v-if="thumbnails.length" class="form-images">
                <p>已選圖片：</p>
                <div class="thumb-wrapper" v-for="(thumb, idx) in thumbnails" :key="thumb.key">
                    <img class="thumb" :src="thumb.src" />
                    <button type="button" class="delete-btn" @click="removeThumbnail(thumb, idx)">✕</button>
                </div>
            </div>

            <!-- 圖片選擇 -->
            <div class="upload-form">
                <input ref="fileInput" type="file" multiple @change="onFileChange" accept="image/*" />
                <p v-if="files.length">{{ files.length }} 個新檔案已選</p>
            </div>

            <!-- 提交表單 -->
            <div class="modal-actions">
                <button type="submit" :disabled="isSubmitting">
                    {{ isEdit ? '更新貼文' : '送出貼文' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import myAxios from '@/plugins/axios.js'
import BaseModal from '@/daniel/components/BaseModal.vue'

const props = defineProps({
    visible: Boolean,
    post: { type: Object, default: null }
})
const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.post?.postId)
const title = computed(() => (isEdit.value ? '編輯貼文' : '新增貼文'))

// 表單欄位
const form = ref({ title: '', content: '' })
// 已選檔案與對應縮圖預覽
const files = ref([])
const previews = ref([])
// 編輯模式的現有圖片
const images = ref([])
const isSubmitting = ref(false)
// 檔案輸入欄位
const fileInput = ref(null)

// 初始化文字欄位
watch(
    () => props.visible,
    async v => {
        if (v) {
            form.value.title = props.post?.title || ''
            form.value.content = props.post?.content || ''
            // 一定要先清空暫存檔與縮圖
            files.value = []
            previews.value = []
            if (isEdit.value) {
                await loadImages()
            } else {
                images.value = []
            }
        }
    }
)

// 讀取現有後端圖片
async function loadImages() {
    try {
        const res = await myAxios.get(
            `/api/posts/${props.post.postId}/images`
        )
        images.value = res.data
    } catch (err) {
        console.error('載入圖片失敗', err)
    }
}

// 處理檔案選取與預覽
function onFileChange(e) {
    const selected = Array.from(e.target.files)
    selected.forEach((file, idx) => {
        files.value.push(file)
        const reader = new FileReader()
        reader.onload = ev => previews.value.push(ev.target.result)
        reader.readAsDataURL(file)
    })
    // 清空 input 預備下次同檔案可重新選
    if (fileInput.value) fileInput.value.value = ''
}

// 統一縮圖資料
const thumbnails = computed(() => {
    const exist = images.value.map(img => ({
        type: 'existing',
        key: `e-${img.imageId}`,
        id: img.imageId,
        src: `data:image/jpeg;base64,${img.imageData}`
    }))
    const newly = previews.value.map((src, idx) => ({
        type: 'new',
        key: `n-${idx}`,
        index: idx,
        src
    }))
    return [...exist, ...newly]
})

// 刪除已存在的圖片
async function deleteImage(id) {
    try {
        await myAxios.delete(`/api/posts/${props.post.postId}/images/${id}`)
        await loadImages()
    } catch (err) {
        console.error('刪除圖片失敗', err)
        alert('刪除圖片失敗')
    }
}

// 移除新選檔案
function removeFile(idx) {
    files.value.splice(idx, 1)
    previews.value.splice(idx, 1)
}

// 根據縮圖類型刪除
function removeThumbnail(thumb, idx) {
    if (thumb.type === 'existing') {
        deleteImage(thumb.id)
    } else {
        removeFile(thumb.index)
    }
}

// 提交資料：文字 + 新檔案上傳
async function submitAll() {
    if (!form.value.title || !form.value.content) return
    isSubmitting.value = true
    try {
        let res
        // 1. 文字貼文：POST 或 PUT
        if (isEdit.value) {
            res = await myAxios.put(
                `/api/posts/${props.post.postId}`,
                { 
                    title: form.value.title, 
                    content: form.value.content, 
                    user: { userId: 1 } 
                }
            )
        } else {
            res = await myAxios.post(
                '/api/posts',
                { 
                    title: form.value.title, 
                    content: form.value.content, 
                    user: { userId: 1 } 
                }
            )
        }
        const postId = res.data.postId

        // 2. 上傳新檔案
        if (files.value.length) {
            const formData = new FormData()
            files.value.forEach(f => formData.append('files', f))
            await myAxios.post(`/api/posts/${postId}/images`, formData)
        }

        // 3. 重新載入所有後端圖片，保留未刪除並包含新上傳
        if (isEdit.value) await loadImages()

        // 4. 清空暫存檔案與預覽
        files.value = []
        previews.value = []
        if (fileInput.value) fileInput.value.value = ''

        // 5. 通知父層並傳回更新後的貼文與圖片列表
        emit('saved', { ...res.data, images: images.value })
        handleClose()
    } catch (err) {
        console.error('送出失敗', err)
        alert('送出失敗，請稍後重試')
    } finally {
        isSubmitting.value = false
    }
}

function handleClose() {
    emit('close')
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
    padding: 0.5rem;
}

.form-images {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.5rem 0;
}

.thumb-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
}

.thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.delete-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    line-height: 1;
}

.upload-form {
    margin: 10px 0;
}

.modal-actions {
    text-align: right;
}

.modal-actions button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>