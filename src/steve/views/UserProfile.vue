<template>
  <div class="max-w-2xl mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">編輯使用者資料</h2>

    <!-- 頭像 -->
    <div class="mb-4">
      <label class="block font-medium mb-2"></label>
      <div
        style="
          width: 128px;
          height: 128px;
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="使用者頭像"
          style="width: 100%; height: 100%; object-fit: cover; display: block"
        />
        <div
          v-else
          class="text-gray-400 text-sm text-center w-full h-full flex items-center justify-center"
        >
          無頭像
        </div>
      </div>

      <label class="block font-medium mt-4">上傳新頭像</label>
      <input
        type="file"
        @change="handleImageUpload"
        class="hidden"
        ref="fileInput"
      />
    </div>

    <!-- 使用者資訊 -->
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
          style="margin-left: 96px"
          type="text"
          v-model="user.userName"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">Email</label>
        <input
          style="margin-left: 88px"
          type="email"
          v-model="user.emailAddress"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">電話</label>
        <input
          style="margin-left: 96px"
          type="tel"
          v-model="user.phoneNumber"
          class="w-full border rounded p-2"
          minlength="8"
          maxlength="10"
          pattern="\\d{8,10}"
          required
        />
      </div>

      <!-- 地址 -->
      <div class="mb-4">
        <label class="block font-medium">地址</label>
        <div class="flex gap-2 mb-2">
          <select
            v-model="selectedCity"
            @change="updateDistricts"
            class="border rounded p-2 w-1/2"
          >
            <option value="" disabled selected>請選擇城市</option>
            <option
              v-for="(districts, city) in taiwanAddress"
              :key="city"
              :value="city"
            >
              {{ city }}
            </option>
          </select>

          <select v-model="selectedDistrict" class="border rounded p-2 w-1/2">
            <option value="" disabled selected>請選擇區域</option>
            <option
              v-for="district in availableDistricts"
              :key="district"
              :value="district"
            >
              {{ district }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block font-medium">個人簡介</label>
        <br />
        <textarea
          style="width: 70%; height: 100px"
          v-model="user.bio"
          class="w-full border rounded p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium">自我介紹</label>
        <br />
        <textarea
          style="width: 70%; height: 100px"
          v-model="user.intro"
          class="w-full border rounded p-2"
        />
      </div>

      <button @click="updateUser" :disabled="loading" class="save-button">
        {{ loading ? "儲存中..." : "儲存變更" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";
import { useAuthStore } from "@/stores/auth";

// 使用者與圖片資料
const auth = useAuthStore();
const user = ref({ ...auth.user });
const imageUrl = ref(null);
const imageFile = ref(null);
const fileInput = ref(null);
const loading = ref(false);

// 地址邏輯
const selectedCity = ref("");
const selectedDistrict = ref("");
const availableDistricts = ref([]);
const taiwanAddress = {
  臺北市: [
    "中正區",
    "大同區",
    "中山區",
    "松山區",
    "大安區",
    "萬華區",
    "信義區",
    "士林區",
    "北投區",
    "內湖區",
    "南港區",
    "文山區",
  ],
  新北市: [
    "板橋區",
    "新莊區",
    "中和區",
    "永和區",
    "土城區",
    "樹林區",
    "三重區",
    "新店區",
    "蘆洲區",
    "汐止區",
    "淡水區",
  ],
  基隆市: [
    "仁愛區",
    "信義區",
    "中正區",
    "中山區",
    "安樂區",
    "暖暖區",
    "七堵區",
  ],
  桃園市: [
    "桃園區",
    "中壢區",
    "八德區",
    "蘆竹區",
    "平鎮區",
    "楊梅區",
    "龜山區",
    "大園區",
    "大溪區",
    "龍潭區",
  ],
  // ... 其他縣市省略
};

const restoreAddressSelect = () => {
  for (const city in taiwanAddress) {
    if (user.value.address?.startsWith(city)) {
      selectedCity.value = city;
      availableDistricts.value = taiwanAddress[city];
      selectedDistrict.value = user.value.address.slice(city.length);
      break;
    }
  }
};

const updateDistricts = () => {
  availableDistricts.value = taiwanAddress[selectedCity.value] || [];
  selectedDistrict.value = "";
};

const fetchImage = async () => {
  try {
    const res = await axios.get("/user/profile-picture", {
      responseType: "blob",
      withCredentials: true,
    });
    imageUrl.value = URL.createObjectURL(res.data);
  } catch {
    imageUrl.value = null;
  }
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    imageUrl.value = URL.createObjectURL(file); // 預覽
  }
};

const updateUser = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    if (selectedCity.value && selectedDistrict.value) {
      user.value.address = `${selectedCity.value}${selectedDistrict.value}`;
    }

    await axios.put("/user/edit", user.value, { withCredentials: true });

    if (imageFile.value) {
      const formData = new FormData();
      formData.append("file", imageFile.value);
      await axios.put("/user/edit/picture", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageFile.value = null;
    }

    await fetchImage();
    auth.user = { ...user.value };
    alert("資料更新成功");
  } catch {
    alert("更新失敗");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  restoreAddressSelect();
  fetchImage();
});
</script>

<style scoped>
.save-button {
  color: #00332e;
  text-decoration: none;
  margin-bottom: 6px;
  /* 增加每個按鈕的分隔感 */
  width: 10%;
  display: block;
  text-align: center;
  padding: 0.75rem;
  border-radius: 12px;
  background-color: #80ccc3;
  transition: box-shadow 0.3s, background-color 0.3s;
  font-weight: 500;
  border: 1px solid #4db6ac;
}
.save-button:hover {
  box-shadow: 0 0 8px #66cfc4;
  /* 藍色光暈 */
  background-color: #b3e2da;
}
</style>
