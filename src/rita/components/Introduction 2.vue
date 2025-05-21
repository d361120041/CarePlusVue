<template>
<!-- 1. 預約流程區塊 -->
<section class="reservation-section">
  <div class="reservation-card card shadow-sm text-center">
    <h2 class="mb-4 fw-bold">輕鬆找到最適合的居家/醫院看護</h2>

    <!-- 流程步驟 -->
    <div class="process-steps d-flex justify-content-center align-items-center flex-wrap mb-4">
      <div class="step d-flex flex-column align-items-center">
        <div class="step-circle">1</div>
        <div class="step-text" style="max-width: 180px;">填寫需求並篩選護理人員</div>
      </div>
      <div class="arrow">→</div>
      <div class="step d-flex flex-column align-items-center">
        <div class="step-circle">2</div>
        <div class="step-text" style="max-width: 180px;">填寫預約單</div>
      </div>
      <div class="arrow">→</div>
      <div class="step d-flex flex-column align-items-center">
        <div class="step-circle">3</div>
        <div class="step-text" style="max-width: 180px;">預約最適合的護理人員</div>
      </div>
    </div>

    <!-- 操作按鈕
    <div class="d-flex justify-content-center gap-3">
      <button class="btn btn-outline-success" @click="scrollToRequestForm">搜尋人選</button>
      <button class="btn btn-success" @click="goToRequestTime">填寫需求單</button>
    </div> -->
  </div>
</section>

</template>
<!-- <script>
const scrollToRequestForm = () => {
  const formEl = document.getElementById('request-form')
  formEl?.scrollIntoView({ behavior: 'smooth' })
}

const goToRequestTime = () => {
  router.push('/request-time')
}


</script> -->
<style scoped>
.reservation-section {
  padding: 4rem 1rem;
}

.reservation-card {
  background-color: #fff;
  border-radius: 20px;
  padding: 3rem;
  max-width: 960px;
  margin: 0 auto;
}

.step-circle {
  width: 50px;
  height: 50px;
  background-color: #4db6ac;
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.step-text {
  font-size: 1rem;
  max-width: 160px;
  text-align: center;
  color: #333;
}

.arrow {
  font-size: 2rem;
  margin: 0 1rem;
  color: #555;
}

@media (max-width: 768px) {
  .process-steps {
    flex-direction: column;
    gap: 1rem;
  }
  .arrow {
    transform: rotate(90deg);
    margin: 0.5rem 0;
  }
}


</style>