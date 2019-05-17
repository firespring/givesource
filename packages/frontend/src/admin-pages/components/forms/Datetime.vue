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
    <div class="u-control-icon u-control-icon--date">
        <input v-if="isDesktop" type="text" v-model="localValue" :name="name" :id="id" :placeholder="placeholder" ref="datetime" :class="{'has-error': hasError}"
               autocomplete="off">
        <input v-else type="date" v-model="localValue" :name="name" :id="id" :class="{'has-error': hasError}" autocomplete="off">
    </div>
</template>

<script>
	import DatePicker from 'jquery-datetimepicker';

	export default {
		data() {
			return {
				localValue: '',
				defaultOptions: {
					timepicker: false,
					format: 'm/d/Y',
					scrollMonth: false,
					closeOnDateSelect: true,
					yearStart: 1900,
					lang: 'en',
					i18n: {
						en: {
							dayOfWeekShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
						}
					}
				}
			};
		},
		computed: {
			datetimeOptions() {
				return _.defaultsDeep({}, this.defaultOptions, this.options);
			},
			isDesktop() {
				return !/Mobi/.test(navigator.userAgent);
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: 'date',
			},
			name: {
				type: String,
				default: 'date',
			},
			placeholder: {
				type: String,
				default: '',
			},
			options: {
				type: Object,
				default() {
					return {};
				}
			},
			minDate: {
				type: [String, Boolean],
				default: null
			},
			maxDate: {
				type: [String, Boolean],
				default: null
			},
			hasError: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			const vm = this;

			if (vm.isDesktop) {
				const options = _.merge({}, vm.datetimeOptions, {
					onChangeDateTime(value, $el) {
						vm.localValue = $el.val();
					},
					onShow() {
						if (vm.minDate !== null) {
							this.setOptions({
								minDate: vm.minDate || false,
								formatDate: 'm/d/Y'
							});
						}
						if (vm.maxDate !== null) {
							this.setOptions({
								maxDate: vm.maxDate || false,
								formatDate: 'm/d/Y'
							});
						}
					}
				});
				$(vm.$refs.datetime).datetimepicker(options);
			}
		},
		watch: {
			localValue(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.$emit('input', value);
			},
			value(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.localValue = value;
			}
		}
	};
</script>