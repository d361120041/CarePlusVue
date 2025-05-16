<template>
  <div class="inquiry-page-wrapper">
    <!-- 左側內容 -->
    <div class="inquiry-wrapper">
      <h2 class="text-2xl font-bold mb-4">客服信件</h2>

      <!-- 公版按鈕 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          class="template-btn"
          :class="{ active: selectedTemplate === 1 }"
          @click="fillTemplate(1)"
        >
          諮詢看護
        </button>
        <button
          class="template-btn"
          :class="{ active: selectedTemplate === 2 }"
          @click="fillTemplate(2)"
        >
          諮詢課程
        </button>
        <button
          class="template-btn"
          :class="{ active: selectedTemplate === 3 }"
          @click="fillTemplate(3)"
        >
          申訴
        </button>
        <button
          class="template-btn"
          :class="{ active: selectedTemplate === 4 }"
          @click="fillTemplate(4)"
        >
          其他
        </button>
      </div>

      <form @submit.prevent="submitInquiry" class="space-y-4">
        <div>
          <label class="block font-medium mb-1">Email</label>
          <input
            style="margin-left: 88px; width: 30%"
            type="email"
            v-model="inquiry.email"
            disabled
            class="w-full"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">內容</label>

          <div v-if="selectedTemplate === 1" class="mb-4">
            <label class="block font-medium mb-1">看護 ID（必填）</label>
            <input
              type="text"
              v-model="caregiverIdentifier"
              placeholder="看護 ID"
              style="width: 8ch"
              class="w-1/2 border rounded p-2"
              maxlength="2"
              inputmode="numeric"
            />
          </div>

          <div v-if="selectedTemplate === 2" class="mb-4">
            <label class="block font-medium mb-1">課程 ID（必填）</label>
            <input
              type="text"
              v-model="courseIdentifier"
              placeholder="課程 ID"
              class="w-1/2 border rounded p-2"
              style="width: 8ch"
              maxlength="2"
              inputmode="numeric"
            />
          </div>

          <br />
          <textarea
            style="width: 70%; height: 150px"
            v-model="inquiry.inquiryText"
            rows="6"
            placeholder="請在此輸入您的問題或建議…"
            class="border rounded p-2 bg-gray-100"
            required
          ></textarea>
        </div>

        <button type="submit" class="btn-fav" :disabled="loading">
          {{ loading ? "送出中…" : "送出" }}
        </button>
      </form>
    </div>

    <!-- 右側插圖 -->
    <div class="static-image-wrapper">
      <img
        src="@/assets/images/client.png"
        class="static-decoration"
        width="300"
        height="300"
        loading="eager"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";
const caregiverIdentifier = ref("");
const courseIdentifier = ref("");
const router = useRouter();
const loading = ref(false);
const inquiry = ref({
  email: "",
  inquiryText: "",
});

const selectedTemplate = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get("/user/profile");
    inquiry.value.email = res.data.emailAddress;
  } catch (err) {
    alert("無法取得使用者資料，請重新登入");
    router.push("/userlogin");
  }
});

const fillTemplate = (type) => {
  const templates = {
    1: "您好，我對服務有疑問，想了解更多詳情，煩請協助說明:",
    2: "您好，想詢問某門課程的內容:",
    3: "您好，我想對先前的服務經驗提出申訴，以下是具體內容：",
    4: "您好，我有一些其他問題或建議如下：",
  };
  inquiry.value.inquiryText = templates[type];
  selectedTemplate.value = type;
};

const submitInquiry = async () => {
  if (!inquiry.value.inquiryText.trim()) return;

  const caregiverId = caregiverIdentifier.value.trim();
  const courseId = courseIdentifier.value.trim();

  // ✅ 諮詢看護 → 驗證看護 ID
  if (selectedTemplate.value === 1) {
    if (!caregiverId) {
      alert("請填寫看護 ID");
      return;
    }
    if (!/^\d+$/.test(caregiverId)) {
      alert("請輸入數字");
      return;
    }
    if (caregiverId.length > 2) {
      alert("請輸入 1～2 位數字");
      return;
    }
  }

  // ✅ 諮詢課程 → 驗證課程 ID
  if (selectedTemplate.value === 2) {
    if (!courseId) {
      alert("請填寫課程 ID");
      return;
    }
    if (!/^\d+$/.test(courseId)) {
      alert("請輸入數字");
      return;
    }
    if (courseId.length > 2) {
      alert("請輸入 1～2 位數字");
      return;
    }
  }

  // ✅ 組合最終信件內容
  let fullMessage = inquiry.value.inquiryText;
  if (selectedTemplate.value === 1) {
    fullMessage = `看護 ID：${caregiverId}\n${fullMessage}`;
  } else if (selectedTemplate.value === 2) {
    fullMessage = `課程 ID：${courseId}\n${fullMessage}`;
  }

  loading.value = true;
  try {
    await axios.post("/inquiry/submit", {
      inquiryText: fullMessage,
      caregiverIdentifier: selectedTemplate.value === 1 ? caregiverId : null,
      courseIdentifier: selectedTemplate.value === 2 ? courseId : null,
    });
    alert("已成功送出，感謝您的反饋");

    // 清空欄位
    inquiry.value.inquiryText = "";
    caregiverIdentifier.value = "";
    courseIdentifier.value = "";
    selectedTemplate.value = null;
  } catch (err) {
    alert(err.response?.data || "送出失敗，請稍後再試");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input,
textarea {
  border: none;
  background-color: transparent;
  box-shadow: none;
  outline: none;
}

/* 公版按鈕（Tabs）*/
.template-btn {
  padding: 0.5rem 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: 2px solid #ff8c42; /* 橘色邊框 */
  background-color: #ffeae0; /* 極淺暖杏色背景 */
  color: #333;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
.template-btn:hover {
  background-color: #ffd1b3; /* 淺橘背景 */
}
.template-btn.active {
  background-color: #ff8c42; /* 主橘色 */
  border-color: #ff8c42;
  color: #ffffff;
}

/* 送出按鈕 */
.btn-fav {
  background-color: #ff8c42;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: 2px solid #ff8c42;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}
.btn-fav:hover {
  background-color: #ffa76b; /* 淺橘 hover */
  border-color: #ffa76b;
}
.btn-fav:disabled {
  background-color: #ffd9b3; /* 更淡的橘色作為 disabled */
  border-color: #ffd9b3;
  cursor: not-allowed;
}

/* 版面結構（不動） */
.inquiry-page-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  background-color: #fff8f0;
  max-width: 1500px;
  margin: 0 auto;
}
.inquiry-wrapper {
  flex: 1;
  min-width: 0;
}
.static-image-wrapper {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  overflow: hidden;
}
.static-decoration {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9999px;
  opacity: 0.9;
  pointer-events: none;
}
</style>
