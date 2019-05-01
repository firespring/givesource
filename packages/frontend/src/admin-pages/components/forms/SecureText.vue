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
    <div class="c-form-control-grid u-items-center" v-if="displayTextInput">
        <div class="c-form-control-grid__item u-flex-collapse">
            <input type="text" v-model="localValue" :name="name" :id="id" :placeholder="placeholder" autocomplete="off" ref="input">
        </div>
        <div class="c-form-control-grid__item u-flex-collapse" v-if="original">
            <a v-on:click.prevent="cancel" href="#" class="c-btn c-btn--xs c-btn--flat c-btn--warning">Cancel</a>
        </div>
    </div>

    <div class="c-form-control-grid u-items-center" v-else>
        <div class="c-form-control-grid__item u-flex-collapse">
            ***********
        </div>
        <div class="c-form-control-grid__item u-flex-collapse">
            <a v-on:click.prevent="edit" href="#" class="c-btn c-btn--xs c-btn--flat c-btn--warning">Edit</a>
        </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				localValue: this.value ? this.value : '',
				displayTextInput: true,
				original: null,
			};
		},
		props: {
			id: '',
			name: '',
			placeholder: '',
			secureKey: '',
			value: {},
		},
		created() {
			const vm = this;

			if (vm.secureKey) {
				vm.$request.get('settings/secure/' + vm.secureKey).then(response => {
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
						return Promise.resolve();
					}
					return Promise.resolve(response.data);
				}).then(response => {
					if (response) {
						vm.original = response.value;
						vm.localValue = response.value;
						vm.displayTextInput = false;
					}

					vm.$emit('loaded');
				});

				vm.$parent.$on('save', this.save);
			} else {
				vm.$emit('loaded');
			}
		},
		watch: {
			value(newVal) {
				const vm = this;
				if (vm.localValue !== newVal) {
					vm.localValue = newVal;
					vm.displayTextInput = false;
				}
			},
			localValue() {
				const vm = this;
				vm.$emit('input', vm.localValue);
			}
		},
		methods: {
			save() {
				const vm = this;

				if (vm.localValue !== vm.original && vm.secureKey) {
					vm.$request.patch('settings/secure/' + vm.secureKey, {
						value: this.localValue
					}).catch(err => {
						console.log(err);
					});
				}
			},
			edit() {
				const vm = this;

				vm.localValue = '';
				vm.displayTextInput = true;
				vm.$nextTick(() => {
					$(vm.$refs.input).focus();
				});
			},
			cancel() {
				const vm = this;

				vm.displayTextInput = false;
				vm.localValue = vm.original;
			}
		}
	};
</script>