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
    <tr>
        <td v-if="loaded" :colspan="colspan" class="u-text-c">
            <p>{{ message }}</p>
            <p v-if="displayButton">
                <router-link :to="buttonLink" class="c-btn c-btn--sm">{{ buttonText }}</router-link>
            </p>
        </td>
        <td v-else :colspan="colspan" class="u-text-c">
            <layout-spinner></layout-spinner>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		computed: {
			displayButton: function () {
				return this.buttonText && this.buttonLink;
			}
		},
		props: {
			colspan: {
				type: [String, Number],
				default: null
			},
			loaded: {
				type: Boolean,
				default: false
			},
			message: {
				type: String,
				default: 'This table is empty.'
			},
			buttonText: {
				type: String,
				default: null
			},
			buttonLink: {
				type: Object,
				default: null
			}
		},
		components: {
			'layout-spinner': require('./Spinner.vue')
		}
	};
</script>