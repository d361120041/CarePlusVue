// import myAxios from '../plugins/axios';

// export default {
//   register(data)   { return myAxios.post('/api/auth/register', data); },
//   login(email, pwd){ return myAxios.post('/api/auth/login', { email, password: pwd }); },
//   // 其他函式可陸續加在這裡



  // src/api/auth.js

import myAxios from '../plugins/axios';

export default {
  login(email, password) {
    return myAxios.post('/api/auth/login', { email, password })
  },
  register(data) {
    return myAxios.post('/api/auth/register', data)
  },
  verify(data) {
    return myAxios.post('/api/auth/verify', data)
  },
  forgotPassword(email) {
    return myAxios.post('/api/auth/forgot-password', { email })
  },
  resetPassword(payload) {
    return myAxios.post('/api/auth/reset-password', payload)
  },
   getMyAppointments() {
    return myAxios.get('/api/caregivers/me/appointments');
  },
};
