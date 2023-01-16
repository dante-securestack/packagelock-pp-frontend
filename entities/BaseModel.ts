import { ObjectHelpers } from '@igortrindade/lazyfy'
export default class BaseModel {

  static fillable =  []

  get requireds() {
    return []
  }

  public static getFillableKeys(data: any = {}) {
    return ObjectHelpers.filterObjectKeys(this.fillable, data)
  }

  public setFillableKeys(instance, keys, data) {
    for(const key of keys) {
      if(typeof(data[key]) !== 'undefined') instance[key] = data[key]
    }
  }

}

