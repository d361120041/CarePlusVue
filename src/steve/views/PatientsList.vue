<template>
  <div
    class="patients-content flex h-full gap-6 items-start"
    style="background-color: #fff8f0"
  >
    <!-- 左側：病患管理卡片 -->
    <section
      class="list-section p-6 rounded overflow-y-auto h-full"
      style="background-color: #fff7ed"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">病患管理</h2>
        <button
          @click="patientCount < 5 ? goAdd() : alert('已達到登記上線')"
          :class="
            patientCount < 5
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          "
          class="addPatient"
        >
          {{ patientCount < 5 ? "新增患者" : "已達到登記上線" }}
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
            <td class="px-4 py-2 border space-x-2">
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
  </div>
</template>

<script setup>
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
.patients-content {
  height: 100%;
  display: flex;
  gap: 1.5rem;
  background-color: #fff8f0;
}

.list-section {
  flex: 1;
  border-radius: 16px;
  padding: 1rem;
  background-color: #fff7ed;
  overflow-y: auto;
}

.addPatient {
  color: white;
  margin-bottom: 6px;
  width: 25%;
  text-align: center;
  padding: 0.75rem;
  border-radius: 12px;
  background-color: #80ccc3;
  transition: box-shadow 0.3s, background-color 0.3s;
  font-weight: 500;
  border: 1px solid #4db6ac;
}
.addPatient:hover {
  background-color: #66cfc4;
}

.edit,
.delete {
  padding: 0.5rem 1rem;
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
