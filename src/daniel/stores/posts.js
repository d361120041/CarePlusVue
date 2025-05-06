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
    const isDetailModalOpen = ref(false)
    const detailPost = ref(null)

    // —— actions —— 
    // 開啟新增/編輯 modal
    function openModal(post = null) {
        currentPost.value = post
        isModalOpen.value = true
    }

    // 關閉 modal
    function closeModal() {
        isModalOpen.value = false
    }

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
    
    // 新增或修改貼文
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
                const res = await myAxios.put(`/api/posts/${form.postId}`, payload)
                saved = res.data
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

    // 刪除貼文
    async function deletePost(postId) {
        isLoading.value = true
        error.value = null
        try {
            await myAxios.delete(`/api/posts/${postId}`)
            posts.value = posts.value.filter(p => p.postId !== postId)
        } catch (error) {
            error.value = error
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 刪除圖片
    async function deleteImage(postId, imageId) {
        try {
            await myAxios.delete(`/api/posts/${postId}/images/${imageId}`)
        } catch (error) {
            throw error
        }
    }

    // 按讚，傳回最新按讚數
    async function like(postId, userId) {
        try {
            const res = await myAxios.post(
                `/api/reactions/posts/${postId}?userId=${userId}&type=1`
            )
            return res.data
        } catch (error) {
            error.value = error
            throw error
        }
    }

    // 更新瀏覽次數(+1)
    async function view(postId) {
        try {
            await myAxios.post(`/api/posts/${postId}/view`)
        } catch (error) {
            error.value = error
        }
    }

    // 分享貼文
    async function share(postId) {
        try {
            await myAxios.post(`/api/posts/${postId}/share`)
        } catch (error) {
            error.value = error
        }
    }

    function openDetailModal(post) {
        detailPost.value = post
        isDetailModalOpen.value = true
    }

    function closeDetailModal() {
        detailPost.value = null
        isDetailModalOpen.value = false
    }

    return {
        posts, isLoading, error,
        isModalOpen, currentPost,
        openModal, closeModal, 
        loadPosts, savePost, deletePost, 
        deleteImage,
        like, view, share,
        isDetailModalOpen, detailPost, 
        openDetailModal, closeDetailModal
    }
})