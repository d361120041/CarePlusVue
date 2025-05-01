import { computed } from 'vue'

/**
 * 傳入 ISO 日期字串，回傳 reactive 的 formattedTime
 * 支援：剛剛、分鐘前、小時前、昨天、完整日期
 */
export function useTimeFormat(createdAt) {
    const formattedTime = computed(() => {
        const now = Date.now()
        const created = new Date(createdAt).getTime()
        const diff = now - created

        if (diff < 60_000) {
            return '剛剛'
        }
        if (diff < 3_600_000) {
            const mins = Math.floor(diff / 60_000)
            return `${mins} 分鐘前`
        }
        if (diff < 86_400_000) {
            const hrs = Math.floor(diff / 3_600_000)
            return `${hrs} 小時前`
        }
        if (diff < 2 * 86_400_000) {
            const time = new Date(createdAt).toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit'
            })
            return `昨天 ${time}`
        }
        return new Date(createdAt).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    })

    return { formattedTime }
}
