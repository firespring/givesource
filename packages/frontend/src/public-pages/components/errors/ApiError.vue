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
    <div v-if="hasError" class="alert alert--bad" ref="alert">
        <div class="alert__message">
            <h3 class="alert__title">There was an error processing your request.</h3>
            <ul>
                <li v-if="localValue.type">Type: {{localValue.type}}</li>
                <li v-if="localValue.message">Message: {{localValue.message}}</li>
                <li v-if="localValue.request_id">ID: {{localValue.request_id}}</li>
            </ul>
        </div>
        <a href="#" v-on:click.prevent="close" class="alert__close" role="button">
            <svg class="svg-inline--fa fa-times-circle fa-w-16" aria-hidden="true" data-fa-processed="" data-prefix="fas" data-icon="times-circle" role="img"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
            </svg><!-- <i class="fas fa-times-circle"></i> --></a></div>
</template>

<script>
	export default {
		data() {
			return {
				localValue: {}
			};
		},
		props: {
			value: {}
		},
		computed: {
			hasError() {
				return this.localValue && Object.keys(this.localValue).length;
			}
		},
		watch: {
			localValue(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.$emit('input', vm.localValue);
			},
			value(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				//paymentSpring returns an array of errors but not multiple errors
				if (_.isArray(value)) {
					value = value[0];
				}
				vm.localValue = value;
			},
			hasError(value) {
				const vm = this;
				if (value) {
					vm.$nextTick(() => {
						vm.$refs.alert.scrollIntoView(true);
					});
				}
			}
		},
		methods: {
			close() {
				const vm = this;
				vm.localValue = {};
			}
		},
	}

</script>