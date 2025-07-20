<template>
  <div class="wrapper">

    <!-- 📋 訂單資訊區塊 -->
    <div class="card-section mb-8">
      <h2 class="section-title">訂單資訊</h2>
      <div v-if="appointment" class="info-grid">
        <!-- 訂單號碼 -->
        <div class="info-item">
          <span class="label">訂單號碼</span>
          <span class="value">
            {{
              appointment.appointmentId
                ? `carePlus0522id${appointment.appointmentId}`
                : "未提供"
            }}
          </span>
        </div>

        <!-- 總金額 -->
        <div class="info-item">
          <span class="label">總金額</span>
          <span class="value">
            {{
              appointment.totalPrice
                ? `${appointment.totalPrice} 元`
                : "計算中..."
            }}
          </span>
        </div>
      </div>
      <div v-else class="loading-state text-center py-12">
        <div
          class="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"
        ></div>
        <p class="mt-4 text-lg text-gray-600">正在載入訂單資訊...</p>
      </div>
    </div>

    <!-- 📜 合約內容區塊 -->
    <div class="card-section mb-8">
      <h2 class="section-title">照護服務接受須知</h2>
      <div
        class="contract-content bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto"
      >
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
          照護服務接受須知 一、服務內容
          照護員需根據顧客提供的需求單，提供個人衛生協助、日常生活照護、健康監測等相關服務。
          照護員需熟悉顧客的身體狀況、疾病史及特殊需求，並確保服務質量。
          二、服務準備 確保服務開始前已充分了解顧客需求並準備必要的護理工具。
          確認服務地點是否安全並符合衛生標準。 三、服務態度
          始終保持專業、耐心和關愛的態度，尊重顧客隱私。
          嚴禁透露顧客的個人資訊或健康狀況給第三方。
          如顧客有特別指示，需盡量滿足並耐心解釋服務內容。 四、服務期間
          準時抵達服務地點，按時提供服務，並避免無故遲到或早退。
          若發現顧客身體異常，應立即通知其家屬或負責醫療單位。
          禁止在服務期間進行任何與服務無關的活動，包括私人通話或觀看影片。
          五、服務變更與取消
          若需更改或取消服務，應至少提前24小時通知平台或顧客。
          未經顧客同意，不得提前結束服務或擅自改變服務內容。 六、安全與責任
          照護員應對服務期間顧客的安全負責，避免發生意外或人身傷害。
          禁止進行任何可能危害顧客健康或安全的行為。
          若發生意外，需立即向平台報告並協助處理相關事宜。 七、費用與付款
          服務費用將根據平台設定標準計算，並在顧客付款後統一結算。
          禁止向顧客私下收取額外費用或要求額外報酬。 八、違規處理
          若發現服務態度不佳、違反平台規定或涉及違法行為，平台有權終止合作。
          嚴重違規者將被列入平台黑名單，並視情況採取法律行動。
        </p>
      </div>

      <!-- 勾選框與確認按鈕 -->
      <div class="mt-6 flex items-center">
        <input
          type="checkbox"
          v-model="isContractConfirmed"
          @change="confirmContract"
          id="contract-checkbox"
          class="h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
        />
        <label for="contract-checkbox" class="ml-2 text-gray-700 font-medium">
          我已閱讀並同意以上合約內容
        </label>
      </div>
    </div>

    <!-- 💳 付款按鈕 -->
    <div class="card-section">
      <h2 class="section-title">付款</h2>
      <p class="text-gray-600 mb-4">本平台使用第三方支付「綠界ECPAY」進行付款</p>
      <button
        @click="proceedToPayment"
        :disabled="!appointment"
        class="payment-button w-full flex justify-center items-center py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
        :class="
          appointment
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        "
        aria-label="前往付款"
      >
        前往綠界支付
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import myAxios from "@/plugins/axios";
import Swal from "sweetalert2";

const router = useRouter();
const appointment = ref(null);
const isContractConfirmed = ref(false);

