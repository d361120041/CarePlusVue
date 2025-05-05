<template>
  <div class="container py-4" v-if="course">
    <h2>{{ course.title }}</h2>
    <p class="text-muted">＃{{ getCategoryLabel(course.category) }}</p>
    <p>{{ course.description }}</p>
    <p>時長：{{ course.duration }}</p>
    <p>價格：{{ course.price }} 元</p>

    <h4 class="mt-4">章節列表</h4>
    <ul v-if="chapters.length > 0" class="list-group">
      <li
        v-for="chapter in chapters"
        :key="chapter.chapterId"
        class="list-group-item"
      >
        {{ chapter.position }}. {{ chapter.title }}
      </li>
    </ul>
    <p v-else class="text-muted">此課程目前無章節。</p>

    <!-- ✅ 加入課程按鈕（根據是否已加入） -->
    <div class="mt-4">
      <button v-if="enrolled" class="btn btn-outline-secondary" disabled>
        已加入我的課程
      </button>
      <button v-else class="btn btn-success" @click="enrollCourse">
        加入我的課程
      </button>
    </div>

    <!-- ✅ 收藏按鈕（登入後才顯示） -->
    <div class="mt-2" v-if="authStore.isAuthenticated">
      <button
        :class="['btn', isFavorited ? 'btn-secondary' : 'btn-outline-danger']"
        @click="toggleFavorite"
      >
        {{ isFavorited ? "取消收藏" : "加入收藏" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "@/plugins/axios.js";
// favButton// favButton// favButton// favButton// favButton// favButton
import { useAuthStore } from "@/stores/auth";
// favButton// favButton// favButton// favButton// favButton// favButton

// favButton// favButton// favButton// favButton// favButton// favButton
const authStore = useAuthStore();
const isFavorited = ref(false);
// 檢查是否已收藏課程
const checkFavorite = async () => {
  try {
    const res = await axios.get("/favorites/courses");
    const ids = res.data.map((item) => item.courseId);
    isFavorited.value = ids.includes(courseId);
  } catch (err) {
    console.error("取得收藏課程失敗：", err);
  }
};

// 切換收藏狀態
const toggleFavorite = async () => {
  try {
    if (isFavorited.value) {
      await axios.delete("/favorites/deleteCourse", { params: { courseId } });
      isFavorited.value = false;
    } else {
      await axios.post("/favorites/addCourse", null, { params: { courseId } });
      isFavorited.value = true;
    }
  } catch (err) {
    console.error("收藏操作失敗：", err);
  }
};
// favButton// favButton// favButton// favButton// favButton// favButton

const route = useRoute();
const courseId = Number(route.params.id);
const userId = 3; //先寫死！！

const course = ref(null);
const chapters = ref([]);
const enrolled = ref(false);

const getCategoryLabel = (key) => {
  const map = {
    daily_care: "日常生活",
    dementia: "失智照護",
    nutrition: "營養保健",
    psychology: "心理支持",
    assistive: "輔具協助",
    resource: "資源導覽",
    endoflife: "臨終關懷",
    skills: "技能訓練",
    selfcare: "自主健康",
  };
  return map[key] || key;
};

// 檢查是否已加入課程
const checkEnrolled = async () => {
  try {
    const res = await axios.get(
      `/api/progress/user/${userId}/course/${courseId}`
    );

    enrolled.value = res.data.length > 0;
  } catch (err) {
    enrolled.value = false;
  }
};

// 加入課程
const enrollCourse = async () => {
  try {
    await axios.post("/api/progress/enroll", {
      userId,
      courseId,
    });
    alert("成功加入課程！");
    enrolled.value = true;
  } catch (err) {
    if (err.response?.status === 409) {
      alert("你已經加入過這門課了");
    } else {
      alert("加入課程失敗");
    }
  }
};

onMounted(async () => {
  try {
    const resCourse = await axios.get(`/api/courses/${courseId}`);
    course.value = resCourse.data;

    const resChapters = await axios.get(
      `/api/chapters/chapters/course/${courseId}`
    );
    chapters.value = resChapters.data;
    await checkFavorite();
    await checkEnrolled();
  } catch (err) {
    console.error("取得課程或章節資料失敗", err);
  }
});
</script>
