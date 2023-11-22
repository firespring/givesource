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
  <div
    id="modal-photo-editor"
    class="c-modal c-modal--lg"
    :class="{ 'u-invisible': !ready }"
    :style="{ 'z-index': zIndex, display: 'block' }"
  >
    <div class="c-modal__contents">
      <div class="c-modal-dialog">
        <div class="c-modal-dialog__contents">
          <div class="c-modal-header">
            <h1>Resize Image</h1>
          </div>

          <div class="c-modal-content">
            <div class="c-page-section">
              <div class="c-page-section__main">
                <VueCropper
                  ref="cropper"
                  :src="src"
                  style="max-height: 500px;"
                  :crop-box-resizable="false"
                  :crop-box-movable="false"
                  :drag-mode="'move'"
                  :view-mode="1"
                  :aspect-ratio="data.width/data.height"
                  :auto-crop-area="1.0"
                  :toggle-drag-mode-on-dblclick="false"
                  :ready="onReady"
                  :zoom="onZoom"
                />

                <br><br>

                <div style="display: flex; margin: 0 -.25rem; line-height: 1;">
                  <div style="flex: 1 0 1.5rem; max-width: 1.5rem; margin: 1rem 0 0;">
                    <i
                      class="fa fa-search-minus"
                      aria-hidden="true"
                      style="color: #474747; cursor: pointer;"
                      @click="zoomOut"
                    />
                  </div>

                  <div style="flex: 1; margin: 1rem 0 0;">
                    <VueSlider
                      v-model="zoom"
                      :min="1"
                      :max="400"
                      :formatter="'{value}%'"
                      :bg-style="{ backgroundColor: '#474747' }"
                      :tooltip-style="{ backgroundColor: '#dd360b', borderColor: '#dd360b' }"
                      :process-style="{ backgroundColor: '#474747' }"
                    />
                  </div>

                  <div style="flex: 1 0 1.5rem; max-width: 1.5rem; margin: 1rem 0 0;">
                    <i
                      class="fa fa-search-plus"
                      aria-hidden="true"
                      style="color: #474747; cursor: pointer;"
                      @click="zoomIn"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="c-modal-footer">
              <div class="c-modal-footer__actions">
                <button
                  type="button"
                  class="c-btn"
                  @click="save"
                >
                  Save &amp; Continue
                </button>
                <button
                  type="button"
                  class="c-btn c-btn--neutral c-btn--text"
                  @click="cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import VueSlider from 'vue-slider-component'
const MathHelper = require('./../../../helpers/math')

export default {
  components: {
    VueCropper,
    VueSlider
  },
  props: {
    zIndex: {
      type: [Number, String],
      default: 1000
    },
    data: {
      type: Object,
      default: () => ({
        file: {},
        listener: 'photoEditorSave',
        width: 770,
        height: 443
      })
    }
  },
  data: function () {
    return {
      src: null,
      zoom: 1,
      image: '',
      ready: false
    }
  },
  watch: {
    zoom: function (value) {
      const vue = this
      vue.$refs.cropper.zoomTo(value / 100)
    }
  },
  created: function () {
    const vue = this
    const reader = new FileReader()

    reader.onload = function (event) {
      vue.src = event.target.result
      vue.$refs.cropper.replace(event.target.result)
    }

    reader.readAsDataURL(vue.data.file)
  },
  methods: {
    onReady: function () {
      const vue = this

      vue.ready = true
      vue.removeModal()

      vue.zoom = 100
      vue.$refs.cropper.zoomTo(1)
    },
    onZoom: function (event) {
      const vue = this
      const value = Math.floor(MathHelper.precise(event.detail.ratio * 100))

      if (vue.zoom !== value) {
        vue.zoom = value
      }
    },
    zoomOut: function () {
      const vue = this

      vue.zoom = ((vue.zoom - 10) > 0) ? vue.zoom - 10 : 1
    },
    zoomIn: function () {
      const vue = this

      vue.zoom = ((vue.zoom + 10) <= 400) ? vue.zoom + 10 : 400
    },
    cancel: function () {
      const vue = this

      vue.clearModals()
    },
    save: function () {
      const vue = this

      const dataUrl = vue.$refs.cropper.getCroppedCanvas({
        width: vue.data.width,
        height: vue.data.height,
        fillColor: '#fff'
      }).toDataURL(vue.data.file.type)

      vue.emitter.emit(vue.data.listener, {
        file: vue.data.file,
        blob: vue.dataURLToBlob(dataUrl, vue.data.file.type)
      })
      vue.removeModal('photo-editor')
    },
    dataURLToBlob: function (dataUrl, type) {
      const binary = atob(dataUrl.split(',')[1])
      const array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      const blarb = new Blob([new Uint8Array(array)], { type: type })
      return blarb
    }
  }
}
</script>
