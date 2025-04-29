<template>
  <div class="register">
    <h2>使用者註冊</h2>
    <input v-model="userAccount" placeholder="帳號" />
    <input v-model="userPassword" type="password" placeholder="密碼" />
    <input v-model="userName" placeholder="姓名" />
    <input v-model="emailAddress" placeholder="Email" />
    <input v-model="phoneNumber" placeholder="電話" />
    <input v-model="address" placeholder="地址" />
    <button @click="register">送出註冊</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios"; // ✅ 用你自己設定好的 axios

const userAccount = ref("");
const userPassword = ref("");
const userName = ref("");
const emailAddress = ref("");
const phoneNumber = ref("");
const address = ref("");
const router = useRouter();

const register = async () => {
  try {
    const response = await axios.post("/user/register/send", {
      userAccount: userAccount.value,
      userPassword: userPassword.value,
      userName: userName.value,
      emailAddress: emailAddress.value,
      phoneNumber: phoneNumber.value,
      address: address.value,
    });

    alert("驗證碼已寄出，請去信箱查收");

    // 🔥 把 Email 暫存到 localStorage（新增這行）
    localStorage.setItem("pendingEmail", emailAddress.value);

    // 🔥 成功寄出後直接跳轉到 /verify 頁面
    router.push("/verify");
  } catch (error) {
    if (error.response && error.response.data) {
      alert("註冊失敗：" + error.response.data);
    } else {
      alert("註冊失敗（無法連線後端）");
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.register input {
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
