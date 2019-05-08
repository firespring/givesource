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

                                <vm-cropper ref="cropper" :src="src" style="max-height: 500px;"
                                            :cropBoxResizable="false" :cropBoxMovable="false" :dragMode="'move'" :viewMode="1" :aspectRatio="data.width/data.height"
                                            :autoCropArea="1.0" :toggleDragModeOnDblclick="false" :ready="onReady" :zoom="onZoom">
                                </vm-cropper>

                                <br><br>

                                <div style="display: flex; margin: 0 -.25rem; line-height: 1;">
                                    <div style="flex: 1 0 1.5rem; max-width: 1.5rem; margin: 1rem 0 0;">
                                        <i v-on:click.prevent="zoomOut" class="fa fa-search-minus" aria-hidden="true" style="color: #474747; cursor: pointer;"></i>
                                    </div>

                                    <div style="flex: 1; margin: 1rem 0 0;">
                                        <vm-slider v-model="zoom" :min="1" :max="400" :formatter="'{value}%'" :bgStyle="{ backgroundColor: '#474747' }"
                                                   :tooltipStyle="{ backgroundColor: '#dd360b', borderColor: '#dd360b' }" :processStyle="{ backgroundColor: '#474747' }">
                                        </vm-slider>
                                    </div>

                                    <div style="flex: 1 0 1.5rem; max-width: 1.5rem; margin: 1rem 0 0;">
                                        <i v-on:click.prevent="zoomIn" class="fa fa-search-plus" aria-hidden="true" style="color: #474747; cursor: pointer;"></i>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click.prevent="save" type="button" class="c-btn">Save &amp; Continue</button>
                                <button v-on:click.prevent="cancel" type="button" class="c-btn c-btn--neutral c-btn--text">Cancel</button>
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
		data() {
			return {
				src: null,
				zoom: 0,
				image: '',
				ready: false,
			};
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
			zoom(value) {
				const vm = this;
				vm.$refs.cropper.zoomTo(value / 100);
			}
		},
		created() {
			const vm = this;
			const reader = new FileReader();

			reader.onload = (event) => {
				vm.src = event.target.result;
				vm.$refs.cropper.replace(event.target.result);
			};

			reader.readAsDataURL(vm.data.file);
		},
		methods: {
			onReady() {
				const vm = this;

				vm.ready = true;
				vm.removeModal();

				vm.zoom = 100;
				vm.$refs.cropper.zoomTo(1);
			},
			onZoom(event) {
				const vm = this;
				const value = Math.floor(MathHelper.precise(event.detail.ratio * 100));

				if (vm.zoom !== value) {
					vm.zoom = value;
				}
			},
			zoomOut() {
				const vm = this;
				vm.zoom = ((vm.zoom - 10) > 0) ? vm.zoom - 10 : 1;
			},
			zoomIn() {
				const vm = this;
				vm.zoom = ((vm.zoom + 10) <= 400) ? vm.zoom + 10 : 400;
			},
			cancel() {
				const vm = this;
				vm.clearModals();
			},
			save() {
				const vm = this;

				const dataUrl = vm.$refs.cropper.getCroppedCanvas({
					width: vm.data.width,
					height: vm.data.height,
					fillColor: '#fff',
				}).toDataURL(vm.data.file.type);

				vm.bus.$emit(vm.data.listener, vm.data.file, vm.dataURLToBlob(dataUrl, vm.data.file.type));
				vm.removeModal('photo-editor');
			},
			dataURLToBlob(dataUrl, type) {
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