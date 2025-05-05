import { defineStore } from 'pinia'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointment: {
      userId: null,
      caregiverId: null,
      patientId: null,
      timeType: 'continuous',
      contractConfirmed: false
    },
  
    // 🧠 Step1：時間
    continuous: {
      startTime: '',
      endTime: ''
    },
    multi: {
      startDate: '',
      endDate: '',
      dailyStartTime: '',
      dailyEndTime: ''
    },
  
    // 👤 Step2：病人資料
    patient: {
      name: '',
      birthday: '',
      gender: '',
      detail: '',
      emergencyContact: ''
    },
    diseases: [],
    physicals: [],
  
    // 📍 Step3：地點與服務
    location: {
      type: 'Home', // or Hospital
      address: '',
      hospitalName: '',
      wardType: '',
      wardNumber: '',
      bedNumber: '',
      department: '',
      transportNote: ''
    },
    services: [],
  
    totalPrice: null
  }),

  actions: {
    setTime(type, payload) {
      this.appointment.timeType = type
      if (type === 'continuous') {
        this.continuous = { ...payload }
      } else {
        this.multi = { ...payload }
      }
    },
    setPatientInfo(payload) {
      this.patient = { ...payload }
    },
    setDiseases(list) {
      this.diseases = list
    },
    setPhysicals(list) {
      this.physicals = list
    },
    setLocation(payload) {
      this.location = { ...payload }
    },
    setServices(list) {
      this.services = list
    },
    setTotalPrice(price) {
      this.totalPrice = price
    },
    resetAll() {
      this.$reset()
    }
  }  
})
