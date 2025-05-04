<template>
    <div class="container py-4" v-if="chapter">
        <h3 class="mb-3">{{ chapter.title }}</h3>

        <!-- 顯示影片或文章 -->
        <div class="mb-4">
            <!-- <iframe
          v-if="chapter.contentType === 'video'"
          :src="embedUrl"
          frameborder="0"
          allowfullscreen
          class="w-100 rounded content-frame"
        ></iframe>
        <iframe
          v-else-if="chapter.contentType === 'article'"
          :src="chapter.contentUrl"
          frameborder="0"
          class="w-100 rounded content-frame"
        ></iframe> -->

            <iframe v-if="chapter.contentType === 'video'" :src="embedUrl" frameborder="0" allowfullscreen
                class="content-frame video-frame" />

            <iframe v-else-if="chapter.contentType === 'article'" :src="embedUrl" frameborder="0"
                class="content-frame article-frame" />

            <div v-else class="text-muted">無法顯示的內容類型</div>
        </div>

<!-- 上一章 + 下一章 -->
<div class="d-flex justify-content-between">
  <button class="btn btn-primary" :disabled="currentIndex <= 0" @click="goPrevious">上一章</button>

  <button class="btn btn-primary" @click="handleNextOrFinish">{{ currentIndex >= chapters.length - 1 ? '完成' : '下一章' }}</button>
</div>



    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'



const route = useRoute()
const router = useRoute()
const courseId = Number(route.params.courseId)
const userId = Number(localStorage.getItem('userId') || 3)

const chapters = ref([])
const chapter = ref(null)
const currentIndex = ref(0)

const embedUrl = computed(() => {
  if (!chapter.value?.contentUrl) return ''
  const url = chapter.value.contentUrl

  if (chapter.value.contentType === 'video' && url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1]
    return `https://www.youtube.com/embed/${id}?rel=0`
  }

  return url
})

const fetchChapters = async () => {
    const res = await axios.get(`/api/chapters/chapters/course/${courseId}`)
    chapters.value = res.data
}

const loadProgress = async () => {
    try {
        const res = await axios.get(`/api/progress/user/${userId}/course/${courseId}`)
        const progresses = res.data
        if (progresses.length > 0) {
            const last = progresses.sort((a, b) => b.lastWatched - a.lastWatched)[0]
            const idx = chapters.value.findIndex(c => c.chapterId === last.chapterId.chapterId)
            currentIndex.value = idx !== -1 ? idx : 0
        }
    } catch (err) {
        currentIndex.value = 0
    }
    chapter.value = chapters.value[currentIndex.value]
    await ensureProgress()
}

const ensureProgress = async () => {
    await axios.get(`/api/progress/user/${userId}/chapter/${chapter.value.chapterId}/with-create`)
}

const goNext = async () => {
    if (currentIndex.value < chapters.value.length - 1) {
        currentIndex.value++
        chapter.value = chapters.value[currentIndex.value]
        await ensureProgress()
    }
}

const goPrevious = async () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    chapter.value = chapters.value[currentIndex.value]
    await ensureProgress()
  }
}

const loadChapterFromQuery = async () => {
  const chapterIdParam = Number(route.query.chapterId)
  if (chapterIdParam) {
    const idx = chapters.value.findIndex(c => c.chapterId === chapterIdParam)
    if (idx !== -1) {
      currentIndex.value = idx
      chapter.value = chapters.value[idx]
      await ensureProgress()
      return
    }
  }
  await loadProgress() // fallback: 根據上次紀錄
}

watch(() => route.query.chapterId, async (newChapterId) => {
  if (chapters.value.length > 0) {
    const idx = chapters.value.findIndex(c => c.chapterId === Number(newChapterId))
    if (idx !== -1) {
      currentIndex.value = idx
      chapter.value = chapters.value[idx]
      await ensureProgress()
    }
  }
})



 const handleNextOrFinish = async () => {
   if (currentIndex.value = chapters.length - 1) {
     // 你可以改導向「我的課程」或「課程總覽」
     router.push('/my-courses')
   } else {
     await goNext()
   }
 }


onMounted(async () => {
  await fetchChapters()
  await loadChapterFromQuery()
})
</script>

<style scoped>
/* .content-frame {
    height: 480px;
    max-height: 60vh;
  } */

.content-frame {
    border: none;
    border-radius: 8px;
    width: 100%;
}

.video-frame {
    height: 600px;
}


.article-frame {
    display: block;
    /* 強制變成可置中的區塊 */
    width: 100%;
    /* 確保在小螢幕仍能滿版顯示 */
    max-width: 1200px;
    /* 書本寬度 */
    height: 800px;
    /* 書本高度 */
    margin: 0 auto;
    /* 水平置中 */
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn.btn-primary:hover {
  background-color: #0056b3; /* 深一點的藍色 */
  border-color: #004d99;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5); /* 輕微發光效果 */
  transition: all 0.2s ease-in-out;
}
</style>