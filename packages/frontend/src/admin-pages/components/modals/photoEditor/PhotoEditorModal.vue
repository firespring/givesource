<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <div id="modal-photo-editor" class="c-modal c-modal--lg" :class="{ 'u-invisible': !ready }" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Resize Image</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">

                                <vue-cropper ref="cropper" :src="src" style="max-height: 500px;"
                                             :cropBoxResizable="false" :cropBoxMovable="false" :dragMode="'move'" :viewMode="1" :aspectRatio="data.width/data.height"
                                             :autoCropArea="1.0" :toggleDragModeOnDblclick="false" :ready="onReady" :zoom="onZoom">
                                </vue-cropper>

                                <br><br>

                                <div style="display: flex; margin: 0 -.25rem; line-height: 1;">
                                    <div style="flex: 1 0 1.5rem; max-width: 1.5rem; margin: 1rem 0 0;">
                                        <i v-on:click="zoomOut" class="fa fa-search-minus" aria-hidden="true" style="color: #474747; cursor: pointer;"></i>
                                    </div>

                                    <div style="flex: 1; margin: 1rem 0 0;">
                                        <vue-slider v-model="zoom" :min="1" :max="400" :formatter="'{value}%'" :bgStyle="{ backgroundColor: '#474747' }"
                                                    :tooltipStyle="{ backgroundColor: '#dd360b', borderColor: '#dd360b' }" :processStyle="{ backgroundColor: '#474747' }">
                                        </vue-slider>
                                    </div>

                                    <div style="flex: 1 0 1.5rem; max-width: 1.5rem; margin: 1rem 0 0;">
                                        <i v-on:click="zoomIn" class="fa fa-search-plus" aria-hidden="true" style="color: #474747; cursor: pointer;"></i>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="save" type="button" class="c-btn">Save &amp; Continue</button>
                                <button v-on:click="cancel" type="button" class="c-btn c-btn--neutral c-btn--text">Cancel</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import VueCropper from "vue-cropperjs";
	import VueSlider from "vue-slider-component";
	const MathHelper = require('./../../../helpers/math');

	export default {
		data: function () {
			return {
				src: null,
				zoom: 0,
				image: '',
				ready: false,
			}
		},
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: {
					file: {},
                    listener: 'photoEditorSave',
					width: 770,
					height: 443
				}
			}
		},
		watch: {
			zoom: function (value) {
				const vue = this;

				vue.$refs.cropper.zoomTo(value / 100);
			}
		},
		created: function () {
			const vue = this;
			const reader = new FileReader();

			reader.onload = function (event) {
				vue.src = event.target.result;
				vue.$refs.cropper.replace(event.target.result);
			};

			reader.readAsDataURL(vue.data.file);
		},
		methods: {
			onReady: function () {
				const vue = this;

				vue.ready = true;
				vue.removeModal();

				vue.zoom = 100;
				vue.$refs.cropper.zoomTo(1);
			},
			onZoom: function (event) {
				const vue = this;
				const value = Math.floor(MathHelper.precise(event.detail.ratio * 100));

				if (vue.zoom !== value) {
					vue.zoom = value;
				}
			},
            zoomOut: function () {
				const vue = this;

				vue.zoom = ((vue.zoom - 10) > 0) ? vue.zoom - 10 : 1;
            },
            zoomIn: function () {
				const vue = this;

				vue.zoom = ((vue.zoom + 10) <= 400) ? vue.zoom + 10 : 400;
            },
			cancel: function () {
				const vue = this;

				vue.clearModals();
			},
			save: function () {
				const vue = this;

				const dataUrl = vue.$refs.cropper.getCroppedCanvas({
					width: vue.data.width,
					height: vue.data.height,
					fillColor: '#fff',
				}).toDataURL(vue.data.file.type);

				vue.bus.$emit(vue.data.listener, vue.data.file, vue.dataURLToBlob(dataUrl, vue.data.file.type));
				vue.removeModal('photo-editor');
			},
			dataURLToBlob: function (dataUrl, type) {
				const binary = atob(dataUrl.split(',')[1]);
				const array = [];
				for (let i = 0; i < binary.length; i++) {
					array.push(binary.charCodeAt(i));
				}
				return new Blob([new Uint8Array(array)], {type: type});
			}
		},
		components: {
			VueCropper,
			VueSlider
		}
	};
</script>