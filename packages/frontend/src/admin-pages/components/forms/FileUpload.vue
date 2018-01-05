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
    <div class="c-form-item__control">
        <input v-on:change="onChange" type="file" :name="name" :id="id" class="u-none" ref="input">
        <button v-on:click="onTrigger" type="button" class="c-btn c-btn--good" id="uploadTrigger">
            Select File
        </button>
        <div class="filenames" id="fileNames">{{ filename }}</div>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : {}
			};
		},
		computed: {
			filename: function () {
				if (this.localValue && this.localValue instanceof File) {
					return this.localValue.name;
				} else if (this.localValue && this.localValue.hasOwnProperty('filename')) {
					return this.localValue.filename;
				}
				return '';
			}
		},
		props: {
			id: '',
			name: '',
			value: {},
		},
		watch: {
			value: function (newVal) {
				this.localValue = newVal;
			},
			localValue: function () {
				this.$emit('input', this.localValue);
			}
		},
		methods: {
			onTrigger: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$refs.input.click();
			},
			onChange: function (event) {
				const vue = this;

				const files = event.target.files || event.dataTransfer.files;
				if (files.length) {
					vue.localValue = files[0];
				}
			},
		}
	};
</script>