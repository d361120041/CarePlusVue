import axios from '@/plugins/axios.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/courses'

export const getAllCourses = () => axios.get(BASE_URL)

export const searchCourses = (keyword) =>
    axios.get(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`)

export const createCourse = (course) =>
    axios.post(`${BASE_URL}/admin`, course)

export const updateCourse = (id, course) =>
    axios.put(`${BASE_URL}/admin/${id}`, course)

export const deleteCourse = (id) =>
    axios.delete(`${BASE_URL}/admin/${id}`)

export const getCourseCount = () =>
    axios.get(`${BASE_URL}/count`)


