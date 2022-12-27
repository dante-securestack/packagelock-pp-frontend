<template>
  <div class="w-full block">

    <label class="block mb-1" v-if="label">
      <span class="border-b-4 border-zinc-200 ">{{ label }}</span>
    </label>

    <label
      class="w-full mt-1 p-3 lg: p-4 border-4 box-border border-dashed border-orange-200 hover:border-orange-400 rounded block flex items-center justify-center relative text-lg space-x-2"
      :class="[
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        modelValue?.name ? 'bg-orange-400' : 'bg-white',
      ]"
    >
      <AppIcons icon="file_upload" class="mr-2 flex-shrink-0 block" />
      <span class="ellipsis block" :class="modelValue && modelValue.name ? 'font-bold' : ''">{{ modelValue.name ? modelValue.name : placeholder }}</span>
      <input
        tabindex="0"
        type="file"
        class="hidden-input-file"
        :accept="accept"
        :disabled="disabled"
        @change="addFile($event)"
        name="file"
        :data-title="placeholder"
      />
    </label>
    <p class="text-red-600 h-4" v-if="hasError">
      <slot />
    </p>
    
  </div>
</template>

<script>
export default {
  name: 'Inputfile',
  props: {
    modelValue: {
      type: [Object, String],
      default() {
        return {
          name: '',
          type: ''
        }
      }
    },
    accept: {
      type: String,
      default: 'image/jpeg, image/png'
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
      default: 'Clique para selecionar ou arraste o arquivo aqui'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'change'],

  data() {
    return {
      fileName: ''
    }
  },
  methods: {
    addFile(event) {
   
      if (event.target.files && event.target.files[0]) {
        // console.log(event.target.files[0])
        this.$emit('update:modelValue', event.target.files[0]) 
        this.$emit('change', event)
      }
    }
  }
}
</script>

<style>

.hidden-input-file {
  opacity: 0 !important;
  /* z-index: -1; */
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
}
</style>