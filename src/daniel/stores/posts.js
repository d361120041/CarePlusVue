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

    // 分頁相關
    const currentPage = ref(1)
    const pageSize = ref(5)
    const hasMore = ref(true)

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

    function edit(post) {
        closeDetailModal()
        openModal(post)
    }

    // 多條件查詢貼文
    async function loadPosts(filter = {}, { page = 1, append = false } = {}) {
        if (append && !hasMore.value) return  // 沒有更多就別再叫了

        isLoading.value = true
        error.value = null

        // 計算 start & rows
        const start = (page - 1) * pageSize.value
        const rows = pageSize.value

        try {

            const payload = {
                ...filter,
                start,
                rows,
            }

            const res = await myAxios.post('/api/posts/search', payload)
            // normalize 後端回來的資料
            const items = res.data.map(p => ({
                ...p,
                user: p.user || { userId: null, userName: '匿名', profilePicture: '' },
                postCategoryClassifiers: Array.isArray(p.postCategoryClassifiers) ? p.postCategoryClassifiers : [],
                reactions: Array.isArray(p.reactions) ? p.reactions : [],
                images: Array.isArray(p.images) ? p.images : [],
                views: typeof p.views === 'number' ? p.views : 0,
                share: typeof p.share === 'number' ? p.share : 0,
            }))

            if (append) {
                posts.value = posts.value.concat(items)
            } else {
                posts.value = items
            }

            currentPage.value = page
            hasMore.value = items.length === pageSize.value

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
            // 1. 新增或修改
            let res
            if (form.postId) {
                res = await myAxios.put(`/api/posts/${form.postId}`, {
                    title: form.title,
                    content: form.content,
                    visibility: form.visibility,
                    status: form.status,
                    userId: form.userId,
                    categoryIds: form.categoryIds,
                    topicIds: form.topicIds,
                    tagIds: form.tagIds,
                })
            } else {
                res = await myAxios.post('/api/posts', {
                    title: form.title,
                    content: form.content,
                    visibility: form.visibility,
                    status: form.status,
                    userId: form.userId,
                    categoryIds: form.categoryIds,
                    topicIds: form.topicIds,
                    tagIds: form.tagIds,
                })
            }
            const postId = res.data.postId

            // 2. 如果有檔案就上傳
            if (files.length) {
                const formData = new FormData()
                files.forEach(f => formData.append('files', f))
                await myAxios.post(`/api/posts/${postId}/images`, formData)
            }

            // 3. 再去拿一次完整貼文
            const detailRes = await myAxios.get(`/api/posts/${postId}`)
            let full = detailRes.data

            // 4. normalize：補陣列與預設值
            full = {
                ...full,
                user: full.user || { userId: null, userName: '匿名', profilePicture: '' },
                postCategoryClassifiers: Array.isArray(full.postCategoryClassifiers)
                    ? full.postCategoryClassifiers
                    : [],
                reactions: Array.isArray(full.reactions) ? full.reactions : [],
                images: Array.isArray(full.images) ? full.images : [],
                views: typeof full.views === 'number' ? full.views : 0,
                share: typeof full.share === 'number' ? full.share : 0,
            }

            // 5. 更新到 posts.value
            const idx = posts.value.findIndex(p => p.postId === postId)
            if (idx >= 0) {
                posts.value.splice(idx, 1, full)
            } else {
                posts.value.unshift(full)
            }

            closeModal()
            return full
        } catch (err) {
            error.value = err
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
            const newCount = res.data

            // 找到這筆貼文並更新它的 reactions 長度或 share 欄位
            const idx = posts.value.findIndex(p => p.postId === postId);
            if (idx !== -1) {
                posts.value[idx].reactions = Array(newCount).fill({});
                // 或者如果你的後端回傳完整 reactions 陣列就直接用 res.data.reactions
            }

            // 如果 detailPost 正好是這個貼文，也更新它
            if (detailPost.value?.postId === postId) {
                detailPost.value.reactions = posts.value[idx].reactions;
            }

            return newCount
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

    // 分享貼文，呼叫後端並同步更新 Pinia state
    async function sharePost(postId) {
        try {
            // 1. 呼叫後端 +1 分享
            const res = await myAxios.post(`/api/posts/${postId}/share`)
            // 假設後端回傳 { share: 新的分享數 }
            const newShareCount = res.data.share ?? res.data

            // 2. 更新列表中的分享數
            const idx = posts.value.findIndex(p => p.postId === postId)
            if (idx !== -1) {
                posts.value[idx].share = newShareCount
            }

            // 3. 如果 detailPost 正在開啟，也更新它
            if (detailPost.value?.postId === postId) {
                detailPost.value.share = newShareCount
            }
            return newShareCount
        } catch (err) {
            error.value = err
            throw err
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
        openModal, closeModal, edit,
        loadPosts, savePost, deletePost,
        deleteImage,
        like, view, sharePost,
        isDetailModalOpen, detailPost,
        openDetailModal, closeDetailModal,
        currentPage, pageSize, hasMore
    }
})