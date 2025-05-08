<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">客服信件</h2>

    <form @submit.prevent="submitInquiry" class="space-y-4">
      <div>
        <label class="block font-medium mb-1">Email </label>
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

// 頁面載入時，拿使用者 email 填入
onMounted(async () => {
  try {
    const res = await axios.get("/user/profile"); // 假設這支 API 回傳 user 物件
    inquiry.value.email = res.data.emailAddress;
  } catch (err) {
    console.error(err);
    alert("無法取得使用者資料，請重新登入");
    router.push("/userlogin");
  }
});

const submitInquiry = async () => {
  if (!inquiry.value.inquiryText.trim()) return;
  loading.value = true;
  try {
    await axios.post("/inquiry/submit", {
      // 後端只需要 inquiryText 以及 session 裡的 userId
      inquiryText: inquiry.value.inquiryText,
    });
    alert("已成功送出，感謝您的反饋");
    inquiry.value.inquiryText = "";
  } catch (err) {
    console.error(err);
    const msg = err.response?.data || "送出失敗，請稍後再試";
    alert(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 你可以再調整間距、字級 */
</style>
