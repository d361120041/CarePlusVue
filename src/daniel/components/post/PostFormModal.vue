<template>
    <BaseModal :visible="visible" :title="modalTitle" @close="$emit('close')">
        <form @submit.prevent="onSubmit" class="form-container">

            <!-- 分類選擇 -->
            <div class="form-group categories">
                <label>貼文種類：</label>
                <div class="category-buttons">
                    <button v-for="cat in allCategories" :key="cat.id" type="button" @click="toggleCategory(cat.id)"
                        :class="['category-btn', { active: form.categoryIds.includes(cat.id) }]">
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <!-- 文字欄位 -->
            <div class="form-group">
                <label>標題：</label>
                <input v-model="form.title" required />
            </div>
            <div class="form-group">
                <label>內容：</label>
                <textarea v-model="form.content" required></textarea>
            </div>

            <!-- 圖片縮圖列表 -->
            <div v-if="thumbnails.length" class="form-images">
                <p>已選圖片：</p>
                <div class="thumb-wrapper" v-for="(thumb, idx) in thumbnails" :key="thumb.key">
                    <img class="thumb" :src="thumb.src" />
                    <button type="button" class="delete-btn" @click="removeThumbnail(thumb, idx)">✕</button>
                </div>
            </div>

            <!-- 選擇圖片 -->
            <div class="upload-form">
                <input ref="fileInput" type="file" multiple @change="onFileChange" accept="image/*" />
                <p v-if="files.length">{{ files.length }} 個新檔案已選</p>
            </div>

            <!-- 提交表單 -->
            <div class="modal-actions">
                <button type="submit" :disabled="postStore.isLoading">
                    {{ submitText }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories'
import { useAuthStore } from '@/stores/auth'

import myAxios from '@/plugins/axios'
import BaseModal from '@/daniel/components/BaseModal.vue'

const props = defineProps({
    visible: Boolean,
    post: { type: Object }
})
const emit = defineEmits(['close', 'saved'])
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore() 

const currentUser = authStore.user

// form data
const form = ref({
    postId: null,
    title: '',
    content: '',
    categoryIds: [],
    topicIds: [],
    tagIds: [],
    visibility: 0,
    status: 0,
    userId: 3
})
const files = ref([])
const previews = ref([])
const fileInput = ref(null)
const existingImages = ref([])

const isEdit = computed(() => !!form.value.postId)
const modalTitle = computed(() => isEdit.value ? '編輯貼文' : '新增貼文')
const submitText = computed(() => isEdit.value ? '更新貼文' : '送出貼文')
const allCategories = computed(() => categoryStore.categories)

watch(() => props.visible, async open => {
    if (!open) return
    files.value = []
    previews.value = []
    existingImages.value = []

    if (fileInput.value) fileInput.value.value = ''

    if (props.post?.postId) {
        await loadImages(props.post.postId)
        Object.assign(form.value, {
            postId: props.post.postId,
            title: props.post.title,
            content: props.post.content,
            categoryIds: [...(props.post.categoryIds) || []],
            topicIds: [...(props.post.topicIds || [])],
            tagIds: [...(props.post.tagIds || [])],
            visibility: props.post.visibility,
            status: props.post.status,
            userId: props.post.user.userId,
        })
    } else {
        Object.assign(form.value, {
            postId: null,
            title: '',
            content: '',
            categoryIds: [],
            topicIds: [],
            tagIds: [],
            visibility: 0,
            status: 0,
            userId: currentUser.userId,
        })
        existingImages.value = []
    }
})

function toggleCategory(id) {
    const idx = form.value.categoryIds.indexOf(id)
    if (idx >= 0) {
        form.value.categoryIds.splice(idx, 1)
    }
    else form.value.categoryIds.push(id)
}

async function loadImages(postId) {
    if (!postId) return
    const res = await myAxios.get(`/api/posts/${postId}/images`)
    existingImages.value = res.data.map(img => ({
        id: img.imageId,
        src: `data:image/jpeg;base64,${img.imageData}`
    }))
}

const thumbnails = computed(() => [
    // 既有圖片：保留 id, src, 並標記 type
    ...existingImages.value.map(img => ({
        id: img.id,
        src: img.src,
        type: 'existing'
    })),
    // 新選檔案
    ...previews.value.map((src, i) => ({
        src,
        type: 'new',
        index: i
    }))
])

async function removeThumbnail(thumb) {
    if (thumb.type === 'existing') {
        await postStore.deleteImage(props.post.postId, thumb.id)
        existingImages.value = existingImages.value.filter(img => img.id !== thumb.id)
    } else {
        files.value.splice(thumb.index, 1)
        previews.value.splice(thumb.index, 1)
    }
}

function onFileChange(e) {
    const selected = Array.from(e.target.files)
    selected.forEach(file => {
        files.value.push(file)
        const reader = new FileReader()
        reader.onload = ev => previews.value.push(ev.target.result)
        reader.readAsDataURL(file)
    })
    if (fileInput.value) fileInput.value.value = ''
}

async function onSubmit() {
    try {
        const saved = await postStore.savePost({
            form: form.value,
            files: files.value
        })
        emit('saved', saved)
    } catch (error) {
        alert('送出失敗，請稍後重試')
    }
}

function onClose() {
    
}
</script>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem
}

.categories {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap
}

.category-buttons button {
    margin-right: 0.5rem
}

.category-btn {
    padding: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background: #f0f0f0;
    transition: all .2s;
}

.category-btn:hover {
    background: #e0e0e0
}

.category-btn.active {
    background: #007bff;
    color: #fff;
    border-color: #0056b3;
    transform: scale(1.05)
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