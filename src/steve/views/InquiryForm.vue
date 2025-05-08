<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">客服信件</h2>

    <!-- 公版按鈕 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button class="px-3 py-1 bg-gray-200 rounded" @click="fillTemplate(1)">
        諮詢照護者
      </button>
      <button class="px-3 py-1 bg-gray-200 rounded" @click="fillTemplate(2)">
        諮詢課程
      </button>
      <button class="px-3 py-1 bg-gray-200 rounded" @click="fillTemplate(3)">
        申訴
      </button>
      <button class="px-3 py-1 bg-gray-200 rounded" @click="fillTemplate(4)">
        其他
      </button>
    </div>

    <form @submit.prevent="submitInquiry" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Email</label>
        <input
          type="email"
          v-model="inquiry.email"
          disabled
          class="w-full border rounded p-2 bg-gray-100"
        />
      </div>

      <div>
        <label class="block font-medium mb-1">內容</label>
        <textarea
          v-model="inquiry.inquiryText"
          rows="6"
          placeholder="請在此輸入您的問題或建議…"
          class="w-full border rounded p-2"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? "送出中…" : "送出" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const inquiry = ref({
  email: "",
  inquiryText: "",
});

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
    1: "您好，我對某位照護者的服務有疑問，想了解更多詳情，煩請協助說明。",
    2: "您好，想詢問某門課程的內容或報名方式，請問可以提供更多資訊嗎？",
    3: "您好，我想對先前的服務經驗提出申訴，以下是具體內容：",
    4: "您好，我有一些其他問題或建議如下：",
  };
  inquiry.value.inquiryText = templates[type];
};

const submitInquiry = async () => {
  if (!inquiry.value.inquiryText.trim()) return;
  loading.value = true;
  try {
    await axios.post("/inquiry/submit", {
      inquiryText: inquiry.value.inquiryText,
    });
    alert("已成功送出，感謝您的反饋");
    inquiry.value.inquiryText = "";
  } catch (err) {
    alert(err.response?.data || "送出失敗，請稍後再試");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 你可以再調整間距、字級 */
</style>
