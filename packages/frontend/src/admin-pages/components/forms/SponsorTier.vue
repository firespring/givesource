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
    <select v-model="localValue" :name="name" :id="id" ref="input">
        <option disabled value="" v-if="placeholder">{{ placeholder }}</option>
        <option disabled value="" v-if="placeholder">-----</option>
        <option v-for="sponsorTier in sponsorTiers" :value="sponsorTier.uuid">
            {{ sponsorTier.name }}
        </option>
    </select>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : ''
			};
		},
		props: {
			id: '',
			name: '',
			placeholder: '',
			sponsorTiers: {
				type: Array,
				default: function () {
					return [];
				}
			},
			value: {},
		},
		watch: {
			value: function (newVal) {
				this.localValue = newVal;
			},
			localValue: function () {
				this.$emit('input', this.localValue);
			}
		}
	};
</script>