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
      <select 
        :name="label"
        :id="label"  
        v-model="childValue"
        class="select-input-classes"
        :class="getInputClass"
      >
        <option :value="null" disabled>{{ placeholder }}</option>
        <option v-for="item in getItems" :value="item[keyValue]" :key="item[keyValue]">{{ item[keyLabel] }}</option>
      </select>
    </div>
    <p class="text-red-600 h-4" v-if="hasError">
      <slot />
    </p>
  </div>
</template>

<script setup>

import { ArrayHelpers } from '@igortrindade/lazyfy'

const props = defineProps({
    items: Array,
    value: [String, Boolean, Number],
    label: String,
    placeholder: String,
    icon: String,
    keyLabel: { type: String, default: 'label' },
    keyValue: { type: String, default: 'value' },
    disabled: Boolean,
    hasError: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:value', 'keydown.enter', 'change'])

  const getInputClass = computed(() => {
    let classes = []
    if(props.icon) {
      classes.push('pl-9')
    } else {
      classes.push('pl-4')
    }
    if(props.hasError) {
      classes.push('border-red-600')
    } else {
      classes.push('border-slate-200 focus:border-slate-300')
    }
    return classes
  })

  const childValue = computed({
    get() {
      return props.value
    },
    set(value) {
      if(isString) return emit('update:value', value)
      const finded = ArrayHelpers.find(props.items, { [props.keyValue]: value })
      emit('update:value', value)
      emit('change', finded)
    }
  })

  const isString = computed(() => {
    return  props.items.length > 0 && typeof props.items[0] === 'string'
  })

  const getItems = computed(() => {
    if (props.items.length > 0 && typeof props.items[0] === 'string') {
      return props.items.map((item) => { 
        return {
          [props.keyLabel]: item,
          [props.keyValue]: item,
        }
      })
    } else {
      return props.items
    }
  })

</script>

<style lang="scss">

  .select-input-classes {
    @apply block appearance-none outline-none w-full h-full border border-slate-200 focus:border-slate-300 focus:shadow-sm hover:shadow text-lg py-3 pr-4;
  }

  .select-icon-classes {
    @apply h-full absolute inset-y-0 left-0 flex items-center text-slate-200 pointer-events-none pl-3;
  }

</style>
