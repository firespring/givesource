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
export default {
  props: {
    description: {
      type: String,
      default: ''
    },
    event_title: {
      type: String,
      default: ''
    },
    fallback_image: {
      type: [Object, File],
      default: null
    },
    fallback_image_url: {
      type: [Object, File],
      default: ''
    },
    image: {
      type: [Object, File],
      default: null
    },
    image_url: {
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
      const eventTitle = this.event_title ? this.event_title : this.url.replace(/(http|https):\/\//, '')
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
        vm.src = vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.image.path
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
    image_url () {
      const vm = this

      if (!vm.image) {
        vm.src = vm.image_url
      }
    },
    fallback_image () {
      const vm = this

      if (_.isPlainObject(vm.fallback_image) && vm.fallback_image.hasOwnProperty('path')) {
        vm.fallback_src = vm.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vm.fallback_image.path
      } else if (vm.fallback_image instanceof File) {
        const reader = new FileReader()
        reader.onload = (e) => {
          vm.fallback_src = e.target.result
        }
        reader.readAsDataURL(vm.fallback_image)
      } else {
        vm.fallback_src = null
      }
    },
    fallback_image_url () {
      const vm = this

      if (!vm.fallback_image) {
        vm.fallback_src = vm.fallback_image_url
      }
    }
  }
}
</script>
