<template>
  <div class="wrapper">
    <div class="success-card">
      <div class="icon-container">
        <svg
          class="check-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h1 class="section-title">付款成功！</h1>
      <p class="success-message">
        感謝你選擇Care+！我們致力於為您和您的家人提供專業、貼心的照護服務。您的預約已確認，我們的團隊將盡快與您聯繫，確保一切順利進行。
      </p>
      <!-- <button
        @click="goToOrders"
        class="view-button"
        aria-label="查看預約"
      >
        查看預約
      </button> -->
<router-link to="/user-center/orders" class="view-button"
        >查看預約</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// Navigate to orders page
const goToOrders = () => {
  router.push("user-center/orders");
};
</script>

<style scoped>
/* Global wrapper */
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 4rem);
}

/* Success card */
.success-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Checkmark icon */
.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.check-icon {
  width: 64px;
  height: 64px;
  color: #14b8a6;
  animation: pop 0.5s ease-out;
}

/* Title */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

/* Success message */
.success-message {
  font-size: 1.125rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* View button */
.view-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.view-button:hover {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.view-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.3);
}

/* Animation for checkmark */
@keyframes pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem 0.75rem;
  }

  .success-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .success-message {
    font-size: 1rem;
  }

  .view-button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }

  .check-icon {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.25rem;
  }

  .success-message {
    font-size: 0.875rem;
  }

  .view-button {
    font-size: 0.875rem;
    padding: 0.625rem 1.25rem;
  }
}
</style>