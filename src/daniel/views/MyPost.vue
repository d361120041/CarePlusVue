<template>
    <div class="mypost-container">

        <!-- 左欄：使用者資訊 -->
        <aside class="user-info">
            <img :src="imageUrl || '/default-avatar.png'" alt="頭貼" class="user-avatar" />
            <h2 class="user-name">
                {{ authStore.user.userName }}
            </h2>
            <p class="user-bio">{{ authStore.user.bio }}</p>
            <p class="user-intro">{{ authStore.user.intro }}</p>
        </aside>

        <!-- 右欄：我的貼文列表 -->
        <main class="mypost-main">
            <h3 class="mypost-header">我的貼文</h3>

            <!-- 多條件查詢 -->
            <!-- 查詢表單 -->
            <form @submit.prevent="applyFilters" class="w-full space-y-3">
                <label>
                    標題關鍵字
                    <input v-model="filter.titleKeyword" type="text" placeholder="輸入標題..." class="w-full" />
                </label>
                <label>
                    內容關鍵字
                    <input v-model="filter.contentKeyword" type="text" placeholder="輸入內容..." class="w-full" />
                </label>
                <label>
                    建立時間 起
                    <input v-model="filter.startTime" type="datetime-local" class="w-full" />
                </label>
                <label>
                    建立時間 訖
                    <input v-model="filter.endTime" type="datetime-local" class="w-full" />
                </label>
                <label>
                    分類 (多選)
                    <select v-model="filter.postCategoryIds" multiple class="w-full">
                        <option v-for="c in categoryStore.categories" :key="c.id" :value="c.id">
                            {{ c.name }}
                        </option>
                    </select>
                </label>
                <!-- <label>
                    主題 (多選)
                    <select v-model="filter.postTopicIds" multiple class="w-full">
                        <option v-for="t in topicStore.topics" :key="t.id" :value="t.id">
                            {{ t.name }}
                        </option>
                    </select>
                </label>
                <label>
                    標籤 (多選)
                    <select v-model="filter.postTagIds" multiple class="w-full">
                        <option v-for="t in tagStore.tags" :key="t.id" :value="t.id">
                            {{ t.name }}
                        </option>
                    </select>
                </label> -->
                <label class="flex space-x-2">
                    <div>排序欄位</div>
                    <select v-model="filter.sort">
                        <option value="createdAt">建立時間</option>
                        <option value="modifiedAt">修改時間</option>
                    </select>
                    <select v-model="filter.dir">
                        <option value="asc">⯅ 升冪</option>
                        <option value="desc">⯆ 降冪</option>
                    </select>
                </label>
                <button type="submit" class="w-full py-2 rounded bg-blue-500 text-white">
                    查詢
                </button>
            </form>
            <PostMain :only-mine="true" />
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePostStore } from '@/daniel/stores/posts'
import { useCategoryStore } from '@/daniel/stores/categories'
// import { useTopicStore } from '@/daniel/stores/topics'
// import { useTagStore } from '@/daniel/stores/tags'
import { useAuthStore } from '@/stores/auth';

import PostMain from '@/daniel/components/post/PostMain.vue'

const postStore = usePostStore()
const categoryStore = useCategoryStore()
// const topicStore = useTopicStore()
// const tagStore = useTagStore()
const authStore = useAuthStore()

// 使用者大頭貼
const imageUrl = ref(null)
imageUrl.value = `data:image/png;base64,${authStore.user.profilePicture}`

// filter 物件對應後端 API
const filter = reactive({
    postId: null,
    titleKeyword: null,
    contentKeyword: null,
    startTime: null,
    endTime: null,
    userId: authStore.user.userId,   // 只查自己的
    postCategoryIds: [],
    postTopicIds: [],
    postTagIds: [],
    start: null,
    rows: null,
    sort: 'createdAt',
    dir: 'asc'
})

// 送出查詢
async function applyFilters() {
    await postStore.loadPosts({
        ...filter,
        // 如果陣列空就傳 null 給後端
        postCategoryIds: filter.postCategoryIds.length ? filter.postCategoryIds : null,
        postTopicIds: filter.postTopicIds.length ? filter.postTopicIds : null,
        postTagIds: filter.postTagIds.length ? filter.postTagIds : null
    })
}

// 初始載入分類／主題／標籤
onMounted(async () => {
    await Promise.all([
        categoryStore.loadCategories(),
        // topicStore.loadTopics(),
        // tagStore.loadTags()
    ])
    // 一進來就載自己的貼文
    applyFilters()
})
</script>

<style scoped>
.mypost-container {
    display: flex;
    gap: 3rem;
    /* 欄間距 */
    padding: 1rem;
}

/* 左欄固定寬度或比例 */
.user-info {
    flex: 0 0 35%;
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    /* 直向堆疊 */
    align-items: center;
    /* 置中 */
}

/* 大頭貼從上到下第一個 */
.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
}

/* bio 與 intro */
.user-bio,
.user-intro {
    width: 100%;
    text-align: center;
    margin-bottom: 0.75rem;
    color: #555;
    line-height: 1.4;
}

/* 右欄用剩下的空間 */
.mypost-main {
    flex: 1 1 65%;
}

.mypost-header {
    grid-column: 2;
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
}

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
    background: #005bb5
}
</style>