<template>
  <div
    class="c-card"
    style="max-width: 600px; height: auto;"
  >
    <div
      v-if="cardImageSrc"
      class="c-card__media"
      style="max-height: 300px; height: auto; overflow: hidden;"
    >
      <img :src="cardImageSrc">
    </div>
    <div
      v-if="title || url"
      class="c-card__title"
    >
      <div class="c-card-title-text">
        <div
          v-if="cardEventTitle"
          class="c-card-subtitle"
        >
          {{ cardEventTitle }}
        </div>
        <a
          v-if="url && title"
          :href="url"
        >
          <h1>{{ title }}</h1>
        </a>
        <h1 v-else-if="title">
          {{ title }}
        </h1>
      </div>
    </div>
    <div class="c-card__content">
      {{ description }}
    </div>
  </div>
</template>

<script>
import { useAdminStore } from '../../store'

export default {
  props: {
    description: {
      type: String,
      default: ''
    },
    eventTitle: {
      type: String,
      default: ''
    },
    fallbackImage: {
      type: [Object, File],
      default: null
    },
    fallbackImageUrl: {
      type: [Object, File],
      default: null
    },
    image: {
      type: [Object, File],
      default: null
    },
    imageUrl: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fallback_src: null,
      src: null
    }
  },
  computed: {
    cardEventTitle () {
      const eventTitle = this.eventTitle ? this.eventTitle : this.url.replace(/(http|https):\/\//, '')
      return eventTitle.toUpperCase()
    },
    cardImageSrc () {
      return this.src ? this.src : this.fallback_src
    }
  },
  watch: {
    image () {
      const vm = this

      if (_.isPlainObject(vm.image) && vm.image.hasOwnProperty('path')) {
        vm.src = vm.$store.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.image.path
      } else if (vm.image instanceof File) {
        const reader = new FileReader()
        reader.onload = (e) => {
          vm.src = e.target.result
        }
        reader.readAsDataURL(vm.image)
      } else {
        vm.src = null
      }
    },
    imageUrl () {
      const vm = this

      if (!vm.image) {
        vm.src = vm.imageUrl
      }
    },
    fallbackImage () {
      const vm = this

      if (_.isPlainObject(vm.fallbackImage) && vm.fallbackImage.hasOwnProperty('path')) {
        vm.fallback_src = vm.$store.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.fallbackImage.path
      } else if (vm.fallbackImage instanceof File) {
        const reader = new FileReader()
        reader.onload = (e) => {
          vm.fallback_src = e.target.result
        }
        reader.readAsDataURL(vm.fallbackImage)
      } else {
        vm.fallback_src = null
      }
    },
    fallbackImageUrl () {
      const vm = this

      if (!vm.fallbackImage) {
        vm.fallback_src = vm.fallbackImageUrl
      }
    }
  },
  beforeCreate () {
    this.$store = useAdminStore()
  }
}
</script>
