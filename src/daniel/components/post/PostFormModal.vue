<template>
    <BaseModal :visible="visible" :title="modalTitle" @close="onClose">
        <form @submit.prevent="onSubmit" class="form-container">

            <!-- 分類選擇 -->
            <div class="form-group categories">
                <label>貼文種類：</label>
                <div class="category-buttons">
                    <button v-for="cat in allCategories" :key="cat.id" type="button"
                        @click="toggleCategory(cat.id)"
                        :class="{ 'category-btn': true, active: form.categoryIds.includes(cat.id) }">
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
// import myAxios from '@/plugins/axios.js'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories'
import BaseModal from '@/daniel/components/BaseModal.vue'

const props = defineProps({
    visible: Boolean,
    post: { type: Object }
})
const emit = defineEmits(['close', 'saved'])
const postStore = usePostStore()
const categoryStore = useCategoryStore()

// 表單欄位
// const form = ref({ title: '', content: '', category: null })

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
const fileInput = ref([])

const isEdit = computed(() => !!form.value.postId)
// const title = computed(() => (isEdit.value ? '編輯貼文' : '新增貼文'))
const modalTitle = computed(() => isEdit.value ? '編輯貼文' : '新增貼文')
const submitText = computed(() => isEdit.value ? '更新貼文' : '送出貼文')

// ================= 貼文種類 開始 =================
// const categories = ref([])
// const selectedCategory = ref(null)
const allCategories = computed(() => categoryStore.categories)

watch(() => props.visible, async open => {
    if(open) {
        if(!categoryStore.categories.length) await categoryStore.loadCategories()
        if (props.post) {
            Object.assign(form.value, {
                postId: props.post.postId,
                title: props.post.title,
                content: props.post.content,
                categoryIds: [...(props.post.categoryIds) || []],
                topicIds: [...(props.post.topicIds || [])],
                tagIds: [...(props.post.tagIds || [])],
                visibility: props.post.visibility,
                status: props.post.status,
                userId: props.post.userId
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
                userId: 3
            })
        }
    }
})

// 統一縮圖資料
// const thumbnails = computed(() => {
//     const exist = images.value.map(img => ({
//         type: 'existing',
//         key: `e-${img.imageId}`,
//         id: img.imageId,
//         src: `data:image/jpeg;base64,${img.imageData}`
//     }))
//     const newly = previews.value.map((src, idx) => ({
//         type: 'new',
//         key: `n-${idx}`,
//         index: idx,
//         src
//     }))
//     return [...exist, ...newly]
// })

