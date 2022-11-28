import { defineStore } from 'pinia'
import Api from '@/util/Api'
import User from '@/entities/User'
import { useAppSimulationStore } from '@/modules/app/simulation/store'
import { useUserSimulationStore } from '@/modules/user/simulation/store'
import emitter from '@/util/emitter'
import LogRocket from 'logrocket'

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    loggedUser: null,
    loggedUserToken: null,
    redirectTo: null,
    redirectToEvent: null
  }),
  
  actions: {
    
    async login({ email, unencryptedPassword }) {
      return Api.post('/auth/login', { email, unencryptedPassword }).then(({ data }) => {
        this.loggedUserToken = data.token
        this.getLoggedUser()
      })
    },
    
    async signup({ name, email, phone, unencryptedPassword }) {
      return Api.post('/auth/signup', { name, email, phone, unencryptedPassword }).then(({ data }) => {
        this.loggedUserToken = data.token
        this.getLoggedUser()
      })
    },
    
    async googleLogin(code) {
      return Api.get(`/auth/googleLogin?code=${code}`)
      .then(({ data }) => {
        this.loggedUserToken = data.token
        this.getLoggedUser()
        emitter.emit('addToast', { message: 'Logado com sucesso', type: 'success' })
      })
    },
    
    async getLoggedUser() {
      const appSimulationStore = useAppSimulationStore()

      Api.get('/auth/getLoggedUser').then(({ data }) => {
        this.loggedUser = new User(data)
        appSimulationStore.attachSimulations()
        this.redirect()

        LogRocket.identify(this.loggedUser.id, { name: this.loggedUser.name, email: this.loggedUser.email })
      })
      .catch(err => console.log(err))
    },
    
    logout() {
      this.loggedUser = null
      this.loggedUserToken = null
    },

    setRedirectTo({ route, event = null, payload = null }) {
      this.redirectTo = route
      if(event) {
        this.redirectToEvent = { event, payload }
      }
    },
    
    redirect() {
      const route = useRoute()

      // console.log(this.redirectTo)
      // console.log(this.redirectToEvent)

      setTimeout(() => {
        this.redirectTo = ''
        this.redirectToEvent = null
      }, 5000)

      if(route.query.skipRedirect || this.redirectTo === false) return

      if(this.redirectTo === 'general') {
        this.generalRedirectTo()
      } else {
        if(this.redirectTo) {
          const router = useRouter()
          router.push(this.redirectTo)

          if(this.redirectToEvent) {
            setTimeout(() => {
              if(!this.redirectToEvent.payload) {
                emitter.emit(this.redirectToEvent.event)
              } else {
                emitter.emit(this.redirectToEvent.event, this.redirectToEvent.payload)
              }
            }, 1000)
          }
        }
      }

    },


    
    generalRedirectTo() {
      const router = useRouter()
      const userSimulationStore = useUserSimulationStore()
      // USER
      if(this.loggedUser.role === 'STANDARD') {
        userSimulationStore.getSimulations()
          .then(({ simulations }) => {
            if(simulations.length) router.push(`/minhas-simulacoes`)
          })
      // ADMIN
      } else {
        router.push(`/admin/simulations`)
      }
    }
  }
})