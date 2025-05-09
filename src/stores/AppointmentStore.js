import { defineStore } from 'pinia'
import { ref } from 'vue';


export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointment: {
      userId: null,
      caregiverId: null,
      patientId: null,
      patientInfo: {},
      timeType: 'continuous',
      contractConfirmed: false,
      status: 'Pending',
      totalPrice: null,
      locationType: 'Home' // or 'Hospital'
    },

    // 時間資料
    continuous: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    },
    multi: {
      multi: {
        startDate: '',
        endDate: '',
        repeatDays: { // 修改為物件
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        },
        timeSlots: []  // 支援多個時段
      },
    },

    // 地點資料（分 hospital/home）
    location: {
      hospitalName: '',
      hospitalAddress: '',
      hospitalWardType: '一般病房',
      hospitalWardNumber: '',
      hospitalBedNumber: '',
      hospitalDepartment: '',
      hospitalTransportNote: '',

      homeAddress: '',
      homeTransportNote: ''
    }
  }),

  actions: {

    setPatientInfo(patientData) {
      this.appointment.patientId = patientData.patientId;
      this.appointment.patientInfo = { 
        name: patientData.name || '',
        gender: patientData.gender === 1 ? '男' : '女',
        diseases: patientData.diseases || [],
        diseaseOther: patientData.diseaseOther || '',
        physicalConditions: patientData.physicalConditions || [],
        physicalOther: patientData.physicalOther || '',
        services: patientData.services || [],
        serviceOther: patientData.serviceOther || ''
      };
    },
    
    setAppointmentBase(payload) {
      this.appointment = { ...this.appointment, ...payload }
    },

    setCaregiverId(id) {
      this.appointment.caregiverId = id;
    },

    setTime(type, payload) {
      this.appointment.timeType = type;
      if (type === 'continuous') {
        this.continuous = { ...payload };
      } else if (type === 'multi') {
        this.multi = { ...payload };
      }
    },

    setLocationType(type) {
      this.appointment.locationType = type
    },

    setHospitalLocation(payload) {
      this.location = { ...this.location, ...payload }
    },

    setHomeLocation(payload) {
      this.location = { ...this.location, ...payload }
    },

    setTotalPrice(price) {
      this.appointment.totalPrice = price
    },

    resetAll() {
      this.$reset()
    },

    saveToLocalStorage() {
      localStorage.setItem('appointmentData', JSON.stringify({
        appointment: this.appointment,
        continuous: this.continuous,
        multi: this.multi,
        location: this.location
      }))
    },

    loadFromLocalStorage() {
      const raw = localStorage.getItem('appointmentData')
      if (raw) {
        const parsed = JSON.parse(raw)
        this.appointment = parsed.appointment || this.appointment
        this.continuous = parsed.continuous || this.continuous
        this.multi = parsed.multi || this.multi
        this.location = parsed.location || this.location
      }
    },

    async submitAppointment() {
      const appointmentData = {
        appointment: { ...this.appointment },
        diseases: [], // 從您的 Vue 組件獲取
        physicals: [], // 從您的 Vue 組件獲取
        services: [], // 從您的 Vue 組件獲取
        continuous: null,
        multi: null
      };

      if (this.appointment.timeType === 'continuous') {
        appointmentData.continuous = {
          startTime: `${this.continuous.startDate}T${this.continuous.startTime}:00`,
          endTime: `${this.continuous.endDate}T${this.continuous.endTime}:00`
        };
      } else if (this.appointment.timeType === 'multi') {
        appointmentData.multi = {
          startDate: this.multi.startDate,
          endDate: this.multi.endDate,
          appointmentTimeMulti: this.multi.timeSlots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        };
      }

      try {
        const response = await fetch('/api/appointment/full', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData)
        });
        // ... 處理回應
      } catch (error) {
        console.error('Error creating appointment:', error);
      }
    },
  }
})