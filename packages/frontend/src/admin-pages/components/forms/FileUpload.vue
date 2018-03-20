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
    <div class="c-form-item__control">
        <input v-on:change="onChange" type="file" :name="name" :id="id" class="u-none" ref="input">
        <button v-on:click="onTrigger" type="button" class="c-btn c-btn--good" id="uploadTrigger">
            Select File
        </button>
        <div class="filenames" id="fileNames">{{ filename }}</div>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : {}
			};
		},
		computed: {
			filename: function () {
				if (this.localValue && this.localValue instanceof File) {
					return this.localValue.name;
				} else if (this.localValue && this.localValue.hasOwnProperty('filename')) {
					return this.localValue.filename;
				} else if (this.placeholder) {
					return this.placeholder;
                }
				return '';
			}
		},
		props: {
			id: '',
			name: '',
            placeholder: '',
			value: {},
		},
		watch: {
			value: function (newVal) {
				this.localValue = newVal;
			},
			localValue: function () {
				this.$emit('input', this.localValue);
			}
		},
		methods: {
			onTrigger: function (event) {
				event.preventDefault();
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
		}
	};
</script>