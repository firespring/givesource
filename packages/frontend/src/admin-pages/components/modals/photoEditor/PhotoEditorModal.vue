<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <div id="modal-photo-editor" class="c-modal c-modal--lg" :class="{ 'u-invisible': !ready }" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Resize Photo</h1>
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

	module.exports = {
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