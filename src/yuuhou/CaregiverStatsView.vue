<template>
  <div class="stats-view">
    <h2> 照服員分布地區</h2>
    <div class="rank-container">
      <RankCard title=" 城市人數 Top 3" :items="cities" />
      <RankCard title=" 區域人數 Top 3" :items="districts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import RankCard from './RankCard.vue';

const cities = ref([]);
const districts = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:8082',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const cityRes = await axiosInstance.get('/api/statistics/top-cities');
    const districtRes = await axiosInstance.get('/api/statistics/top-districts');

    if (cityRes.data && typeof cityRes.data === 'object') {
      cities.value = Object.entries(cityRes.data)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    }

    if (districtRes.data && typeof districtRes.data === 'object') {
      districts.value = Object.entries(districtRes.data)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    }

    console.log("✅ cities:", cities.value);
    console.log("✅ districts:", districts.value);
  } catch (error) {
    console.error("❌ 請求錯誤", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.stats-view {
  padding: 4rem;
  background: linear-gradient(135deg, #fefefe 0%, #e8f0ff 100%);
  border-radius: 30px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
  margin: 4rem auto;
  max-width: 1300px;
  text-align: center;
  border: 2px solid #ffffff;
}

.rank-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
}

.stats-view h2 {
  font-size: 3rem;
  color: #555;
  margin-bottom: 2.5rem;
  letter-spacing: 0.05em;
  background: linear-gradient(90deg, #005bea, #00c6fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 3px 6px 20px rgba(0, 0, 0, 0.2);
}
</style>
