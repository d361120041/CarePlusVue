import { defineStore } from 'pinia'
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'

export const usePostStore = defineStore('posts', () => {
    // —— state —— 
    const posts = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const isModalOpen = ref(false)
    const currentPost = ref(null)

    // —— actions —— 
    // 多條件查詢貼文
    async function loadPosts(filter = {}) {
        isLoading.value = true
        error.value = null
        try {
            const res = await myAxios.post('/api/posts/search', filter)
            posts.value = res.data
        } catch (error) {
            error.value = error
        } finally {
            isLoading.value = false
        }
    }

    // 開啟新增/編輯 modal
    function openModal(post = null) {
        currentPost.value = post
        isModalOpen.value = true
    }

    // 關閉 modal
    function closeModal() {
        isModalOpen.value = false
    }

    async function savePost({ form, files }) {
        isLoading.value = true
        error.value = null
        try {
            let saved
            const payload = {
                title: form.title,
                content: form.content,
                visibility: form.visibility,
                status: form.status,
                userId: form.userId,
                categoryIds: form.categoryIds,
                topicIds: form.topicIds,
                tagIds: form.tagIds,
            }
            if (form.postId) {
                await myAxios.put(`/api/posts/${form.postId}`, payload)
                saved = { ...form }
            } else {
                const res = await myAxios.post('/api/posts', payload)
                saved = res.data
            }

            if (files.length) {
                const formData = new FormData()
                files.forEach(f => formData.append('files', f))
                await myAxios.post(`/api/posts/${saved.postId}/images`, formData)
            }
            
            const imagesRes = await myAxios.get(`/api/posts/${saved.postId}/images`)
            saved.images = imagesRes.data
            const idx = posts.value.findIndex(p => p.postId === saved.postId)

            if(idx >= 0) {
                posts.value.splice(idx, 1, saved)
            } else {
                posts.value.unshift(saved)
            }
            closeModal()
            return saved
        } catch (error) {
            error.value = error
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function deleteImage(postId, imageId) {
        try {
            await myAxios.delete(`/api/posts/${postId}/images/${imageId}`)
        } catch (error) {
            throw err
        }
    }

    return {
        posts, isLoading, error,
        isModalOpen, currentPost,
        loadPosts,
        openModal, closeModal, 
        savePost, deleteImage
    }
})