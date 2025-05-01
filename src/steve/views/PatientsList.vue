<template>
  <div class="patients-content flex h-full gap-6">
    <!-- 右側內容：患者列表 -->
    <section
      class="list-section flex-1 p-6 bg-white shadow rounded overflow-y-auto"
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
          class="text-white px-4 py-2 rounded"
        >
          {{ patientCount < 5 ? "新增患者" : "已達到登記上線" }}
        </button>
      </div>
      <table class="min-w-full bg-white border">
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
              <button
                @click="goEdit(p.patientId)"
                class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                編輯
              </button>
              <button
                @click="deletePatient(p.patientId)"
                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";
import Sidebar from "@/steve/views/Sidebar.vue";

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

const goAdd = () => {
  router.push("/user-center/patients/add");
};

const goEdit = (id) => {
  router.push(`/user-center/patients/edit/${id}`);
};

const deletePatient = async (id) => {
  if (!confirm("確定要刪除此病患？")) return;
  try {
    await axios.delete(`/patient/delete/${id}`);
    fetchPatients();
  } catch {
    alert("刪除失敗");
  }
};

onMounted(fetchPatients);
</script>

<style scoped>
.patients-content {
  height: 100%;
  display: flex;
  gap: 1.5rem;
}
</style>
