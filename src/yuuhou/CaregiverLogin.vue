<template>
  <div class="login">
    <h2>照服員登入</h2>

    <!-- ✅ 輸入欄位 -->
    <input v-model="email" type="email" placeholder="Email" />
    <p v-if="emailError" class="error">{{ emailError }}</p>

    <input v-model="password" type="password" placeholder="密碼" />
    <p v-if="passwordError" class="error">{{ passwordError }}</p>

    <p v-if="generalError" class="error">{{ generalError }}</p>

    <!-- ✅ 登入按鈕 -->
    <button @click="login">登入</button>

    <!-- ✅ 額外功能按鈕 -->
    <div class="extra-buttons">
      <router-link to="/register">
        <button class="register">註冊照顧者</button>
      </router-link>

      <router-link to="/forgot">
        <button class="forgot">忘記密碼</button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCaregiverAuth } from "@/stores/useCaregiverAuth";
import { onMounted } from "vue";

const emailError = ref("");
const passwordError = ref("");
const generalError = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();
const authStore = useCaregiverAuth();

onMounted(() => {
  if (authStore.token) {
    if (authStore.role === "ADMIN") {
      router.push("/admin/menu");
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
      router.push("/admin/menu");
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
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 4px;
}

.login {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.login input {
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
  margin-bottom: 1rem;
}

/* ✅ 額外按鈕樣式 */
.extra-buttons {
  display: flex;
  justify-content: space-between;
}

.extra-buttons .register {
  background-color: #007bff;
}
.extra-buttons .forgot {
  background-color: #6c757d;
}
</style>
