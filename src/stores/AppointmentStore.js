import { defineStore } from "pinia";
import { ref, toRaw, isProxy } from "vue";
import { useAuthStore } from "@/stores/auth";
import authApi from "@/api/auth"; 
import myAxios from "@/plugins/axios";

export const useAppointmentStore = defineStore("appointment", {
  state: () => ({
    appointment: {
      userId: null,
      caregiverId: localStorage.getItem("caregiverId") || null,
      patientId: null,
      timeType: "continuous",
      contractConfirmed: false,
      status: "Pending",
      totalPrice: null,
      locationType: "居家", // or '醫院'
      patientInfo: {
        name: "",
        gender: "",
      },
      diseaseIds: [],
      physicalIds: [],
      serviceIds: [],
      diseaseOther: "",
      physicalOther: "",
      serviceOther: "",

      hospitalName: "",
      hospitalAddress: "",
      hospitalWardType: "一般病房",
      hospitalWardNumber: "",
      hospitalBedNumber: "",
      hospitalDepartment: "",
      hospitalTransportNote: "",
      homeAddress: "",
      homeTransportNote: "",
    },

    // 時間資料
    continuous: {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },

    multi: {
      multi: {
        startDate: "",
        endDate: "",
        repeatDays: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        timeSlots: [], // 支援多個時段
      },
    },

    // 疾病、身體狀況、服務名稱映射
    diseaseMap: {
      1: "無",
      2: "中風",
      3: "肺炎",
      4: "骨折",
      5: "帕金森氏症",
      6: "手術照顧",
      7: "高血壓",
      8: "糖尿病",
      9: "洗腎",
      10: "精神疾病",
      11: "失智症",
      12: "疥瘡或肺結核等傳染性疾病",
      13: "抑鬱症",
      14: "冠心病",
      15: "慢性阻塞性氣管病",
      16: "骨質疏鬆",
      17: "腸胃道感染",
      18: "其他",
    },

    physicalMap: {
      0: "無",
      1: "長期臥床",
      2: "使用輔具",
      3: "褥瘡、傷口",
      4: "管路（鼻胃管、尿管、氣切管、引流管等）",
      5: "腸造口/胃造口",
      6: "自殘傾向",
      7: "攻擊傾向",
      8: "情緒低落",
      9: "其他",
    },

    serviceMap: {
      0: "無",
      1: "協助進食、用藥（按醫囑給藥）",
      2: "陪同外出或就醫",
      3: "代購物品",
      4: "身心靈陪伴及安全維護",
      5: "備餐（限被照顧者及其伴侶）",
      6: "環境整理、洗衣",
      7: "翻身拍背、簡易肢體關節活動",
      8: "身體清潔",
      9: "大小便處理",
      10: "協助移位",
      11: "鼻胃管灌食",
      12: "管路清潔照護",
      13: "協助穿脫衣物",
      14: "協助如廁",
      15: "其他",
    },
  }),

  getters: {
    // 回傳已選疾病名稱
    selectedDiseaseNames(state) {
      return state.appointment.diseaseIds.map(
        (id) => state.diseaseMap[id] || "未知"
      );
    },

    // 回傳已選身體狀況名稱
    selectedPhysicalNames(state) {
      return state.appointment.physicalIds.map(
        (id) => state.physicalMap[id] || "未知"
      );
    },

    // 回傳已選服務名稱
    selectedServiceNames(state) {
      return state.appointment.serviceIds.map(
        (id) => state.serviceMap[id] || "未知"
      );
    },
  },

  actions: {
    syncUserId() {
      const auth = useAuthStore();
      if (auth.isAuthenticated && auth.user) {
        this.appointment.userId = auth.user.userId;
        console.log("User ID 設置成功:", this.appointment.userId);
      } else {
        this.appointment.userId = null;
        console.warn("使用者未登入，無法設置 userId");
      }
      this.saveToLocalStorage();
    },
   
    
    setPatientInfo(patientData) {
      const plainData = toRaw(patientData);
      
      // 設置基本病患資訊
      this.appointment.patientId = plainData.patientId || null;
      this.appointment.patientInfo = {
        name: plainData.name || "",
        gender:
        plainData.gender === 1 || plainData.gender === "1" ? "男" : "女",
      };

      this.saveToLocalStorage();
      console.log("Patient info 設置成功:", this.appointment.patientInfo);
    },

    setBasicDetails({ diseases, physicalConditions, services }) {
      this.appointment.diseaseIds = Array.isArray(diseases)
        ? diseases.map((d) => (typeof d === "object" ? d.id : d))
        : [];
      this.appointment.physicalIds = Array.isArray(physicalConditions)
        ? physicalConditions.map((p) => (typeof p === "object" ? p.id : p))
        : [];
      this.appointment.serviceIds = Array.isArray(services)
        ? services.map((s) => (typeof s === "object" ? s.id : s))
        : [];

      if (
        this.appointment.diseaseIds.length === 0 ||
        this.appointment.physicalIds.length === 0 ||
        this.appointment.serviceIds.length === 0 ||
        !this.appointment.patientId
      ) {
        console.warn(
          "請確保 patientId, diseaseIds, physicalIds, serviceIds 不為空"
        );
        return;
      }

      this.saveToLocalStorage();
      console.log("基本資料設置成功:", {
        diseases: this.appointment.diseaseIds,
        physicalConditions: this.appointment.physicalIds,
        services: this.appointment.serviceIds,
      });
    },

//yuuhou

// ✅ 追加：從後端載入使用者的所有預約紀錄
//     async loadAppointments(userId) {
//   try {
//     const response = await authApi.getUserAppointments(userId);

//     // 確保 API 回傳的是陣列
//     if (!Array.isArray(response.data)) {
//       console.error("❌ 預約紀錄回傳格式錯誤，應該是陣列:", response.data);
//       return [];
//     }

//     console.log("📅 已載入預約紀錄:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ 載入預約紀錄失敗:", error);
//     throw error;
//   }
// },


//yuuhou



    setAppointmentBase(payload) {
      this.appointment = { ...this.appointment, ...payload };
      this.saveToLocalStorage();
    },

    setCaregiverId(id) {
      this.appointment.caregiverId = id;
      localStorage.setItem("caregiverId", id);
      this.saveToLocalStorage();
    },

    setTime(type, payload) {
      this.appointment.timeType = type;
      if (type === "continuous") {
        this.continuous = { ...payload };
      } else if (type === "multi") {
        this.multi = { ...payload };
      }
      this.saveToLocalStorage();
    },

    // 設定醫院位置
    setHospitalLocation(payload) {
      Object.assign(this.appointment, {
        hospitalName: payload.hospitalName || "",
        hospitalAddress: payload.hospitalAddress || "",
        hospitalWardType: payload.hospitalWardType || "一般病房",
        hospitalWardNumber: payload.hospitalWardNumber || "",
        hospitalBedNumber: payload.hospitalBedNumber || "",
        hospitalDepartment: payload.hospitalDepartment || "",
        hospitalTransportNote: payload.hospitalTransportNote || "",
      });
      this.saveToLocalStorage();
    },

    // 設定居家位置
    setHomeLocation(payload) {
      Object.assign(this.appointment, {
        homeAddress: payload.homeAddress || "",
        homeTransportNote: payload.homeTransportNote || "",
      });
      this.saveToLocalStorage();
    },

    setTotalPrice(price) {
      this.appointment.totalPrice = price;
      this.saveToLocalStorage();
    },

    resetAll() {
      this.$reset();
      this.saveToLocalStorage();
    },

    // AppointmentStore.js

    saveToLocalStorage() {
      try {
        const data = JSON.stringify({
          appointment: toRaw(this.appointment),
          continuous: this.continuous,
          multi: this.multi,
        });
        localStorage.setItem("appointmentData", data);
        console.log("LocalStorage 設置成功:", data);
      } catch (error) {
        console.error("LocalStorage 儲存失敗:", error);
      }
    },

    loadFromLocalStorage() {
      const raw = localStorage.getItem("appointmentData");
      if (raw) {
        const parsed = JSON.parse(raw);
        this.appointment = {
          ...this.appointment,
          ...parsed.appointment,
          diseaseIds: parsed.appointment.diseaseIds || [],
          physicalIds: parsed.appointment.physicalIds || [],
          serviceIds: parsed.appointment.serviceIds || [],
        };
        this.continuous = parsed.continuous || this.continuous;
        this.multi = parsed.multi || this.multi;
      }
      this.syncUserId();
    },

  async submitAppointment() {
    try {

      const authStore = useAuthStore();

      // ✅ 確保 userId 正確
      if (!authStore.user || !authStore.user.userId) {
          throw new Error("User is not authenticated. 請先登入再嘗試提交預約。");
      }
      console.log("user:", authStore.user);
      const appointmentData = {
        appointment: {
          ...this.appointment,
          locationType:
            this.appointment.locationType === "居家" ? "居家" : "醫院",
        },
        continuous: null,
        multi: null,
        diseases: this.appointment.diseaseIds.map((id) => ({
          diseaseId: id,
        })),
        physicals: this.appointment.physicalIds.map((id) => ({
          physicalId: id,
        })),
        services: this.appointment.serviceIds.map((id) => ({
          serviceId: id,
        })),
      };
      // 設置時間資料
      if (
        this.appointment.timeType === "continuous" &&
        this.continuous.startDate &&
        this.continuous.startTime
      ) {
        appointmentData.continuous = {
          startTime: `${this.continuous.startDate}T${this.continuous.startTime}:00`,
          endTime: `${this.continuous.endDate}T${this.continuous.endTime}:00`,
        };
      } else if (this.appointment.timeType === "multi") {
        appointmentData.multi = {
          startDate: this.multi.multi.startDate,
          endDate: this.multi.multi.endDate,
          dailyStartTime:
            this.multi.multi.timeSlots[0].startTime || "00:00:00",
          dailyEndTime: this.multi.multi.timeSlots[0].endTime || "23:59:59",
          ...this.multi.multi.repeatDays,
        };
      }
  
      console.log("送出資料:", appointmentData);
  
      // ✅ 改用 axios 發送請求
      const response = await myAxios.post(
        "/api/appointment/full",
        appointmentData,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
  
      // 處理成功回應
      console.log("Appointment created successfully:", response.data);
      this.appointment.appointmentId = response.data.appointmentId;
      this.appointment.userId = response.data.userId;
      this.appointment.totalPrice = response.data.totalPrice;
  
      return response.data.appointmentId;
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("預約建立失敗，請稍後再試");
      throw error;
    }
  },
  },
  

  // ✅ 確保初始化時自動加載
  created() {
    this.loadFromLocalStorage();
  },
});
