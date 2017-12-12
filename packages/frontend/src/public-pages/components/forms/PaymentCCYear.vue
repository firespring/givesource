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
        <option v-for="year in range" :value="year">{{ year }}</option>
    </select>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : new Date().getFullYear(),
			}
		},
		computed: {
			range: function () {
				const range = [];
				let year = new Date().getFullYear();
				for (let i = 0; i < this.years; i++) {
					range.push(year);
					year += 1;
				}
				return range;
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
			},
			years: {
				type: Number,
				default: 10
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