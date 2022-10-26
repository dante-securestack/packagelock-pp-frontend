import Api from '@/util/Api'
import { isProxy, toRaw } from 'vue'

export default class AdminGeneralApiService {

  static updateOrCreate(entity, instance, route = '/admin/general/updateOrCreate') {
    
    if(isProxy(instance)) {
      instance = toRaw(instance)
    }

    if(instance.file && instance.file.name) {

      const fd = new FormData()
      fd.append('entity', entity)
      Object.keys(instance).forEach((key) => {
        if( ![undefined, null].includes(instance[key]) )  {
          if(key === 'file') {
            fd.append(key, instance[key])
          } else if(typeof(instance[key]) === 'object') {
            fd.append(key, JSON.stringify(instance[key]))
          } else {
            fd.append(key, instance[key])
          }
        }
      })

      return Api.post(route, fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    } else {
      return Api.post(route, { entity, ...instance })
    }

  }


}