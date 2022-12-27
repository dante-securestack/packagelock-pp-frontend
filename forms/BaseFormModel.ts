import { ObjectHelpers, ArrayHelpers } from '@igortrindade/lazyfy'
import Validators from '@/forms/Validators'
export default class BaseFormModel {

  tried: boolean = false
  
  get fillable(): any {
    return []
  }

  get requireds(): any {
    return []
  }

  public setFillableKeys(data = {}) {
    for(const key of this.fillable) {
      if(typeof(data[key]) !== 'undefined') {
        this[key] = data[key]
      }
    }
  }


  get errors() {
    return this.requireds.filter((req) => {

      if (typeof (req.validator) === 'function') {
        return req.validator(this[req.item], this)
      } else if (typeof(req.validator) === 'string') {
        if(this.validateItemString(req.validator, this[req.item])) {
          return this.validateItemString(req.validator, this[req.item])
        }
      } else if (Array.isArray(req.validator)) {
        for(const validatorStringRefference of req.validator) {
          if(this.validateItemString(validatorStringRefference, this[req.item])) return true
        }
      }

      if (
        typeof (this[req.item]) == 'string' && !this[req.item].length
        || Array.isArray(this[req.item]) && !this[req.item].length
        || typeof (this[req.item]) == 'object' && !this[req.item]
      ) {
        return true
      }

      return false
    }).map((item) => {
      return { item: item.item, label: item.label }
    })
  }

  get hasError(){
    return (this.errors.length) ? true : false
  }

  get errorPhrase() {
    return {
      init: 'Por favor, verifique os itens ',
      end: ' para continuar.'
    }
  }

  get validationPhrase() {
    return this.errorPhrase.init + this.errors.map((erro) => erro.label ? erro.label : erro.item).join(', ') + this.errorPhrase.end
  }

  get validationPhraseHtml() {
    return `${this.errorPhrase.init} <b>${this.errors.map((erro) => erro.label).join(', ')}</b> ${this.errorPhrase.end}`
  }

  validateItemString(validatorStringRefference, itemValue) {
    const [value, arg] = validatorStringRefference.split(':')
    if(!Validators[value]) {
      console.warn(`Validator method: ${value} not found!`)
      return false
    } else {
      if(!arg) return Validators[value](itemValue)
      return Validators[value](itemValue, arg)
    }
  }

  validateInput(input) {
    return ArrayHelpers.find(this.errors, { item: input }) ? true : false
  }

}

