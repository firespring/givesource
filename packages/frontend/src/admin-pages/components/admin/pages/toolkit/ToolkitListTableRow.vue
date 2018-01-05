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
        <td class="icon">
            <div class="c-drag-handle"></div>
        </td>
        <td class="icon">
            <i class="fa" :class="iconClass" aria-hidden="true"></i>
        </td>
        <td class="u-width-100p">
            <strong><a v-on:click="editResource" href="#">{{ title }}</a></strong>
        </td>
        <td class="icon">
            <a v-on:click="deleteResource" href="#" role="button" class="icon icon--bad"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		props: {
			content: {
				type: Object,
				default: {}
			},
		},
		computed: {
			title: function () {
				if (this.content.hasOwnProperty('value')) {
					const title = _.find(this.content.value, {key: 'TOOLKIT_RESOURCE_LIST_ITEM_TITLE'});
					if (title) {
						return title.value;
					}
				}
				return null;
			},
            iconClass: function () {
	            if (this.content.hasOwnProperty('value')) {
		            const type = _.find(this.content.value, {key: 'TOOLKIT_RESOURCE_LIST_ITEM_TYPE'});
		            if (type) {
			            return type.value === 'FILE' ? 'fa-file' : 'fa-link';
		            }
	            }
	            return 'fa-file';
            }
		},
		methods: {
			editResource: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('pages-toolkit-edit-resource-modal', {content: vue.content});
			},
			deleteResource: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('pages-toolkit-delete-resource-modal', {content: vue.content});
			}
		}
	};
</script>