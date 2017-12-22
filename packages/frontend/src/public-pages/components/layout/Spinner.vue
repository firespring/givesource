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
    <div>
        <i class="fa fa-spinner fa-pulse fa-fw" :class="sizeClass"></i>
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script>
	module.exports = {
		computed: {
			sizeClass: function () {
				switch (this.size) {
					case 'small':
						return 'fa-lg';

					case 'medium':
						return 'fa-2x';

					default:
					case 'large':
						return 'fa-4x';
				}
			},
		},
		props: {
			size: {
				type: String,
				default: 'large'
			}
		}
	};
</script>