<!-- src/daniel/components/FilterModal.vue -->
<template>
    <BaseModal :visible="visible" title="篩選我的貼文" @close="onClose">
        <form @submit.prevent="onApply" class="space-y-4">

            <!-- 標題關鍵字 -->
            <label class="block">
                標題關鍵字
                <input v-model="local.titleKeyword" type="text" placeholder="輸入標題…"
                    class="w-full border rounded px-2 py-1" />
            </label>

            <!-- 內容關鍵字 -->
            <label class="block">
                內容關鍵字
                <input v-model="local.contentKeyword" type="text" placeholder="輸入內容…"
                    class="w-full border rounded px-2 py-1" />
            </label>

            <!-- 起始／結束：年 + 月 下拉 -->
            <div class="flex space-x-2">
                <span class="flex-1">
                    <span class="mb-1 font-medium">建立時間 起</span>
                    <span class="flex space-x-1">
                        <select v-model.number="local.startYear" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 年</option>
                            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                        </select>
                        <select v-model.number="local.startMonth" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 月</option>
                            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </span>
                </span>
                <div class="flex-1">
                    <span class="mb-1 font-medium">建立時間 訖</span>
                    <span class="flex space-x-1">
                        <select v-model.number="local.endYear" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 年</option>
                            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                        </select>
                        <select v-model.number="local.endMonth" class="flex-1 border rounded px-2 py-1">
                            <option :value="null">-- 月</option>
                            <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </span>
                </div>
            </div>

            <!-- 分類按鈕 -->
            <div>
                <div class="mb-1 font-medium">分類</div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="cat in categories" :key="cat.id" type="button" @click="toggleCat(cat.id)" :class="[
                        'px-3 py-1 border rounded',
                        local.postCategoryIds.includes(cat.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    ]">
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <!-- 主題按鈕 -->
            <div>
                <div class="mb-1 font-medium">主題</div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="topic in topics" :key="topic.id" type="button" @click="toggleTopic(topic.id)" :class="[
                        'px-3 py-1 border rounded',
                        local.postTopicIds.includes(topic.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    ]">
                        {{ topic.name }}
                    </button>
                </div>
            </div>

            <!-- 排序（單一下拉） -->
            <!-- <label class="block">
                排序
                <select v-model="local.sortDir" class="w-full border rounded px-2 py-1">
                    <option value="createdAt,asc">建立時間 ⯅</option>
                    <option value="createdAt,desc">建立時間 ⯆</option>
                </select>
            </label> -->

            <!-- 按鈕群 -->
            <div class="flex justify-between">
                <button type="button" @click="onClear" class="px-4 py-2 border rounded hover:bg-gray-100">
                    清除條件
                </button>
                <div class="flex space-x-2">
                    <button type="button" @click="onClose" class="px-4 py-2 border rounded hover:bg-gray-100">
                        取消
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        套用篩選
                    </button>
                </div>
            </div>
        </form>
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
form input,
form select {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem
}

form hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 1rem 0
}

button {
    transition: background 0.2s
}

button:hover {
    transform: translateY(-2px);
}
</style>