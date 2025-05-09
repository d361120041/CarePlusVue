<template>
    <!-- 利用 Teleport 將 Modal 結構渲染到 body 下 -->
    <Teleport to="body">
        <div v-if="visible" class="modal-backdrop">

            <!-- 在這一層攔截掉所有內部點擊，避免冒泡到 backdrop -->
            <div class="modal-content" @click.stop>

                <header class="modal-header">
                    <h3>{{ title }}</h3>
                    <button class="close-btn" @click="$emit('close')">✕</button>
                </header>

                <!-- 主內容由 slot 提供 -->
                <section class="modal-body">
                    <slot />
                </section>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    visible: Boolean,
    title: { type: String, default: 'Modal' }
})
const emit = defineEmits(['close'])
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    /* top: 0;
    left: 0;
    right: 0;
    bottom: 0; */
    inset: 0; /* top/right/bottom/left 全部 0 */
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 95%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

.modal-body {
    padding: 1rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}
</style>