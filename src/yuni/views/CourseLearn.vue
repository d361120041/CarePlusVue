<template>
  <!-- loading骨架 -->
  <div v-if="isLoading" class="container py-4">
    <div class="mb-3 placeholder-glow">
      <div class="skeleton-title shimmer mb-3" style="width: 30%; height: 30px;"></div>
      <div class="skeleton-text shimmer mb-4" style="width: 60%; height: 20px;"></div>
    </div>
    <div class="skeleton-frame shimmer rounded" style="width: 100%; height: 600px;"></div>
    <div class="d-flex justify-content-between mt-4">
      <div class="skeleton-button shimmer" style="width: 120px; height: 40px; border-radius: 5px;"></div>
      <div class="skeleton-button shimmer" style="width: 120px; height: 40px; border-radius: 5px;"></div>
    </div>
  </div>

  <!-- 影片或文章 -->
  <div v-else-if="chapter" class="container py-4">
    <!-- 麵包屑 -->
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <nav aria-label="breadcrumb" class="m-0">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <router-link :to="`/course-progress/${courseId}`" class="breadcrumb-dynamic">
              我的「{{ courseTitle || '課程' }}」
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ chapter?.title || '章節' }}
          </li>
        </ol>
      </nav>
    </div>

    <!-- 顯示影片或文章 -->
    <div class="mb-4">
      <iframe v-if="chapter.contentType === 'video'" :src="embedUrl" frameborder="0" allowfullscreen
        class="content-frame video-frame" />
      <iframe v-else-if="chapter.contentType === 'article'" :src="embedUrl" frameborder="0"
        class="content-frame article-frame" />
      <div v-else class="text-center text-muted">無法載入章節內容。</div>
    </div>

    <!-- 上下章節按鈕 -->
    <div class="d-flex justify-content-between">
      <button class="button-green" :disabled="currentIndex <= 0" @click="goPrevious">上一章</button>
      <button class="button-green" @click="handleNextOrFinish">
        {{ currentIndex >= chapters.length - 1 ? '完成' : '下一章' }}
      </button>
    </div>
  </div>

  <!-- 沒資料 -->
  <div v-else class="container py-4 text-center text-muted">
    無法載入章節內容。
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.courseId)
// const userId = Number(localStorage.getItem('userId') || 3)
const userId = ref(null)
const chapters = ref([])
const chapter = ref(null)
const currentIndex = ref(0)
const courseTitle = ref('')

const isLoading = ref(true)

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
    const res = await axios.get(`/api/progress/user/${userId.value}/course/${courseId}`)
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

// const ensureProgress = async () => {
//   await axios.get(`/api/progress/user/${userId}/chapter/${chapter.value.chapterId}/with-create`)
// }
const ensureProgress = async () => {
  try {
    const res = await axios.get(`/api/progress/user/${userId.value}/chapter/${chapter.value.chapterId}/with-create`)
    console.log('已建立或找到進度：', res.data)
  } catch (err) {
    console.error('建立或查詢進度失敗：', err)
  }
}

const goNext = async () => {
  if (currentIndex.value < chapters.value.length - 1) {
    currentIndex.value++
    chapter.value = chapters.value[currentIndex.value]
    await ensureProgress()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })

}

const goPrevious = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })

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
  if (!userId.value) {
    alert("使用者尚未登入，userId 為空");
    return;
  }

  const chapterId = chapter.value?.chapterId;
  if (!chapterId) {
    alert("目前章節無效");
    return;
  }

  try {
    // 🧩 呼叫 complete 章節（需使用 params 傳 userId）
    await axios.patch(`/api/progress/user/${userId.value}/chapter/${chapterId}/complete`, null, {
      params: { userId: userId.value }
    });

    const isLastChapter = currentIndex.value === chapters.value.length - 1;

    if (isLastChapter) {
      // ✅ 呼叫 complete-all 完成整門課
      await axios.patch(`/api/progress/user/${userId.value}/course/${courseId}/complete-all`);
      router.push(`/done/${courseId}`);
    } else {
      // 👉 移動到下一章
      await goNext();
    }

  } catch (err) {
    console.error('完成章節或課程失敗', err);
    const msg = err.response?.data || '無法儲存完成狀態，請稍後再試';
    alert(`錯誤：${msg}`);
  }
};



const backToProgress = async () => {
  console.log("送出 PATCH 資料", {
    userId: userId.value,
    chapterId: chapter.value.chapterId,
    lastWatched: 1,
    isCompleted: false,
    status: 'in_progress'
  })
  try {
    await axios.patch(`/api/progress/chapter/${chapter.value.chapterId}/progress`, {
      userId: userId.value,
      lastWatched: 1,
      isCompleted: false,
      status: 'in_progress'
    })
    // 返回進度總覽頁面
    router.push(`/course-progress/${courseId}`)
  } catch (err) {
    console.error('無法回到課程進度頁', err)
    alert('操作失敗，請稍後再試')
  }
}


const fetchCourseTitle = async () => {
  try {
    const res = await axios.get(`/api/courses/${courseId}`);
    courseTitle.value = res.data.title;
  } catch (err) {
    console.error('取得課程標題失敗', err);
    courseTitle.value = '(無標題)';
  }
};

const fetchUserProfile = async () => {
  try {
    const res = await axios.get('/user/profile', { withCredentials: true })
    userId.value = res.data.userId
  } catch (err) {
    console.error('無法取得使用者資訊', err)
    router.push('/login')
  }
}
// onMounted(async () => {
//   const resCourse = await axios.get(`/api/courses/${courseId}`)
//   courseTitle.value = resCourse.data.title
//   await fetchUserProfile()
//   await fetchChapters()
//   await loadChapterFromQuery()
// })

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })

  isLoading.value = true
  try {
    await fetchUserProfile()
    await fetchCourseTitle()
    await fetchChapters()
    await loadChapterFromQuery()
  } finally {
    isLoading.value = false
  }
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
  background-color: #0056b3;
  /* 深一點的藍色 */
  border-color: #004d99;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
  /* 輕微發光效果 */
  transition: all 0.2s ease-in-out;
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  font-size: 0.9rem;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: ">";
  color: #6c757d;
}

.breadcrumb-dynamic {
  color: #6c757d;
  font-weight: normal;
  display: inline-block;
  transition: transform 0.2s ease, color 0.2s ease;
}

.breadcrumb-dynamic:hover {
  transform: scale(1.05);
  color: #4db6ac;
  text-decoration: none;
}

.skeleton-title,
.skeleton-text,
.skeleton-frame,
.skeleton-button {
  background-color: #e0e0e0;
  border-radius: 4px;
}

.shimmer {
  background-image: linear-gradient(90deg, #e0e0e0 0px, #f5f5f5 40px, #e0e0e0 80px);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }

  100% {
    background-position: 200px 0;
  }
}

.button-green {
  background-color: #4db6ac;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.button-green:hover {
  background-color: #3ca394;
}

.button-green:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}

</style>