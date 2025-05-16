<template>
  <div class="welcome-view">
    <h1> 歡迎，{{ caregiver.caregiverName }}</h1>
    <p>祝您今天工作順利，帶給每一位需要照顧的人溫暖與關懷。</p>
    <p>感謝您每一天的付出！</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const caregiver = ref({
  caregiverName: "照服員",
  photo: null,
});

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ 沒有 JWT Token！");
      return;
    }

    const response = await axios.get("http://localhost:8082/api/caregivers/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    caregiver.value = response.data;
    console.log("✅ Caregiver Data:", caregiver.value);
  } catch (error) {
    console.error("❌ 無法取得照服員名稱", error);
  }
});
</script>

<style scoped>
.welcome-view {
  padding: 4rem;
  background: linear-gradient(135deg, #fefefe 0%, #e8f0ff 100%);
  border-radius: 30px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
  margin: 4rem auto;
  max-width: 1000px;
  text-align: center;
  border: 2px solid #ffffff;
}

.welcome-view h1 {
  font-size: 3.5rem;
  color: #005bea;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
  background: linear-gradient(90deg, #005bea, #00c6fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 3px 6px 20px rgba(0, 0, 0, 0.2);
}

.welcome-view p {
  font-size: 1.8rem;
  color: #555;
  margin-bottom: 1.5rem;
}
</style>
