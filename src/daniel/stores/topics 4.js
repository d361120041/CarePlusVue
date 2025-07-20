/* File: src/daniel / stores / topics.js */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import myAxios from '@/plugins/axios.js'

export const useTopicStore = defineStore('topics', () => {
    // state
    const topics = ref([])
    const selectedIds = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // actions
    async function loadTopics() {
        isLoading.value = true
        error.value = null
        try {
            const res = await myAxios.get('/api/topics')
            topics.value = res.data.map(t => ({
                id: t.postTopicId,
                name: t.topic
            }))
        } catch (err) {
            error.value = err
        } finally {
            isLoading.value = false
        }
    }

    function toggleTopic(id) {
        const idx = selectedIds.value.indexOf(id)
        if (idx >= 0) {
            selectedIds.value.splice(idx, 1)
        } else {
            selectedIds.value.push(id)
        }
    }

    return {
        topics,
        selectedIds,
        isLoading,
        error,
        loadTopics,
        toggleTopic
    }
})
