<template>
  <div class="stats-view">
    <h2>照服員分布地區</h2>
    <div class="rank-container">
      <RankCard title="城市人數 Top 3" :items="cities" />
      <RankCard title="區域人數 Top 3" :items="districts" />
    </div>

    <!-- ✅ 只顯示資料載入的成功或失敗訊息 -->
    <div v-if="loadMessage" class="message">{{ loadMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import RankCard from './RankCard.vue';

const cities = ref([]);
const districts = ref([]);
const loadMessage = ref('');

// ✅ 初始化資料
const fetchStatistics = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ 沒有 JWT Token！");
      loadMessage.value = "❌ 請先登入";
      return;
    }

    // ✅ 確保一次請求兩組資料
    const [cityRes, districtRes] = await Promise.all([
      axios.get('/api/statistics/top-cities', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      axios.get('/api/statistics/top-districts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    // ✅ 解析並排序 Top 3 資料
    if (cityRes.data) {
      cities.value = Object.entries(cityRes.data)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    }

    if (districtRes.data) {
      districts.value = Object.entries(districtRes.data)
        .map(([name, count]) => ({ name, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    }

    console.log("✅ 載入完成 cities:", cities.value);
    console.log("✅ 載入完成 districts:", districts.value);
    
  } catch (error) {
    console.error("❌ 資料載入失敗", error);
    loadMessage.value = "❌ 無法載入資料";
  }
};

onMounted(fetchStatistics);
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

/* ✅ 訊息樣式 */
.message {
  margin-top: 2rem;
  padding: 15px 25px;
  background-color: #e6f7e6;
  color: #28a745;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* ❌ 錯誤訊息 */
.message.error {
  background-color: #fbecec;
  color: #e53935;
}
</style>
