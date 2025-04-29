<template>
  <div class="verify">
    <h2>輸入驗證碼</h2>
    <input v-model="code" placeholder="驗證碼" />
    <button @click="verify">確認驗證</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

const code = ref("");
const email = ref("");
const router = useRouter();

// 🔥 頁面一掛載就從 localStorage 拿 email
onMounted(() => {
  email.value = localStorage.getItem("pendingEmail") || "";
});

const verify = async () => {
  if (!email.value) {
    alert("錯誤：找不到註冊時的 Email，請重新註冊");
    return;
  }
  try {
    await axios.post("/user/register/verify", null, {
      params: {
        email: email.value,
        code: code.value,
      },
    });
    alert("註冊成功！請重新登入");

    // 🔥 成功驗證後清掉 localStorage
    localStorage.removeItem("pendingEmail");

    router.push("/userlogin"); // 🔥 成功跳回登入頁
  } catch (error) {
    alert("驗證失敗：" + (error.response?.data || "無法連線"));
  }
};
</script>

<style scoped>
.verify {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.verify input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
}
button {
  width: 100%;
  padding: 0.6rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
