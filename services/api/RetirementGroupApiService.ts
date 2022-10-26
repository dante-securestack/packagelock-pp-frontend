import Api from '@/util/Api'

export default class RetirementGroupApiService {

  static updateOrCreate(payload) {
    return Api.post(`/api/admin/retirementGroup/updateOrCreate`, payload)
  }


}