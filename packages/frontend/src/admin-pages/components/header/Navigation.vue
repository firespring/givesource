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
    <component :is="navigationComponent" :nonprofitUuid="nonprofitUuid"></component>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				navigationComponent: 'navigation-nonprofit'
			}
		},
		beforeMount: function () {
			const vue = this;

			if (vue.isSuperAdminUser() || vue.isAdminUser()) {
				vue.navigationComponent = 'navigation-admin';
			}

			document.body.classList.add('has-menubar', 'has-menubar--secondary');
		},
        props: [
        	'nonprofitUuid'
        ],
		components: {
			'navigation-nonprofit': require('./NavigationNonprofits.vue'),
			'navigation-admin': require('./NavigationAdmin.vue'),
		}
	};
</script>