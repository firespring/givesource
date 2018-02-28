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
            <div class="c-drag-handle ui-sortable-handle"></div>
        </td>

        <td class="image u-text-c">
            <img alt="" :src="logoUrl" v-if="logoUrl">
        </td>

        <td>
            <strong>
                <router-link :to="{ name: 'sponsors-edit', params: {sponsorTierUuid: sponsor.sponsorTierUuid, sponsorUuid: sponsor.uuid} }">{{ sponsor.name }}</router-link>
            </strong>
        </td>

        <td class="icon">
            <a v-on:click="deleteSponsor" href="#" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger" rel="modal-confirm-delete">
                <i class="fa fa-trash" aria-hidden="true"></i>Delete
            </a>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		computed: {
			logoUrl: function () {
				return this.file.hasOwnProperty('path') ? this.$store.getters.setting('UPLOADS_CLOUD_FRONT_URL') + '/' + this.file.path : false;
			}
		},
		props: {
			file: {
				type: Object,
				default: function () {
					return {};
				}
			},
			sponsor: {
				type: Object,
				default: function () {
					return {};
				}
			},
		},
		methods: {
			deleteSponsor: function (event) {
				event.preventDefault();
				const vue = this;

				vue.addModal('spinner');
				let promise = Promise.resolve();
				if (vue.sponsor.hasOwnProperty('fileUuid') && vue.sponsor.fileUuid) {
					promise = vue.$request.delete('files/' + vue.sponsor.fileUuid);
				}

				promise.then(function () {
					return vue.$request.delete('sponsor-tiers/' + vue.sponsor.sponsorTierUuid + '/sponsors/' + vue.sponsor.uuid);
				}).then(function () {
					vue.clearModals();
					vue.$emit('deleteSponsor', vue.sponsor.uuid);
				}).catch(function (err) {
					vue.clearModals();
                    vue.$emit('hasError', err);
				});
			}
		}
	};
</script>