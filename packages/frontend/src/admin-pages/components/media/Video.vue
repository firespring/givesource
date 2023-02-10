<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <iframe
    v-if="loaded"
    :src="src"
    :width="width"
    :height="height"
    style="max-width: 100%; border-radius: 3px;"
    frameborder="0"
    webkitallowfullscreen
    mozallowfullscreen
    allowfullscreen
  />
</template>

<script>
const MediaHelper = require('./../../helpers/media')

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 770
    },
    height: {
      type: Number,
      default: 443
    }
  },
  data: function () {
    return {
      src: '',
      loaded: false
    }
  },
  watch: {
    url: function () {
      const vue = this

      vue.loaded = false
      vue.loadIframe()
    }
  },
  mounted: function () {
    const vue = this
    vue.loadIframe()
  },
  methods: {
    loadIframe: function () {
      const vue = this

      if (vue.url) {
        MediaHelper.getVideoData(vue.url).then(function (response) {
          vue.src = response.embedUrl
        }).then(function () {
          vue.loaded = true
        })
      }
    }
  }
}
</script>
