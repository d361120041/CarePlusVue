<template>
  <div class="reset-password">
    <h2>重設密碼</h2>
    <input v-model="code" placeholder="驗證碼" />
    <input v-model="newPassword" type="password" placeholder="新密碼" />
    <button @click="resetPassword">送出重設</button>
  </div>
</template>

<script setup>
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

const code = ref("");
const newPassword = ref("");
const router = useRouter();

const resetPassword = async () => {
  const email = localStorage.getItem("resetEmail"); // 之前存在 localStorage 的

  if (!email) {
    Swal.fire({
      icon: "warning",
      title: "請先回忘記密碼頁面重新操作",
    });
    router.push("/forgotPassword");
    return;
  }

  try {
    await axios.post("/user/reset-password", null, {
      params: {
        emailAddress: email,
        verificationCode: code.value,
        newPassword: newPassword.value,
      },
    });

    Swal.fire({
      icon: "success",
      title: "密碼已成功重設",
      text: "請重新登入！",
    });
    localStorage.removeItem("resetEmail"); // 🔥 清掉暫存
    router.push("/userlogin");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "重設失敗",
      text: error.response?.data || "無法連線到後端",
    });
  }
};
</script>

<style scoped>
.reset-password {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.reset-password input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
}
button {
  width: 100%;
  padding: 0.6rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