// thumbnails: combine existing + new
const thumbnails = computed(() => {
    const existing = (props.post?.image || []).map(img => ({
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
    return [...existing, ...newly]
})

function toggleCategory(id) {
    const idx = form.value.categoryIds.indexOf(id)
    if (idx >= 0) {
        form.value.categoryIds.splice(idx, 1)
    }
    else form.value.categoryIds.push(id)
}

// 處理檔案選取與預覽
// function onFileChange(e) {
//     const selected = Array.from(e.target.files)
//     selected.forEach((file, idx) => {
//         files.value.push(file)
//         const reader = new FileReader()
//         reader.onload = ev => previews.value.push(ev.target.result)
//         reader.readAsDataURL(file)
//     })
//     // 清空 input 預備下次同檔案可重新選
//     if (fileInput.value) fileInput.value.value = ''
// }

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

// 根據縮圖類型刪除
// function removeThumbnail(thumb, idx) {
//     if (thumb.type === 'existing') {
//         deleteImage(thumb.id)
//     } else {
//         removeFile(thumb.index)
//     }
// }

async function removeThumbnail(thumb, idx) {
    if (thumb.type === 'existing') {
        await postStore.deleteImage(form.value.postId, thumb.id)
    } else {
        files.value.splice(thumb.index, 1)
        previews.value.splice(thumb.index, 1)
    }
}

// 載入分類
// onMounted(async () => {
//     try {
//         const res = await myAxios.get('/api/categories')
//         const list = res.data;
//         categories.value = list
//     } catch {
//         categories.value = []
//     }
// })
// 顯示分類
// const displayedCategories = computed(() => {
//     return !selectedCategory.value
//         ? categories.value
//         : [selectedCategory.value];
// })
// 選擇分類
// function selectCategory(cat) {
//     if (selectedCategory.value === cat) {
//         selectedCategory.value = null;
//         form.value.category = null;
//     } else {
//         selectedCategory.value = cat;
//         form.value.category = cat.postCategory;
//     }
// }
// ================= 貼文種類 結束 =================

// 已選檔案與對應縮圖預覽
// const files = ref([])
// const previews = ref([])
// 編輯模式的現有圖片
// const images = ref([])
// const isSubmitting = ref(false)
// 檔案輸入欄位
// const fileInput = ref(null)

// 初始化文字欄位
// watch(
//     () => props.visible,
//     async v => {
//         if (v) {
//             form.value.title = props.post?.title || ''
//             form.value.content = props.post?.content || ''
//             // 一定要先清空暫存檔與縮圖
//             files.value = []
//             previews.value = []
//             if (isEdit.value) {
//                 await loadImages()
//             } else {
//                 images.value = []
//             }
//         }
//     }
// )

// 讀取現有後端圖片
// async function loadImages() {
//     try {
//         const res = await myAxios.get(
//             `/api/posts/${props.post.postId}/images`
//         )
//         images.value = res.data
//     } catch (err) {
//         console.error('載入圖片失敗', err)
//     }
// }

// 刪除已存在的圖片
// async function deleteImage(id) {
//     try {
//         await myAxios.delete(`/api/posts/${props.post.postId}/images/${id}`)
//         await loadImages()
//     } catch (err) {
//         console.error('刪除圖片失敗', err)
//         alert('刪除圖片失敗')
//     }
// }

// 移除新選檔案
// function removeFile(idx) {
//     files.value.splice(idx, 1)
//     previews.value.splice(idx, 1)
// }

// 提交資料：文字 + 新檔案上傳
// async function submitAll() {
//     if (!form.value.title || !form.value.content) return
//     isSubmitting.value = true
//     try {
//         // （1）送文字貼文
//         let postRes
//         if (isEdit.value) {
//             postRes = await myAxios.put(
//                 `/api/posts/${props.post.postId}`,
//                 {
//                     title: form.value.title,
//                     content: form.value.content,
//                     user: { userId: 3 }
//                 }
//             )
//         } else {
//             const payload = {
//                 title: form.value.title,
//                 content: form.value.content,
//                 visibility: 0,
//                 status: 0,
//                 userId: 3,
//                 categoryIds: [4, 5],
//                 topicIds: [1, 2],
//                 tagIds: []
//             }
//             postRes = postStore.createPost(payload)
//             console.log(`postRes->`,postRes)
//         }
//         const resPostId = postRes.postId

//         // （2）送圖片
//         if (files.value.length) {
//             const formData = new FormData()
//             files.value.forEach(f => formData.append('files', f))
//             await myAxios.post(`/api/posts/${resPostId}/images`, formData)
//         }

        // （3）指派分類
        // if (selectedCategory.value && selectedCategory.value.postCategoryId) {
        //     await myAxios.post(
        //         `/api/categories/assign`,
        //         null,
        //         {
        //             params: {
        //                 postId: resPostId,
        //                 categoryId: selectedCategory.value.postCategoryId
        //             }
        //         }
        //     );
        // }

        // （4）重新載入圖片、清空暫存、關閉 Modal
//         if (isEdit.value) await loadImages()
//         files.value = []
//         previews.value = []
//         if (fileInput.value) fileInput.value.value = ''

//         emit('saved', { ...postRes.data, images: images.value })
//         handleClose()
//     } catch (err) {
//         console.error('送出失敗', err)
//         alert('送出失敗，請稍後重試')
//     } finally {
//         isSubmitting.value = false
//     }
// }

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
    emit('close')
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