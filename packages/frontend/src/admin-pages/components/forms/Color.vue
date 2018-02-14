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
    <input v-if="isDesktop" v-model="localValue" type="text" :name="name" :id="id" ref="input">
    <input v-else v-model="localValue" type="color" :name="name" :id="id">
</template>

<script>
	require('@claviska/jquery-minicolors');

	module.exports = {
		data: function () {
			return {
				localValue: ''
			};
		},
		computed: {
			isDesktop: function () {
				return !/Mobi/.test(navigator.userAgent);
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: null,
			},
			name: {
				type: String,
				default: null
			},
			defaultColor: {
				type: String,
				default: null
			}
		},
		mounted: function () {
			const vue = this;

			if (vue.isDesktop) {
				const options = {
					change: function (value) {
						vue.localValue = value;
					},
				};
				if(vue.defaultColor) {
					options.defaultValue = vue.defaultColor;
                }
				$(vue.$refs.input).minicolors(options);
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
				$(vue.$refs.input).minicolors('value', vue.value);
			}
		}
	};
</script>