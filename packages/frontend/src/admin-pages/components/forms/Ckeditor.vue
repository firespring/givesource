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
    <forms-ckeditor-textarea v-if="loaded" v-model="localValue" :id="id" :class="{ 'has-error': hasErrors }" :height="height" :type="type" :allowImages="allowImages">
    </forms-ckeditor-textarea>
    <layout-spinner v-else :height="height"></layout-spinner>
</template>

<script>
	import ComponentSpinner from './../layout/Spinner.vue';
	import ComponentCkeditorTextarea from './CkeditorTextarea.vue';

	export default {
		data: function () {
			return {
				localValue: '',
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: ''
			},
            allowImages: {
				type: Boolean,
                default: false,
            },
			hasErrors: {
				type: Boolean,
				default: false
			},
			height: {
				type: String,
				default: '200'
			},
			loaded: {
				type: Boolean,
				default: true
			},
			type: {
				type: String,
				default: 'Basic',
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
			'forms-ckeditor-textarea': ComponentCkeditorTextarea,
			'layout-spinner': ComponentSpinner,
		}
	};
</script>