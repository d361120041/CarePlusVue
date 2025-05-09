LoginCaregiver.vue:
<template>
  <div class="caregiver-login">
    <div class="login-box">
      <h2>照服員登入</h2>

      <input v-model="email" type="email" placeholder="Email" />
      <p v-if="emailError" class="error">{{ emailError }}</p>

      <input v-model="password" type="password" placeholder="密碼" />
      <p v-if="passwordError" class="error">{{ passwordError }}</p>

      <p v-if="generalError" class="error">{{ generalError }}</p>

      <button @click="login">登入</button>

      <div class="extra-buttons">
        <router-link to="/register">
          <button class="register">註冊照顧者</button>
        </router-link>
        <router-link to="/forgot">
          <button class="forgot">忘記密碼</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCaregiverAuth } from "@/stores/useCaregiverAuth";

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const generalError = ref("");

const router = useRouter();
const authStore = useCaregiverAuth();

onMounted(() => {
  if (authStore.token) {
    if (authStore.role === "ADMIN") {
      router.push("/admin");
    } else if (authStore.role === "CAREGIVER") {
      router.push("/caregiver");
    } else {
      router.push("/403");
    }
  }
});

const login = async () => {
  emailError.value = "";
  passwordError.value = "";
  generalError.value = "";

  if (!email.value.trim()) {
    emailError.value = "請輸入帳號（Email）";
    return;
  }

  if (!password.value.trim()) {
    passwordError.value = "請輸入密碼";
    return;
  }

  try {
    await authStore.login(email.value, password.value);

    if (authStore.role === "ADMIN") {
      router.push("/admin");
    } else if (authStore.role === "CAREGIVER") {
      router.push("/caregiver");
    } else {
      generalError.value = "未知角色，請聯絡管理員";
    }
  } catch (error) {
    generalError.value = "帳號或密碼錯誤";
  }
};

</script>

<style scoped>
.caregiver-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/yuuhou/caregiver-bg.jpg'); /* ✅ 自訂圖片 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s ease;
}

button:hover {
  background-color: #218838;
}

.extra-buttons {
  display: flex;
  justify-content: space-between;
}

.register {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.forgot {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.register:hover {
  background-color: #0056b3;
}
.forgot:hover {
  background-color: #5a6268;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
</style>
