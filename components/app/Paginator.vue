<template>
  
  <div class="w-full flex justify-center items-center space-x-4 mt-2">
    <AppButton @click="prev()" :disabled="skip < 1" class="flex items-center leading-none disabled:text-zinc-300" >
      <AppIcons icon="chevron_left" class="mt-1" />
      <span>Anterior</span>
    </AppButton>
    <AppButton @click="next()" :disabled="take > length" class="flex items-center leading-none disabled:text-zinc-300" >
      <span>Próximo</span>
      <AppIcons icon="chevron_right" class="mt-1" />
    </AppButton>
  </div>
</template>

<script setup>

  import { getCurrentInstance } from 'vue'

  const { emit } = getCurrentInstance()

  defineEmits(['update:skip', 'change'])
  
  const props = defineProps({
    skip: Number,
    take: Number,
    length: Number,
  })

  const next = () => {
    const newOffset = props.skip + (props.take)
    emit('update:skip', newOffset)
    emit('change')
  }

  const prev = () => {
    if(props.skip <= 0) return false
    const newOffset = props.skip - props.take
    emit('update:skip', newOffset)
    emit('change')
  }


</script>