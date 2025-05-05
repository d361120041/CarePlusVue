import axios from '@/plugins/axios.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/courses'


// 取得全部課程
export const getAllCourses = () => axios.get(BASE_URL)

// 關鍵字搜尋課程
export const searchCourses = (keyword) =>
    axios.get(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`)

// 建立課程
export const createCourse = (course) =>
    axios.post(`${BASE_URL}/admin`, course)

// 更新課程
export const updateCourse = (id, course) =>
    axios.put(`${BASE_URL}/admin/${id}`, course)

// 刪除課程
export const deleteCourse = (id) =>
    axios.delete(`${BASE_URL}/admin/${id}`)

// 取得封面圖（可選）
export const getCourseImage = (id) =>
    axios.get(`${BASE_URL}/${id}/image`, { responseType: 'blob' })

// 取得課程總數（用於統計）
export const getCourseCount = () =>
    axios.get(`${BASE_URL}/count`)


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const getCourseImageUrl = (id) => {
    return `${apiBaseUrl}/api/courses/${id}/image`
}