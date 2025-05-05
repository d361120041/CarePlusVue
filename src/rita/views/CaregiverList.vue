<template>
  <div class="container">
    <div class="header">
      <h1>搜尋結果，共 {{ store.caregivers.length }} 位看護</h1>
      <select v-model="sortOption" class="border p-1 rounded">
        <option value="price">價格排序</option>
        <option value="rating">評分排序</option>
      </select>
    </div>

    <div class="caregiver-grid">
      <div
        class="caregiver-card"
        v-for="caregiver in sortedCaregivers"
        :key="caregiver.caregiverId"
      >
        <img
          class="caregiver-image"
          :src="caregiver.photoPath || 'https://via.placeholder.com/300x150'"
          :alt="`看護 ${caregiver.name}`"
        />
        <div class="caregiver-info">
          <h3>{{ caregiver.name }}</h3>
          <p class="caregiver-desc">{{ caregiver.experience || '尚無詳細介紹' }}</p>
          <p class="caregiver-price">時薪：{{ caregiver.hourlyRate }} 元</p>
          <router-link :to="`/caregivers/${caregiver.caregiverId}`" class="text-blue-500 underline">
            查看詳情
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCaregiverStore } from '@/stores/caregiverStore'

const store = useCaregiverStore()
const sortOption = ref('price')

const sortedCaregivers = computed(() => {
  const list = [...store.caregivers]
  if (sortOption.value === 'price') {
    list.sort((a, b) => a.hourlyRate - b.hourlyRate)
  } else if (sortOption.value === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }
  return list
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.caregiver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.caregiver-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}
.caregiver-card:hover {
  transform: translateY(-5px);
}
.caregiver-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.caregiver-info {
  padding: 15px;
}
.caregiver-info h3 {
  margin: 0;
  font-size: 18px;
  color: #4DB6AC;
}
.caregiver-desc {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
}
.caregiver-price {
  font-size: 16px;
  font-weight: bold;
  color: #4DB6AC;
}
</style>