onMounted(async () => {
  const appointmentId = localStorage.getItem("appointmentId");
  console.log("從 localStorage 取得的 appointmentId:", appointmentId);

  if (!appointmentId) {
    Swal.fire({
      title: "錯誤",
      text: "無法找到預約 ID，請重新進入預約流程。",
      icon: "error",
      confirmButtonText: "確定",
    });
    router.push("/");
    return;
  }

  try {
    // 取得 Appointment 基本資料
    const response = await myAxios.get(`/api/appointment/${appointmentId}`);
    const data = response.data;
    console.log("Appointment data:", data);

    // 設定 Appointment 資料
    appointment.value = {
      appointmentId: data.appointmentId,
      totalPrice: data.totalPrice,
    };
  } catch (error) {
    console.error("Failed to fetch appointment details:", error);
    Swal.fire({
      title: "錯誤",
      text: "無法載入訂單資訊，請稍後再試！",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
});

const confirmContract = async () => {
  if (!isContractConfirmed.value) {
    Swal.fire({
      title: "提示",
      text: "請勾選同意合約內容！",
      icon: "warning",
      confirmButtonText: "確定",
    });
    return;
  }

  try {
    const appointmentId = appointment.value.appointmentId;
    const response = await myAxios.put(
      `/api/appointment/${appointmentId}/contract`
    );
    appointment.value = response.data; // 更新本地預約資料
    Swal.fire({
      title: "成功",
      text: "合約已確認！",
      icon: "success",
      confirmButtonText: "確定",
    });
  } catch (error) {
    console.error("Failed to confirm contract:", error);
    Swal.fire({
      title: "錯誤",
      text: "合約確認失敗，請稍後再試！",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

const proceedToPayment = async () => {
  try {
    // ✅ 確保已從 localStorage 取得 appointmentId
    const appointmentId = localStorage.getItem("appointmentId");

    if (!appointmentId) {
      Swal.fire({
        title: "錯誤",
        text: "無法找到預約 ID，請重新進入預約流程。",
        icon: "error",
        confirmButtonText: "確定",
      });
      router.push("/");
      return;
    }

    // 使用 URLSearchParams 將資料格式化為 x-www-form-urlencoded 格式
    const formData = new URLSearchParams();
    formData.append('appointmentId', appointmentId);

   // 發送 GET 請求，並將 appointmentId 作為查詢參數傳遞
   const response = await myAxios.post("/payment/ecpay", formData);
    console.log(response.data);

    // 將返回的表單 HTML 插入到頁面並提交
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = response.data;  // 假設返回的內容是 HTML 表單
    document.body.appendChild(tempDiv);
    tempDiv.querySelector("form").submit();  // 直接提交該表單


    // // 跳轉到支付成功頁面（在當前頁面，非新分頁）
    router.push("/payment/success");

    // // ✅ 清空 localStorage
    localStorage.removeItem("appointmentData");
    localStorage.removeItem("appointmentId");
    localStorage.removeItem("caregiverId");
    localStorage.removeItem("continuousEndDate");
    localStorage.removeItem("continuousEndTime");
    localStorage.removeItem("continuousStartDate");
    localStorage.removeItem("continuousStartTime");
    localStorage.removeItem("timeType");

    console.log("LocalStorage 清空完成");
  } catch (error) {
    console.error("Failed to proceed to payment:", error);
    Swal.fire({
      title: "錯誤",
      text: "無法初始化支付，請稍後再試！",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

const goBack = () => {
  router.push("/appointments");
};
</script>

<style scoped>
.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card-section {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  transition: transform 0.3s ease;
}

.card-section:hover {
  transform: translateY(-4px);
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  background-color: #e5f4f5;
  border-radius: 8px;
  border: 1px solid #b0e0e6;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #d1ecee;
  color: #0f766e;
  transform: translateX(-2px);
}

.back-button svg {
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-3px);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 1rem;
  color: #1f2937;
  margin-top: 0.25rem;
}

.contract-content {
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.payment-button {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white; /* 保證文字顏色明顯 */
  font-size: 16px; /* 提供適當的字型大小 */
  font-weight: 600; /* 使用稍微粗一點的字體 */
  padding: 12px 24px; /* 增加內邊距，使按鈕更大、更容易點擊 */
  border-radius: 8px; /* 圓角 */
  border: none; /* 去除邊框 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 增加陰影，提升立體感 */
  transition: all 0.3s ease; /* 平滑過渡效果 */
}

.payment-button:hover:enabled {
  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
  transform: translateY(-2px); /* 當滑鼠懸停時，略微提升按鈕 */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* 當滑鼠懸停時，增強陰影 */
}

.payment-button:focus {
  outline: none; /* 去除默認焦點框 */
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.6); /* 聚焦時顯示陰影 */
}

.payment-button:disabled {
  background: #d1d5db; /* 禁用時顏色變淡 */
  color: #6b7280; /* 禁用時文字變灰 */
  box-shadow: none; /* 禁用時去掉陰影 */
  cursor: not-allowed; /* 禁用時顯示禁用指標 */
}


.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 1.5rem 1rem;
  }

  .card-section {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
