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