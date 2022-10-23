
import VueNumberFormat from '@igortrindade/vue-number-format'
import VueTheMask from 'vue-the-mask'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

// import AuthForm from '~~/modules/auth/AuthFormModal.vue'
// import SimulationRetirementOptionDetailDrawer from '@/modules/app/simulation/SimulationRetirementOptionDetailDrawer.vue'
import { vueNumberFormatDefaultOptions } from '@/util/functions/getCurrencyType'

export default (vueInstance) => {

  vueInstance.use(VueNumberFormat, vueNumberFormatDefaultOptions)
  vueInstance.use(VueTheMask)

  // vueInstance.component('AuthForm', AuthForm)
  // vueInstance.component('SimulationRetirementOptionDetailDrawer', SimulationRetirementOptionDetailDrawer)

  document.addEventListener("keydown", function(event) {
    if (event.altKey && event.code === "KeyX") {
      event.preventDefault()
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
      document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split('.').reverse().reduce(domain => (domain=domain.replace(/^\.?[^.]+/, ''),document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`,domain), location.hostname));

    }
  })

  dayjs.locale('pt-br')
}