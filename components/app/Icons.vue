<template>
  <div style="display:contents">
    <span
      v-if="getIconType === 'material-icons'"
      :class="[getIconClasses, `material-symbols-${iconStyle}`]"
      :style="{ fontSize: `${size}px`}"
    >
      {{ getIcon }}
    </span>
    <img v-else-if="getIconType === 'url'" :src="getIcon" :class="[iconClasses]" />
    <inline-svg
      v-else
      :src="icon"
      :width="size"
      :height="size"
      :stroke="getColor"
      :fill="getColor"
    ></inline-svg>
  </div>
</template>

<script>
import imageLoader from '@/util/functions/imageLoader'
import InlineSvg from 'vue-inline-svg'
export default {
  name: 'AppIcon',
  components: { InlineSvg },
  props: {
    /**
     * It sets the text key to get the svg icon in Google Fonts. Make sure to get the correct description of your icon on https://fonts.google.com/.
     */
    icon: {
      type: String,
      default: 'more_horiz'
    },

    /**
     * It sets the type of the icon.
     */
    type: {
      type: String,
    },

    /**
     * It sets the style of the icon.
     */
    iconClasses: {
      type: String,
      default: null
    },

    /**
     * It sets the size of the icon.
     */
    size: {
      type: [Number, String],
      default: 24
    },

    /**
     * It sets fill property of the icon.
     */
    stroke: {
      type: String,
      default: null
    },

    /**
     * It sets the color of the icon.
     */
    color: {
      type: String,
      default: null
    },

    /**
     * It set a animation icon if needed.
     */
    loaderIcon: {
      type: String,
      default: 'hourglass_top'
    },
    
    /**
     * It sets a error when the icon is not available.
     */
    errorIcon: {
      type: String,
      default: 'report'
    },

    iconStyle: {
      type: String,
      default: 'sharp'
    }
  },
  data() {
    return {
      finishedImageLoad: false,
      imageLoadError: false
    }
  },
  computed: {
    getIconType() {
      if(this.imageLoadError || !this.finishedImageLoad && !this.getIcon?.includes('/')) return 'material-icons'
      if(this.type) return this.type
      if(!this.getIcon?.includes('/')) return 'material-icons'
      if(!this.getIcon?.includes('.svg')) return 'url'
      return 'svg'
    },
    getIcon() {
      if(!this.icon?.includes('/')) return this.icon ? this.icon : this.errorIcon
      if(!this.finishedImageLoad && !this.imageLoadError && this.loaderIcon) return this.loaderIcon
      if(this.imageLoadError) return this.errorIcon
      return this.icon ? this.icon : this.errorIcon
    },
    getIconClasses() {
      if(this.iconClasses) return this.iconClasses
      return `${this.color}`
    },
    getHeight() {
      return this.height
    },
    getColor() {
      return this.color
    }
  },
  watch: {
    'icon': function() {
      this.loadImage()
    }
  },
  mounted() {
    if(this.icon?.includes('/')) this.loadImage()
  },
  methods: {
    loadImage() {
      imageLoader({ imageUrl: this.icon, returnsBase64: false })
        .then(() => {
          this.finishedImageLoad = true
        })
        .catch((err) => {
          this.imageLoadError = true
        })
    }
  }
}
</script>