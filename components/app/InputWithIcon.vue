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

      <input
        v-if="!mask"
        :type="type"
        :id="id_input"
        :placeholder="placeholder || label"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
        @keydown.enter="$emit('keydown.enter', $event.target.value)"
        class="input-classes"
        :class="getInputClass"
        :disabled="disabled"
      />
      <input
        v-else
        :type="type"
        :id="id_input"
        :placeholder="placeholder"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
        @keydown.enter="$emit('keydown.enter', $event.target.value)"
        v-mask="mask"
        class="input-classes"
        :class="getInputClass"
        :disabled="disabled"
      />
    </div>

    <p class="text-red-600 h-4" v-if="hasError">
      <slot />
    </p>
  </div>
</template>

<script setup>
  
  const props = defineProps({
    icon: String,
    type: String,
    id_input: String,
    placeholder: String,
    label: String,
    action: String,
    mask: [Array, String],
    value: [String, Number],
    hasError: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['update:value', 'keydown.enter'])

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
  
</script>

<style lang="scss">

  .input-classes {
    @apply block appearance-none outline-none w-full h-full border focus:shadow-sm hover:shadow text-lg py-4 pr-4;
  }

  .icon-classes {
    @apply h-full absolute inset-y-0 left-0 flex items-center text-slate-200 pointer-events-none pl-3;
  }
</style>
