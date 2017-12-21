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
                        {value: '4', text: 'Civil Rights, Social Action & Advocacy'},
						{value: '5', text: 'Community Improvement & Capacity Building'},
						{value: '6', text: 'Crime & Legal-Related'},
						{value: '7', text: 'Diseases, Disorders & Medical Disciplines'},
						{value: '8', text: 'Education-Early Childhood'},
						{value: '9', text: 'Education-Higher Education'},
						{value: '10', text: 'Education-K-12'},
						{value: '11', text: 'Environment'},
						{value: '12', text: 'Food, Agriculture & Nutrition'},
						{value: '13', text: 'Health Care'},
						{value: '14', text: 'Housing & Shelter'},
						{value: '15', text: 'Human Services'},
						{value: '16', text: 'International, Foreign Affairs & National Security'},
						{value: '17', text: 'Library & Literacy Programs'},
						{value: '18', text: 'Medical Research'},
						{value: '19', text: 'Mental Health & Crisis Intervention'},
						{value: '20', text: 'Mutual & Membership Benefit'},
						{value: '21', text: 'Older Adults'},
						{value: '22', text: 'Philanthropy, Voluntarism & Grantmaking Foundations'},
						{value: '23', text: 'Politics & Public Administration'},
						{value: '24', text: 'Public & Societal Benefit'},
						{value: '25', text: 'Public Safety, Disaster Preparedness & Relief'},
						{value: '26', text: 'Recreation & Sports'},
						{value: '27', text: 'Religion-Related'},
						{value: '28', text: 'Science & Technology'},
						{value: '29', text: 'Veterans Support'},
						{value: '30', text: 'Women'},
						{value: '31', text: 'Youth Development'}
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