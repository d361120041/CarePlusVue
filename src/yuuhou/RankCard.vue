<template>
  <div class="rank-card">
    <h3 class="rank-title">{{ title }}</h3>
    <ul class="rank-list">
      <li v-for="(item, index) in items" :key="index" class="rank-item">
        <span class="rank-number">{{ index + 1 }}</span>
        <span class="rank-name">{{ item.name }}</span>
        <span class="rank-count">{{ item.count }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style scoped>
.rank-card {
  background-color: #f8f8f8;
  border-radius: 20px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  width: 320px;
  margin: 1rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.rank-card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.rank-title {
  font-size: 1.8rem;
  color: #444;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.rank-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rank-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  border-radius: 15px;
  margin-bottom: 0.75rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.rank-item:hover {
  background-color: #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.rank-number {
  font-weight: bold;
  color: #007bff;
  font-size: 1.2rem;
}

.rank-name {
  font-weight: bold;
  flex-grow: 1;
  text-align: left;
  margin-left: 1.5rem;
  font-size: 1.2rem;
}

.rank-count {
  font-weight: bold;
  color: #666;
  font-size: 1.2rem;
}
</style>
