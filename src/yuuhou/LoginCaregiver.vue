<template>
  <div class="caregiver-login">
    <div class="background-overlay"></div>
    <div class="login-box">
      <h2>照服員登入</h2>

      <!-- ✅ Email Label -->
      <label class="input-label">電子郵件</label>
      <input v-model="email" type="email" placeholder="請輸入Email" />
      <p v-if="emailError" class="error">{{ emailError }}</p>

      <!-- ✅ Password Label -->
      <label class="input-label">密碼</label>
      <input v-model="password" type="password" placeholder="請輸入密碼" />
      <p v-if="passwordError" class="error">{{ passwordError }}</p>

      <p v-if="generalError" class="error">{{ generalError }}</p>

      <button @click="login">登入</button>

      <div class="extra-buttons">
        <router-link to="/register" class="text-link">註冊帳號</router-link>
        <router-link to="/forgot" class="text-link">忘記密碼?</router-link>
      </div>

      <div class="footer">
        <div>© 2025 CarePlus 長照平台｜</div>
        <div>All rights reserved.</div>
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
      await authStore.fetchProfile();
    } else {
      generalError.value = "未知角色，請聯絡管理員";
    }
  } catch (error) {
    generalError.value = "帳號或密碼錯誤";
  }
};

</script>

<style scoped>

.input-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: left;
  display: block;
}
.caregiver-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/yuuhou/caregiver-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  z-index: 0;
}

.login-box {
  position: relative;
  background: #ffffffee;
  padding: 3rem;
  border-radius: 15px;
  width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
  z-index: 1;
  border: 2px solid #f0f0f0;
  border-top: 6px solid #007bff;
  border-bottom: 6px solid #00c6ff;
}

h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #007bff, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 4px 15px rgba(0, 0, 0, 0.15);
}

input {
  display: block;
  width: 100%;
  padding: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, background-color 0.3s;
}

input:focus {
  border-color: #007bff;
  background-color: #f0f9ff;
  outline: none;
}

button {
  width: 100%;
  padding: 0.9rem;
  background-color: #007bff;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.03);
}

.extra-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.text-link {
  color: #666;
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.3s;
}

.text-link:hover {
  color: #007bff;
  text-decoration: underline;
}

.footer {
  margin-top: 2rem;
  font-size: 0.75rem;
  color: #999;
}

.error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
</style>