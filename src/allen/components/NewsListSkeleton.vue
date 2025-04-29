<template>
    <div v-for="i in 5" :key="i" class="skeleton-item">
      <div class="skeleton-thumbnail"></div>
      <div class="skeleton-text"></div>
    </div>
</template>

<style scoped>
.skeleton-item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #ccc;
}

.skeleton-thumbnail {
    width: 80px;
    height: 80px;
    background-color: #e0e0e0;
    margin-right: 16px;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
}

.skeleton-text {
    width: 60%;
    height: 24px;
    background-color: #e0e0e0;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}
</style>