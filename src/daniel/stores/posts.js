import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import myAxios from '@/plugins/axios.js'

export const usePostStore = defineStore('posts', () => {
    // —— state —— 
    const posts = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    
    // modal 狀態與目前編輯的貼文
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

    // 新增或編輯後同步貼文列表
    async function handleSaved(post) {
        closeModal()
        if (post.postId) {
            const index = posts.value.findIndex(p => p.postId === post.postId)
            if (index !== -1) {
                posts.value[index] = post
            } else {
                posts.value.unshift(post)
            }
        }
    }

    // 新增貼文
    async function createPost(payload) {
        isLoading.value = true
        error.value = null
        try {
            const res = await myAxios.post('/api/posts', payload)
            posts.value.unshift(res.data)
            console.log(`res.data->`,res.data)
            return res.data
        } catch (error) {
            error.value = error
        } finally {
            isLoading.value = false
        }
    }

    return {
        posts, isLoading, error, 
        isModalOpen, currentPost, 
        loadPosts, 
        openModal, closeModal, handleSaved,
        createPost

    }
})