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
    <button type="submit" class="btn btn--round btn--icon" :class="classes" :disabled="processing">
        <i class="fa fa-spinner fa-pulse fa-fw" v-if="processing"></i>
        <slot>Submit</slot>
    </button>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				classes: {
					// Color
					'btn--green': this.color.toLowerCase() === 'green',
					'btn--blue': this.color.toLowerCase() === 'blue',
					'btn--red': this.color.toLowerCase() === 'red',
					'btn--dark': this.color.toLowerCase() === 'dark',
					'btn--lite': this.color.toLowerCase() === 'lite',
					'btn--reverse': this.color.toLowerCase() === 'reverse',

					// Size
					'btn--xs': this.size.toLowerCase() === 'xs',
					'btn--sm': this.size.toLowerCase() === 'sm',
					'btn--lg': this.size.toLowerCase() === 'lg'
				}
			};
		},
		props: {
			processing: {
				type: Boolean,
				default: false,
			},
			color: {
				type: String,
				default: 'green'
			},
			size: {
				type: String,
				default: '',
			}
		},
	};
</script>