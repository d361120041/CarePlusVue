<template>
  <div class="max-w-2xl mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">編輯使用者資料</h2>

    <div v-if="user">
      <div class="mb-4">
        <label class="block font-medium">帳號（無法修改）</label>
        <input
          type="text"
          v-model="user.userAccount"
          disabled
          class="w-full border rounded p-2 bg-gray-100"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">姓名</label>
        <input
          type="text"
          v-model="user.userName"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">Email</label>
        <input
          type="email"
          v-model="user.emailAddress"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">電話</label>
        <input
          type="text"
          v-model="user.phoneNumber"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">地址</label>
        <input
          type="text"
          v-model="user.address"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">個人簡介 Bio</label>
        <textarea
          v-model="user.bio"
          class="w-full border rounded p-2"
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="block font-medium">自我介紹 Intro</label>
        <textarea
          v-model="user.intro"
          class="w-full border rounded p-2"
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="block font-medium">頭像上傳</label>
        <input type="file" @change="handleImageUpload" />
        <img
          v-if="previewImage"
          :src="previewImage"
          class="mt-2 w-32 h-32 object-cover rounded"
        />
      </div>

      <button
        @click="updateUser"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        儲存變更
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const user = ref(null);
const previewImage = ref(null);

// 載入資料
onMounted(async () => {
  const res = await axios.get("http://localhost:8082/user/profile", {
    withCredentials: true,
  });
  user.value = res.data;
  previewImage.value = user.value.profilePicture;
});

// 更新資料
const updateUser = async () => {
  await axios.put("http://localhost:8082/user/edit", user.value, {
    withCredentials: true,
  });
  alert("資料更新成功");
};

// 上傳圖片
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePicture", file);

  const res = await axios.put(
    "http://localhost:8082/user/edit-profile-picture",
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  previewImage.value = URL.createObjectURL(file);
};
</script>
