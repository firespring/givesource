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
    <select v-model="localValue" :id="id" :name="name" class="combobox" :data-placeholder="placeholder" ref="select" :class="{'has-error': hasError}">
        <option value=""></option>
        <option v-for="nonprofit in nonprofits" :value="nonprofit.uuid">{{ nonprofit.legalName }}</option>
    </select>
</template>

<script>
	require('chosen-js');

	module.exports = {
		data: function () {
			return {
				localValue: '',
			};
		},
		computed: {
			selectedValue: function () {
				return this.localValue;
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
			placeholder: {
				type: String,
				default: 'Select a nonprofit'
			},
			nonprofits: {
				type: Array,
				default: function () {
					return [];
				}
			},
			hasError: {
				type: Boolean,
				default: false
			}
		},
		mounted: function () {
			const vue = this;

			$(vue.$refs.select).chosen({
				allow_single_deselect: true,
				width: '100%'
			}).change(function () {
				vue.localValue = $(this).val();
			});
		},
		watch: {
			localValue: function (value, oldValue) {
				const vue = this;
				if (value === oldValue) {
					return;
				}
				vue.$emit('input', vue.selectedValue);
			},
			value: function (value, oldValue) {
				const vue = this;
				if (value === oldValue) {
					return;
				}
				vue.localValue = value;
				$(vue.$refs.select).val(value);
				$(vue.$refs.select).trigger("chosen:updated");
			}
		}
	};
</script>