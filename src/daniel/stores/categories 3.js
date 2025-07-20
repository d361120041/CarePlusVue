import { defineStore } from 'pinia'
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'

export const useCategoryStore = defineStore('categories', () => {
    // state
    const categories = ref([])
    const selectedIds = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // actions
    async function loadCategories() {
        isLoading.value = true
        error.value = null
        try {
            const res = await myAxios.get('/api/categories')
            categories.value = res.data.map(c => ({
                id: c.postCategoryId, 
                name: c.postCategory
            }))
        } catch (error) {
            error.value = error
        } finally {
            isLoading.value = false
        }
    }

    // 切換選中(多選)
    function toggleCategory(id) {
        const idx = selectedIds.value.indexOf(id)
        if (idx >= 0) {
            selectedIds.value.splice(idx, 1)
        } else {
            selectedIds.value.push(id)
        }
    }

    return {
        categories, selectedIds, 
        isLoading, error, 
        loadCategories, toggleCategory
    }
})