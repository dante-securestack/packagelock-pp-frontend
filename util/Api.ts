import axios from 'axios'
import config from '@/config'
import { useAuthStore } from "@/modules/auth/store"


/**
 * Default headers
 */
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = '*/*'
axios.defaults.baseURL = config[process.env.NODE_ENV]['API_BASE_URL']


/**
 * Request interceptors
 */
axios.interceptors.request.use(function (request) {

  request.headers['init'] = new Date().getTime()
  
  const authStore = useAuthStore()
  const { loggedUserToken } = authStore
  if(loggedUserToken) request.headers['Authorization'] = `Bearer ${loggedUserToken}`

  return request
}, function (error) {
  // console.log(error)
  return Promise.reject(error)

})

/**
 * Response interceptors
 */
axios.interceptors.response.use(function (response) {
  if(response.config['delay']) {
    const init = response.config.headers['init']
    const end = (new Date().getTime() - init)
    if(end > response.config['delay']) return response
    return new Promise(resolve => setTimeout(() => resolve(response), (response.config['delay'] - end)))
  }
  return response

}, function (error) {

  const authStore = useAuthStore()

  const router = useRouter()
  if(error.response && [401, 403].includes(error.response.status)) {
    alert('Sessão expirada.')
    authStore.logout()

    setTimeout(() => {
      router.push('/')
    }, 200)
  }

  return Promise.reject(error)

})

export default axios
