<template>
  <div class="forgot-password">
    <h2>忘記密碼</h2>
    <input v-model="email" placeholder="請輸入你的 Email" />
    <button @click="sendVerification">送出驗證碼</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios"; // 你自己設定好的 axios

const email = ref("");
const router = useRouter();

const sendVerification = async () => {
  if (!email.value) {
    alert("請先輸入 Email");
    return;
  }
  try {
    await axios.post("/user/request-password-reset", null, {
      params: { emailAddress: email.value },
    });
    alert("驗證碼已寄出，請到信箱查看");

    // 暫存 email，後面 reset password 頁會用到
    localStorage.setItem("resetEmail", email.value);

    // ✅ 寄完後導向下一頁（這裡先停留或導去 /resetPassword，看你想怎樣）
    router.push("/resetPassword");
  } catch (error) {
    alert("寄送失敗：" + (error.response?.data || "無法連線到後端"));
  }
};
</script>

<style scoped>
.forgot-password {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.forgot-password input {
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
