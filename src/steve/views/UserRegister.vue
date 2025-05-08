<template>
  <div class="register">
    <h2>使用者註冊</h2>

    <!-- 第一步：帳號、密碼、Email -->
    <div v-if="step === 1">
      <input v-model="userAccount" placeholder="帳號" />
      <input v-model="userPassword" type="password" placeholder="密碼" />
      <input v-model="emailAddress" @blur="checkEmail" placeholder="Email" />
      <p v-if="emailExists" class="error-message">此 Email 已被註冊</p>
      <button @click="nextStep" :disabled="emailExists">下一步</button>
    </div>

    <!-- 第二步：姓名、電話、地址 -->
    <div v-else>
      <input v-model="userName" placeholder="姓名" />

      <div class="phone-input">
        <select v-model="countryCode">
          <option value="+886">+886 (台灣)</option>
          <option value="+852">+852 (香港)</option>
          <option value="+81">+81 (日本)</option>
          <option value="+1">+1 (美國)</option>
        </select>
        <input v-model="localPhoneNumber" placeholder="電話（不含區碼）" />
      </div>

      <input v-model="address" placeholder="地址" />
      <button @click="register">送出註冊</button>
      <button @click="prevStep" class="back-button">上一步</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

const step = ref(1);
const userAccount = ref("");
const userPassword = ref("");
const emailAddress = ref("");
const userName = ref("");
const countryCode = ref("+886");
const localPhoneNumber = ref("");
const address = ref("");
const emailExists = ref(false);
const router = useRouter();

const nextStep = () => {
  if (!userAccount.value || !userPassword.value || !emailAddress.value) {
    alert("請完整填寫帳號、密碼與 Email");
    return;
  }
  step.value = 2;
};

const prevStep = () => {
  step.value = 1;
};

const checkEmail = async () => {
  if (!emailAddress.value) return;
  try {
    const res = await axios.get("/user/check-email", {
      params: { email: emailAddress.value },
    });
    emailExists.value = res.data === true;
  } catch {
    emailExists.value = false;
  }
};

const register = async () => {
  const fullPhone = `${countryCode.value}${localPhoneNumber.value}`;

  try {
    const res = await axios.post("/user/register/send", {
      userAccount: userAccount.value,
      userPassword: userPassword.value,
      userName: userName.value,
      emailAddress: emailAddress.value,
      phoneNumber: fullPhone,
      address: address.value,
    });
    alert("驗證碼已寄出，請去信箱查收");
    localStorage.setItem("pendingEmail", emailAddress.value);
    router.push("/verify");
  } catch (error) {
    alert("註冊失敗：" + (error.response?.data || "無法連線後端"));
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
.register input,
.register select {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
}
.phone-input {
  display: flex;
  gap: 0.5rem;
}
.phone-input select {
  width: 35%;
}
.phone-input input {
  flex: 1;
}
button {
  width: 100%;
  padding: 0.6rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}
.back-button {
  background-color: #6c757d;
}
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
}
</style>
