import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem('authToken') ||
    localStorage.getItem('authToken')
     console.log('Interceptor picks up token:', token) 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
