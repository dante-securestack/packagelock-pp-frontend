<template>
  <div class="block w-full">
    <label v-if="label">
      <span class="border-b-4 border-zinc-200">{{ label }}</span>
    </label>
    <div class="relative mt-2">
      <div
        v-if="icon"
        class="icon-classes"
      >
        <AppIcons :icon="icon" color="text-slate-300" size="18" />
      </div>

      <VueNumberFormat
        :type="type"
        :id="id_input"
        :placeholder="placeholder || label"
        v-model:value="childValue"
        class="input-classes"
        :class="[icon ? 'pl-9' : 'pl-4']"
        :options="getVueNumberFormatOptions"
      />
    </div>
    <p class="text-red-600 h-4" v-if="hasError">
      <slot />
    </p>
  </div>
</template>

<script setup>

  import { vueNumberFormatDefaultOptions } from '@/util/functions/getCurrencyType'
  import getCurrencyType from '@/util/functions/getCurrencyType'
  import Dates from '@/services/Dates'
  const { emit } = getCurrentInstance()
  
  const props = defineProps({
    icon: String,
    type: {
      type: String,
      default: 'tel'
    },
    id_input: String,
    placeholder: String,
    label: String,
    action: String,
    inputOptions: Object,
    value: [String, Number],
    dateReference: [String, Number],
    hasError: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['update:value', 'change'])


  const getVueNumberFormatOptions = computed(() => {
    if(props.inputOptions) return Object.assign({}, vueNumberFormatDefaultOptions, props.inputOptions)
    if(!props.dateReference) return vueNumberFormatDefaultOptions
    try {
      const dateReference = Dates.parse(props.dateReference)
      const currency = getCurrencyType(dateReference)
      if(currency) return currency.vueNumberFormatOptions
    } catch (error) {
      return vueNumberFormatDefaultOptions
    }
    return vueNumberFormatDefaultOptions
  })

  const childValue = computed({
    get() {
      return props.value
    },
    set(val) {
      emit('update:value', val)
      emit('change', val)
    }
  })


</script>

<style lang="scss">

  .input-classes {
    @apply block appearance-none outline-none w-full h-full border border-slate-200 focus:border-slate-300 focus:shadow-sm hover:shadow text-lg py-4 pr-4;
  }

  .icon-classes {
    @apply h-full absolute inset-y-0 left-0 flex items-center text-slate-200 pointer-events-none pl-3;
  }
</style>
