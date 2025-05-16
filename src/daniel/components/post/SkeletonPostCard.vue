<template>
    <div class="skeleton-card">
        <div class="avatar"></div>
        <div class="body">
            <div class="line short"></div>
            <div class="line long"></div>
            <div class="line long"></div>
        </div>
    </div>
</template>

<style scoped>
.skeleton-card {
    width: 500px;
    display: flex;
    gap: 1rem;
    background: #eee;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
    position: relative;
}

.skeleton-card::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
    to {
        transform: translateX(100%);
    }
}

.avatar {
    width: 40px;
    height: 40px;
    background: #ddd;
    border-radius: 50%;
}

.body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.line {
    height: 10px;
    background: #ddd;
    border-radius: 4px;
}

.line.short {
    width: 30%;
}

.line.long {
    width: 100%;
}
</style>
