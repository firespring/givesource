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
    <input v-if="displayTextInput" type="text" v-model="localValue" :name="name" :id="id" :placeholder="placeholder" autocomplete="off" ref="input">
    <input v-else type="password" v-model="displayValue" :name="name" :id="id" :placeholder="placeholder" autocomplete="off" ref="input">
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : '',
                displayValue: 'xxxxxxxxxx',
				displayTextInput: true
			};
		},
		props: {
			id: '',
			name: '',
			placeholder: '',
			secureKey: '',
			value: {},
		},
        created: function () {
			const vue = this;

			if (vue.secureKey) {
                vue.$request.get('settings/secure/' + vue.secureKey).then(function (response) {
                	if (response.data.errorMessage) {
                		return Promise.resolve();
                    }
                    return Promise.resolve(response.data);
                }).then(function (response) {
                	if (response) {
		                vue.localValue = response.value;
		                vue.displayTextInput = false;
                    }

	                vue.$emit('loaded');
                });

                vue.$parent.$on('save', this.save);
            } else {
				vue.$emit('loaded');
            }
        },
		watch: {
			value: function (newVal) {
				if (this.localValue !== newVal) {
					this.localValue = newVal;
					this.displayTextInput = false;
				}
			},
			localValue: function () {
				this.$emit('input', this.localValue);
			},
            displayValue: function (newVal) {
				if (newVal.length === 0) {
					this.localValue = '';
					this.displayTextInput = true;
                }
            },
            displayTextInput: function (newVal, oldVal) {
				if (newVal !== oldVal && newVal === true) {
					this.$nextTick(function () {
						$(this.$refs.input).focus();
                    });
                }
            }
		},
        methods: {
			save: function () {
				const vue = this;

				if (vue.localValue !== vue.value && vue.secureKey) {
					vue.$request.patch('settings/secure/' + vue.secureKey, {
						value: this.localValue
                    }).catch(function (err) {
                    	console.log(err);
                    });
                }
            }
        }
	};
</script>