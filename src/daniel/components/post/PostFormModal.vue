<template>
    <BaseModal :visible="visible" :title="modalTitle" @close="$emit('close')">
        <form @submit.prevent="onSubmit" class="form-container">

            <!-- 使用者資訊區塊 -->
            <div class="user-header">
                <UserAvatar :imageUrl="imageUrl" />
                <div class="user-info">
                    <div class="user-name">{{ authStore.user.userName }}</div>
                </div>
            </div>

            <!-- 第一部分：分類與主題 -->
            <div v-if="step === 1">
                <!-- 貼文種類 -->
                <div class="form-group categories">
                    <label>貼文種類：</label>
                    <div class="toggle-buttons">
                        <button v-for="cat in allCategories" :key="cat.id" type="button" @click="toggleCategory(cat.id)"
                            :class="['toggle-btn', { active: form.categoryIds.includes(cat.id) }]">
                            {{ cat.name }}
                        </button>
                    </div>
                </div>

                <!-- 貼文主題 -->
                <div class="form-group topics">
                    <label>貼文主題：</label>
                    <div class="toggle-buttons">
                        <button v-for="top in allTopics" :key="top.id" type="button" @click="toggleTopic(top.id)"
                            :class="['toggle-btn', { active: form.topicIds.includes(top.id) }]">
                            {{ top.name }}
                        </button>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" @click="nextStep" :disabled="!canProceedToContent"
                        class="btn-tertiary btn">下一步</button>
                </div>
            </div>

            <!-- 第二部分：文字與圖片 -->
            <div v-else>

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
                    <button type="button" @click="prevStep" class="btn-tertiary btn">上一步</button>
                    <button type="submit" :disabled="postStore.isLoading" class="btn-primary btn">
                        {{ submitText }}
                    </button>
                </div>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories'
import { useTopicStore } from '@/daniel/stores/topics'
import { useAuthStore } from '@/stores/auth'

import myAxios from '@/plugins/axios'
import BaseModal from '@/daniel/components/BaseModal.vue'
import UserAvatar from '@/daniel/components/user/UserAvatar.vue'

const props = defineProps({
    visible: Boolean,
    post: { type: Object }
})
const emit = defineEmits(['close', 'saved'])

const postStore = usePostStore()
const categoryStore = useCategoryStore()
const topicStore = useTopicStore()
const authStore = useAuthStore()

// 控制是否可進入第二步：至少選一類別或主題
const step = ref(1)
const canProceedToContent = computed(
    () => form.value.categoryIds.length > 0 && form.value.topicIds.length > 0
)
// 步驟控制
function nextStep() { step.value = 2 }
function prevStep() { step.value = 1 }

// 使用者頭貼
const currentUser = authStore.user

const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

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
    userId: authStore.user.userId
})
const files = ref([])
const previews = ref([])
const fileInput = ref(null)
const existingImages = ref([])

const isEdit = computed(() => !!form.value.postId)
const modalTitle = computed(() => isEdit.value ? '編輯貼文' : '新增貼文')
const submitText = computed(() => isEdit.value ? '更新貼文' : '送出貼文')
const allCategories = computed(() => categoryStore.categories)
const allTopics = computed(() => topicStore.topics)

watch(() => props.visible, async open => {
    if (!open) return

    // 重置
    step.value = 1
    files.value = []
    previews.value = []
    existingImages.value = []
    categoryStore.loadCategories()
    topicStore.loadTopics()
    if (fileInput.value) fileInput.value.value = ''

    if (props.post?.postId) {
        // 載入舊圖
        await loadImages(props.post.postId)

        // 將後端的已選分類取出 ID
        const selectedCatIds = props.post.postCategoryClassifiers
            .map(pcc => pcc.postCategory.postCategoryId)
        const selectedTopIds = props.post.postTopicClassifiers
            .map(ptc => ptc.postTopic.postTopicId)

        Object.assign(form.value, {
            postId: props.post.postId,
            title: props.post.title,
            content: props.post.content,
            categoryIds: [...selectedCatIds],
            topicIds: [...selectedTopIds],
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

function toggleTopic(id) {
    const idx = form.value.topicIds.indexOf(id)
    if (idx >= 0) form.value.topicIds.splice(idx, 1)
    else form.value.topicIds.push(id)
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

.user-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.user-info {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
}

.user-name {
    font-weight: bold;
}

.toggle-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.toggle-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-primary);
    border-radius: 4px;
    background: #f9f9f9;
    transition: all 0.2s;
    cursor: pointer;
}

.toggle-btn:hover {
    transform: scale(1.05);
    background: var(--color-primary);
    color: #fff;
}

.toggle-btn.active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
}

/* 通用按鈕樣式 */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    color: #fff;
}

.btn-primary {
    background: var(--color-primary);
}

.btn-primary:hover {
    background: #45a499;
    /* 主色深版 */
}

.btn-secondary {
    background: var(--color-secondary);
}

.btn-secondary:hover {
    background: #e68a8a;
    /* 次色深版 */
}

.btn-tertiary {
    background: var(--color-tertiary);
}

.btn-tertiary:hover {
    background: #378bc6;
    /* 輔助色深版 */
}

/* .categories {
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
} */

.form-container input,
.form-container textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-images {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    /* margin: 0.5rem 0; */
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
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem
}

.modal-actions button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>