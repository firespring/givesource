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
    <button type="submit" class="btn" :class="buttonClasses" :disabled="processing">
        <slot>Submit</slot>
    </button>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				classes: {
					// Color
                    'btn--accent': this.color.toLowerCase() === 'accent',
					'btn--blue': this.color.toLowerCase() === 'blue',
					'btn--dark': this.color.toLowerCase() === 'dark',
					'btn--green': this.color.toLowerCase() === 'green',
					'btn--lite': this.color.toLowerCase() === 'lite',
					'btn--red': this.color.toLowerCase() === 'red',
					'btn--reverse': this.color.toLowerCase() === 'reverse',

                    // Has Icon
                    'btn--icon': this.hasIcon,

					// Rounded
                    'btn--round': this.rounded,

					// Size
					'btn--xs': this.size.toLowerCase() === 'xs',
					'btn--sm': this.size.toLowerCase() === 'sm',
					'btn--lg': this.size.toLowerCase() === 'lg',
				}
			};
		},
		computed: {
			buttonClasses: function () {
				return _.extend({}, this.classes, {'btn--loading': this.processing});
			},
		},
		props: {
			processing: {
				type: Boolean,
				default: false,
			},
			color: {
				type: String,
				default: 'accent'
			},
			size: {
				type: String,
				default: '',
			},
            rounded: {
				type: Boolean,
                default: true,
            },
            hasIcon: {
				type: Boolean,
                default: true,
            }
		},
	};
</script>