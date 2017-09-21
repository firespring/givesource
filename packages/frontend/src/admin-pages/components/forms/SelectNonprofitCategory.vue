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
        <option :disabled="!allowEmpty" value="">No category selected</option>
        <option disabled value="">-----</option>
        <option v-for="option in formOptions" :value="option.value" v-html="option.text" :disabled="option.disabled"></option>
    </select>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				localValue: this.value || '',
			}
		},
		computed: {
			formOptions: function () {
				const vue = this;
				return Object.keys(vue.options).map(function (value) {
					let option = vue.options[value] || {};
					if (typeof option !== 'object') {
						option = {text: option};
					}
					option.value = option.value || value;
					option.text = option.text || value;
					return option;
				});
			},
			selectedValue: function () {
				const vue = this;
				return vue.localValue;
			},
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
			allowEmpty: {
				type: Boolean,
				default: false,
			},
			options: {
				type: [Object, Array],
				default: function () {
					return [
						{value: '1', text: 'Animal-Related'},
						{value: '2', text: 'Arts, Culture & Humanities'},
						{value: '3', text: 'Children & Families'},
						{value: '4', text: 'Community Improvement & Capacity Building'},
						{value: '5', text: 'Crime & Legal-Related'},
						{value: '6', text: 'Diseases, Disorders & Medical Disciplines'},
						{value: '7', text: 'Education-Early Childhood'},
						{value: '8', text: 'Education-Higher Education'},
						{value: '9', text: 'Education-K-12'},
						{value: '10', text: 'Environment'},
						{value: '11', text: 'Food, Agriculture & Nutrition'},
						{value: '12', text: 'Health Care'},
						{value: '13', text: 'Housing & Shelter'},
						{value: '14', text: 'Human Services'},
						{value: '15', text: 'International, Foreign Affairs & National Security'},
						{value: '16', text: 'Library & Literacy Programs'},
						{value: '17', text: 'Medical Research'},
						{value: '18', text: 'Mental Health & Crisis Intervention'},
						{value: '19', text: 'Mutual & Membership Benefit'},
						{value: '20', text: 'Older Adults'},
						{value: '21', text: 'Philanthropy, Voluntarism & Grantmaking Foundations'},
						{value: '22', text: 'Politics & Public Administration'},
						{value: '23', text: 'Public & Societal Benefit'},
						{value: '24', text: 'Public Safety, Disaster Preparedness & Relief'},
						{value: '25', text: 'Recreation & Sports'},
						{value: '26', text: 'Religion-Related'},
						{value: '27', text: 'Science & Technology'},
						{value: '28', text: 'Veterans Support'},
						{value: '29', text: 'Women'},
						{value: '30', text: 'Youth Development'}
					]
				}
			},
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
			}
		}
	};
</script>