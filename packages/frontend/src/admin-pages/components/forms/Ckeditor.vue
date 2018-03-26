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
    <vue-ckeditor v-if="loaded" v-model="localValue" :toolbar="toolbar" :id="id" :language="language" :extraplugins="plugins" :class="{ 'has-error': hasErrors }" :height="height">
    </vue-ckeditor>
    <layout-spinner v-else :height="height + 'px'"></layout-spinner>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: '',
				language: 'en-us',
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: ''
			},
			loaded: {
				type: Boolean,
				default: false
			},
			hasErrors: {
				type: Boolean,
				default: false
			},
			height: {
				type: String,
				default: '200'
			},
			basic: {
				type: Boolean,
				default: false,
			}
		},
		computed: {
			toolbar: function () {
				let options = [
					{name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
					{name: 'links', items: ['Link', 'Unlink']},
				];
				if (!this.basic) {
					options = [
						{name: 'styles', items: ['Format']},
						{name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
						{name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Blockquote']},
						{name: 'colors', items: ['TextColor', 'BGColor']},
						{name: 'links', items: ['Link', 'Unlink']},
						{name: 'tools', items: ['Maximize']},
					];
				}
				return options;
			},
			plugins: function () {
				return this.basic ? '' : 'colorbutton,colordialog';
			}
		},
		watch: {
			localValue: function (value, oldValue) {
				const vue = this;
				if (value === oldValue) {
					return;
				}
				vue.$emit('input', value);
			},
			value: function (value, oldValue) {
				const vue = this;
				if (value === oldValue) {
					return;
				}
				vue.localValue = value;
			}
		},
		components: {
			'layout-spinner': require('./../layout/Spinner.vue')
		}
	};
</script>