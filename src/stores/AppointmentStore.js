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
        timeSlots: [],
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
      1: "無",
      2: "長期臥床",
      3: "使用輔具",
      4: "褥瘡、傷口",
      5: "管路（鼻胃管、尿管、氣切管、引流管等）",
      6: "腸造口/胃造口",
      7: "自殘傾向",
      8: "攻擊傾向",
      9: "情緒低落",
      10: "其他",
    },

    serviceMap: {
      1: "無",
      2: "協助進食、用藥（按醫囑給藥）",
      3: "陪同外出或就醫",
      4: "代購物品",
      5: "身心靈陪伴及安全維護",
      6: "備餐（限被照顧者及其伴侶）",
      7: "環境整理、洗衣",
      8: "翻身拍背、簡易肢體關節活動",
      9: "身體清潔",
      10: "大小便處理",
      11: "協助移位",
      12: "鼻胃管灌食",
      13: "管路清潔照護",
      14: "協助穿脫衣物",
      15: "協助如廁",
      16: "其他",
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
      } else {
        this.appointment.userId = null;      }
      this.saveToLocalStorage();
    },

    setPatientInfo(patientData) {
      const plainData = toRaw(patientData);
      this.appointment.patientId = plainData.patientId || null;
      this.appointment.patientInfo = {
        name: plainData.name || "",
        gender:
          plainData.gender === 1 || plainData.gender === "1" ? "男" : "女",
      };

      this.saveToLocalStorage();
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
    },

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

    saveToLocalStorage() {
      try {
        const data = JSON.stringify({
          appointment: toRaw(this.appointment),
          continuous: this.continuous,
          multi: this.multi,
        });
        localStorage.setItem("appointmentData", data);
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
          throw new Error(
            "User is not authenticated. 請先登入再嘗試提交預約。"
          );
        }

        // 🚫 **在這裡清除 appointmentId**
        this.appointment.appointmentId = null;

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

        // ✅ 正確設置新的 appointmentId
        this.appointment.appointmentId = response.data.appointmentId;
        this.appointment.userId = response.data.userId;
        this.appointment.totalPrice = response.data.totalPrice;

        // ✅ 保存到 LocalStorage
        this.saveToLocalStorage();

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
