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
        <option v-for="month in options" :value="month">{{ month }}</option>
    </select>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : '01',
                options: [
                	'01',
                    '02',
                    '03',
	                '04',
	                '05',
	                '06',
	                '07',
	                '08',
	                '09',
	                '10',
	                '11',
	                '12',
                ]
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: null
			},
			name: {
				type: String,
				default: null
			}
		},
		mounted: function () {
			this.$emit('input', this.localValue);
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