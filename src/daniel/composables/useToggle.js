import { ref } from 'vue'

/**
 * 管理 boolean 開關，預設 false
 * 可傳入初始值或一個 ref，回傳 [state, toggleFn]
 */
export function useToggle(initial = false) {
    const state = ref(initial)

    function toggle(val) {
        // 如果直接傳 boolean，就設成該值；否則切換
        state.value = typeof val === 'boolean' ? val : !state.value
    }

    return [state, toggle]
}
