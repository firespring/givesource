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
    <div class="c-form-item__control">
        <input v-on:change="onChange" type="file" accept="image/*" :name="name" :id="id" class="u-none" ref="input">
        <button v-if="!hasFile" v-on:click.prevent="onTrigger" type="button" class="c-btn c-btn--good">
            Select Image
        </button>

        <div v-if="hasFile" class="c-form-item-grid c-selected-file c-selected-file--image">
            <div v-if="fileUrl" class="c-selected-file__thumbnail c-form-item c-form-item--compact">
                <img :alt="filename" :src="fileUrl">
                <a :href="fileUrl" target="_blank" rel="noopener noreferrer"></a>
            </div>
            <div class="c-selected-file__info c-form-item c-form-item--compact c-form-item--v-center">
                <div>
                    <div class="c-selected-file-info">
                        <a :href="fileUrl" target="_blank" rel="noopener noreferrer">{{ filename }}</a>
                    </div>

                    <div class="c-selected-file-actions">
                        <a v-on:click.prevent="onTrigger" href="#" class="c-btn c-btn--xs c-btn--flat c-btn--good js-modal-trigger" role="button">Select a New Image</a>
                        <a v-on:click.prevent="removeFile" href="#" class="c-btn c-btn--xs c-btn--flat c-btn--neutral" role="button">Remove This Image</a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data: function () {
			return {
				localValue: this.value ? this.value : null,
				fileUrl: false
			};
		},
		computed: {
			filename: function () {
				const vue = this;
				if (vue.localValue && vue.localValue instanceof File) {
					return vue.localValue.name;
				} else if (vue.localValue && vue.localValue.hasOwnProperty('filename')) {
					return vue.localValue.filename;
				}
				return '';
			},
			hasFile: function () {
				const vue = this;
				return (vue.localValue instanceof File || (_.isPlainObject(vue.localValue) && vue.localValue.hasOwnProperty('filename')));
			}
		},
		props: {
			id: '',
			name: '',
			value: {},
		},
		watch: {
			value: function (newVal) {
				this.localValue = newVal;
			},
			localValue: function () {
				const vue = this;

				if (_.isPlainObject(vue.localValue) && vue.localValue.hasOwnProperty('path')) {
					vue.fileUrl = vue.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + vue.localValue.path
				} else if (vue.localValue instanceof File) {
					const reader = new FileReader();
					reader.onload = function (e) {
						vue.fileUrl = e.target.result;
					};
					reader.readAsDataURL(vue.localValue);
				}

				vue.$emit('input', this.localValue);
			}
		},
		methods: {
			onTrigger: function () {
				const vue = this;
				vue.$refs.input.click();
			},
			onChange: function (event) {
				const vue = this;
				const files = event.target.files || event.dataTransfer.files;
				if (files.length) {
					vue.localValue = files[0];
				}
			},
			removeFile: function () {
				const vue = this;
				$(vue.$refs.input).val('');
				vue.localValue = null;
			}
		}
	};
</script>