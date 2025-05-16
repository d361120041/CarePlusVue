<!-- src/daniel/components/FilterModal.vue -->
<template>
    <BaseModal :visible="visible" title="篩選我的貼文" @close="onClose">
        <form @submit.prevent="onApply" class="filter-form">

            <!-- 關鍵字輸入區 -->
            <div class="field-group">
                <label>標題關鍵字</label>
                <input v-model="local.titleKeyword" type="text" placeholder="輸入標題…" class="filter-input" />
            </div>

            <!-- 內容關鍵字 -->
            <div class="field-group">
                <label>內容關鍵字</label>
                <input v-model="local.contentKeyword" type="text" placeholder="輸入內容…" class="filter-input" />
            </div>

            <!-- 日期篩選：格線布局 -->
            <div class="date-range">
                <div class="date-field">
                    <span>建立時間 起</span>
                    <div class="select-group">
                        <select v-model.number="local.startYear" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 年</option>
                            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                        </select>
                        <select v-model.number="local.startMonth" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 月</option>
                            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </div>
                </div>
                <div class="date-field">
                    <span>建立時間 訖</span>
                    <div class="select-group">
                        <select v-model.number="local.endYear" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 年</option>
                            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                        </select>
                        <select v-model.number="local.endMonth" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 月</option>
                            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- 分類與主題按鈕 -->
            <div>
                <label>分類</label>
                <div class="toggle-buttons">
                    <button v-for="cat in categories" :key="cat.id" type="button" @click="toggleCat(cat.id)"
                        :class="['toggle-btn', { active: local.postCategoryIds.includes(cat.id) }]">
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <!-- 主題按鈕 -->
            <div class="field-group">
                <label>主題</label>
                <div class="toggle-buttons">
                    <button v-for="topic in topics" :key="topic.id" type="button" @click="toggleTopic(topic.id)"
                        :class="['toggle-btn', { active: local.postTopicIds.includes(topic.id) }]">
                        {{ topic.name }}
                    </button>
                </div>
            </div>
        </form>

        <template #footer>
            <!-- 按鈕區：sticky at bottom -->
            <div class="actions-bar">
                <button type="button" @click="onClear" class="action-clear">
                    清除條件
                </button>
                <button type="button" @click="onClose" class="action-cancel">
                    取消
                </button>
                <button type="submit" @click="onApply" class="action-apply">
                    套用篩選
                </button>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import BaseModal from '@/daniel/components/BaseModal.vue'

const props = defineProps({
    visible: Boolean,
    initial: Object,
    categories: Array,
    topics: Array
})
const emit = defineEmits(['apply', 'clear', 'close'])

// 本地副本，避免直接改父層
const local = reactive({
    titleKeyword: props.initial.titleKeyword || null,
    contentKeyword: props.initial.contentKeyword || null,
    startYear: props.initial.startYear ?? null,
    startMonth: props.initial.startMonth ?? null,
    endYear: props.initial.endYear ?? null,
    endMonth: props.initial.endMonth ?? null,
    postCategoryIds: [...(props.initial.postCategoryIds || [])],
    postTopicIds: [...(props.initial.postTopicIds || [])],
    sortDir: `${props.initial.sort},${props.initial.dir}`
})

// 如果 initial props 更新，同步 local
watch(
    () => props.initial,
    (newInit) => {
        local.titleKeyword = newInit.titleKeyword || null
        local.contentKeyword = newInit.contentKeyword || null
        local.startYear = newInit.startYear ?? null
        local.startMonth = newInit.startMonth ?? null
        local.endYear = newInit.endYear ?? null
        local.endMonth = newInit.endMonth ?? null
        local.postCategoryIds = [...(newInit.postCategoryIds || [])]
        local.postTopicIds = [...(newInit.postTopicIds || [])]
        local.sortDir = `${newInit.sort},${newInit.dir}`
    }
)

// 年份陣列 1980–2025
const years = Array.from({ length: 46 }, (_, i) => 1980 + i)
// 月份 1–12
const months = Array.from({ length: 12 }, (_, i) => i + 1)

function toggleCat(id) {
    const i = local.postCategoryIds.indexOf(id)
    if (i === -1) local.postCategoryIds.push(id)
    else local.postCategoryIds.splice(i, 1)
}

function toggleTopic(id) {
    const i = local.postTopicIds.indexOf(id)
    if (i === -1) local.postTopicIds.push(id)
    else local.postTopicIds.splice(i, 1)
}

function onApply() {
    const [sort, dir] = local.sortDir.split(',')
    let s = null
    let e = null
    if (local.startYear != null && local.startMonth != null) {
        s = new Date(local.startYear, local.startMonth - 1, 1, 0, 0, 0)
    }
    if (local.endYear != null && local.endMonth != null) {
        e = new Date(local.endYear, local.endMonth, 0, 23, 59, 59)
    }
    emit('apply', {
        titleKeyword: local.titleKeyword,
        contentKeyword: local.contentKeyword,
        startTime: s ? s.toISOString() : null,
        endTime: e ? e.toISOString() : null,
        postCategoryIds: local.postCategoryIds.length ? local.postCategoryIds : null,
        postTopicIds: local.postTopicIds.length ? local.postTopicIds : null,
        sort,
        dir
    })
    emit('close')
}

function onClear() {
    local.titleKeyword = null
    local.contentKeyword = null
    local.startYear = null
    local.startMonth = null
    local.endYear = null
    local.endMonth = null
    local.postCategoryIds = []
    local.postTopicIds = []
    local.sortDir = 'createdAt,asc'
    emit('clear')
}

function onClose() {
    emit('close')
}
</script>

<style scoped>
.filter-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    /* max-height: 80vh; */
    /* overflow-y: auto; */
    position: relative;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-input,
select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.2s;
}

.filter-input:focus,
select:focus {
    border-color: var(--color-primary);
    outline: none;
}

.date-range {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
}

.select-group {
    display: flex;
    gap: 0.5rem;
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
    color: #fff;
    transform: scale(1.05);
    background: var(--color-primary);
}

.toggle-btn.active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
}

.actions-bar {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1.25rem 1rem;
    border-top: 1px solid #eee;
}

.action-clear,
.action-cancel,
.action-apply {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.action-clear {
    background: var(--color-tertiary);
    color: #fff;
}

.action-clear:hover {
    background: #378bc6;
}

.action-cancel {
    background: var(--color-secondary);
    color: #fff;
}

.action-cancel:hover {
    background: #e68a8a;
}

.action-apply {
    background: var(--color-primary);
    color: #fff;
}

.action-apply:hover {
    background: #45a499;
}

/* 小螢幕調整 */
@media (max-width: 640px) {
    .actions-bar {
        flex-direction: column-reverse;
        align-items: stretch;
        gap: 0.75rem;
    }
}
</style>