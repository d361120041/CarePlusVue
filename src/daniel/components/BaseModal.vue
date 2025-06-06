<template>
    <!-- 利用 Teleport 將 Modal 結構渲染到 body 下 -->
    <Teleport to="body">
        <div v-if="visible" class="modal-backdrop">

            <!-- 在這一層攔截掉所有內部點擊，避免冒泡到 backdrop -->
            <div class="modal-content" @click.stop>

                <header class="post-modal-header">
                    <h3>{{ title }}</h3>
                    <button class="close-btn" @click="$emit('close')">✕</button>
                </header>

                <!-- 主內容由 slot 提供 -->
                <section class="post-modal-body">
                    <slot />
                </section>

                <!-- 可擴充 footer slot -->
                <footer class="post-modal-footer" v-if="$slots.footer">
                    <slot name="footer" />
                </footer>
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
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
}

.modal-content {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 12px;
    width: 500px;
    max-width: 95%;
    max-height: 95vh;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.post-modal-header {
    background: #f7f7f7;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
}

.post-modal-header h3 {
    flex: 1;
    text-align: center;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    transition: transform 0.2s ease;
}

.close-btn:hover {
    color: #d9534f;
}

.post-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.5rem 0;
    background: #fff;
    /* 滾動條淡化 */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.post-modal-body::-webkit-scrollbar {
    width: 6px;
}

.post-modal-body::-webkit-scrollbar-track {
    background: transparent;
}

.post-modal-body::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
</style>