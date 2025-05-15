<template>
  <div
    class="patients-content flex h-full gap-6 items-start"
    style="background-color: #fff8f0"
  >
    <section class="list-section rounded overflow-y-auto h-full">
      <!-- 1. 改這行 -->
      <div class="flex items-center mb-4 space-x-2">
        <h2 class="text-xl font-bold">家屬管理</h2>
        <button
          @click="patientCount < 5 && goAdd()"
          class="addPatient"
          :disabled="patientCount >= 5"
        >
          <span class="plus-icon">＋</span>
        </button>
      </div>
      <table class="min-w-full bg-transparent border">
        <thead>
          <tr>
            <th class="px-4 py-2 border">姓名</th>
            <th class="px-4 py-2 border">生日</th>
            <th class="px-4 py-2 border">性別</th>
            <th class="px-4 py-2 border">緊急聯絡</th>
            <th class="px-4 py-2 border">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p.patientId" class="hover:bg-gray-50">
            <td class="px-4 py-2 border">{{ p.name }}</td>
            <td class="px-4 py-2 border">{{ formatDate(p.birthday) }}</td>
            <td class="px-4 py-2 border">
              {{ p.gender === 1 ? "男性" : "女性" }}
            </td>
            <td class="px-4 py-2 border">{{ p.emergencyContact }}</td>
            <td class="px-4 py-2 border space-x-1">
              <button @click="goEdit(p.patientId)" class="edit">編輯</button>
              <button @click="deletePatient(p.patientId)" class="delete">
                刪除
              </button>
            </td>
          </tr>
          <tr v-if="patients.length === 0">
            <td colspan="5" class="px-4 py-2 text-center text-gray-500">
              目前沒有任何病患
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- 插圖區塊已移除 -->
    <div class="static-image-wrapper">
      <img
        :src="oldImage"
        class="static-decoration"
        width="300"
        height="300"
        loading="eager"
      />
    </div>
  </div>
</template>

<script setup>
import oldImage from "@/assets/images/old.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

const patients = ref([]);
const router = useRouter();
const patientCount = ref(0);

const fetchPatients = async () => {
  const res = await axios.get("/patient/my");
  patients.value = res.data;
  patientCount.value = patients.value.length;
};
onMounted(fetchPatients);

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

const goAdd = () => router.push("/user-center/patients/add");
const goEdit = (id) => router.push(`/user-center/patients/edit/${id}`);
const deletePatient = async (id) => {
  if (!confirm("確定要刪除此病患？")) return;
  try {
    await axios.delete(`/patient/delete/${id}`);
    fetchPatients();
  } catch {
    alert("刪除失敗");
  }
};
</script>

<style scoped>
.static-image-wrapper {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
}

.patients-content {
  height: 100%;
  background-color: #fff8f0;
  display: flex;
  justify-content: center; /* ✅ 讓內容水平置中 */
  align-items: flex-start; /* ✅ 元素對齊上方 */
  padding: 2rem;
}

.list-section {
  padding: 1.2rem;
  border-radius: 16px; /* Tailwind 的 .rounded */
  overflow-y: auto; /* Tailwind 的 .overflow-y-auto */
  height: 100%; /* Tailwind 的 .h-full */
  background-color: #fff7ed;
  /* 其餘樣式保留 */
}

/* 浅绿色圆形按钮，只显示“＋” */
.addPatient {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #006400; /* 墨綠 */
  border: 1px solid #004d00; /* 深綠邊框 */
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0;
}
.addPatient:hover:not(:disabled) {
  background-color: #005f00; /* hover 深一點 */
}
.addPatient:disabled {
  background-color: #eeeeee;
  border-color: #cccccc;
  cursor: not-allowed;
}

/* 白色加號 */
.plus-icon {
  color: white;
  font-size: 1.25rem;
  line-height: 1;
}
.edit,
.delete {
  padding: 0.25rem 0.75rem; /* 由原本 0.5rem 1rem 縮小 */
  font-size: 0.875rem; /* 由原本約 1rem 縮小 */
  border-radius: 6px; /* 邊角也可微調 */
  color: white;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: 2px solid transparent;
  transition: background-color 0.3s, border-color 0.3s;
}
.edit {
  background-color: #3e9bdc;
  border-color: #3e9bdc;
  margin-right: 0.25rem;
}
.edit:hover {
  background-color: #2c82c9;
  border-color: #2c82c9;
}
.delete {
  background-color: #ff9999;
  border-color: #ff9999;
}
.delete:hover {
  background-color: #ff6666;
  border-color: #ff6666;
}
</style>
