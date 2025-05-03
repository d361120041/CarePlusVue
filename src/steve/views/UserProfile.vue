<template>
  <div class="max-w-2xl mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">編輯使用者資料</h2>

    <!-- 頭像 -->
    <div class="mb-4">
      <label class="block font-medium">目前頭像</label>
      <div
        class="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center border"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="使用者頭像"
          class="object-cover rounded-full"
          style="width: 128px; height: 128px"
        />
        <div v-else class="text-gray-400 text-sm text-center">無頭像</div>
      </div>
      <label class="block font-medium mt-4">上傳新頭像</label>
      <input type="file" @change="handleImageUpload" class="mt-1" />
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
          type="tel"
          v-model="user.phoneNumber"
          class="w-full border rounded p-2"
          minlength="8"
          maxlength="10"
          pattern="\\d{8,10}"
          required
        />
      </div>

      <!-- ✅ 地址下拉式 -->
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
        <label class="block font-medium">個人簡介 Bio</label>
        <textarea v-model="user.bio" class="w-full border rounded p-2" />
      </div>

      <div class="mb-4">
        <label class="block font-medium">自我介紹 Intro</label>
        <textarea v-model="user.intro" class="w-full border rounded p-2" />
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
import axios from "@/plugins/axios";

// 基本資料
const user = ref(null);
const imageUrl = ref(null);
const imageFile = ref(null);

// 地址欄位
const selectedCity = ref("");
const selectedDistrict = ref("");
const availableDistricts = ref([]);

// 縣市與區域資料
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
  新竹市: ["東區", "北區", "香山區"],
  新竹縣: ["竹北市", "竹東鎮", "新埔鎮"],
  苗栗縣: ["苗栗市", "頭份市", "竹南鎮"],
  臺中市: [
    "中區",
    "西區",
    "北區",
    "南區",
    "東區",
    "西屯區",
    "南屯區",
    "北屯區",
    "太平區",
    "大里區",
    "潭子區",
    "豐原區",
  ],
  彰化縣: ["彰化市", "員林市", "和美鎮"],
  南投縣: ["南投市", "草屯鎮", "埔里鎮"],
  雲林縣: ["斗六市", "虎尾鎮", "西螺鎮"],
  嘉義市: ["東區", "西區"],
  嘉義縣: ["太保市", "朴子市", "民雄鄉"],
  臺南市: [
    "中西區",
    "東區",
    "南區",
    "北區",
    "安平區",
    "安南區",
    "永康區",
    "歸仁區",
    "新化區",
    "仁德區",
  ],
  高雄市: [
    "鹽埕區",
    "鼓山區",
    "左營區",
    "楠梓區",
    "三民區",
    "新興區",
    "前金區",
    "苓雅區",
    "前鎮區",
    "小港區",
    "鳳山區",
    "林園區",
    "大寮區",
  ],
  屏東縣: ["屏東市", "潮州鎮", "東港鎮"],
  宜蘭縣: ["宜蘭市", "羅東鎮", "礁溪鄉"],
  花蓮縣: ["花蓮市", "吉安鄉", "新城鄉"],
  臺東縣: ["臺東市", "成功鎮", "關山鎮"],
  澎湖縣: ["馬公市", "湖西鄉"],
  金門縣: ["金城鎮", "金湖鎮", "金沙鎮"],
  連江縣: ["南竿鄉", "北竿鄉", "莒光鄉"],
};

// 初始資料
const fetchProfile = async () => {
  const res = await axios.get("http://localhost:8082/user/profile", {
    withCredentials: true,
  });
  user.value = res.data;

  // 還原地址（臺北市信義區）
  for (const city in taiwanAddress) {
    if (user.value.address?.startsWith(city)) {
      selectedCity.value = city;
      availableDistricts.value = taiwanAddress[city];
      selectedDistrict.value = user.value.address.slice(city.length);
      break;
    }
  }
};

const fetchImage = async () => {
  try {
    const res = await axios.get("http://localhost:8082/user/profile-picture", {
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
  if (file) imageFile.value = file;
};

const updateDistricts = () => {
  availableDistricts.value = taiwanAddress[selectedCity.value] || [];
  selectedDistrict.value = "";
};

const updateUser = async () => {
  try {
    // 合併城市與區為完整地址
    if (selectedCity.value && selectedDistrict.value) {
      user.value.address = `${selectedCity.value}${selectedDistrict.value}`;
    }

    await axios.put("http://localhost:8082/user/edit", user.value, {
      withCredentials: true,
    });

    if (imageFile.value) {
      const formData = new FormData();
      formData.append("file", imageFile.value);
      await axios.put("http://localhost:8082/user/edit/picture", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageFile.value = null;
    }

    await fetchImage();
    alert("資料更新成功");
  } catch {
    alert("更新失敗");
  }
};

onMounted(() => {
  fetchProfile();
  fetchImage();
});
</script>
