<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
    <div v-if="modals.length">
        <component v-for="(modal, index) in modals" :is="modal" :key="index" :zIndex="calculateModalZIndex(index)" :data="data[modal]"></component>
    </div>
</template>

<script>
	import ComponentDonationCartModal from './donations/DonationCartModal.vue';
  import ComponentDonationTiersModal from './donations/DonationTiersModal.vue';
  import ComponentMenuModal from './MenuModal.vue';
  import ComponentSpinnerModal from './SpinnerModal.vue';

	export default {
		data: function () {
			return {
				modals: [],
				data: {}
			};
		},
		created: function () {
			const vue = this;

			/**
			 * Add a modal to the top of the stack
			 *
			 * @param {String} modal
			 */
			vue.bus.$on('addModal', function (modal, data) {
				vue.modals.push(modal);
				vue.data[modal] = data || null;
			});

			/**
			 * Remove the top-most modal from the stack
			 */
			vue.bus.$on('removeModal', function (modal) {
				if (vue.modals.indexOf(modal) > -1) {
					vue.modals.splice(vue.modals.indexOf(modal), 1);
				} else if (vue.modals.length) {
					vue.modals = vue.modals.slice(0, -1);
				}
			});

			/**
			 * Replace the top-most modal
			 */
			vue.bus.$on('replaceModal', function (modal, data) {
				if (vue.modals.length > 0) {
					vue.modals[vue.modals.length - 1] = modal;
					vue.data[modal] = data || null;
				} else {
					vue.modals.push(modal);
					vue.data[modal] = data || null;
				}
			});

			/**
			 * Clear all modals from the stack
			 */
			vue.bus.$on('clearModals', function () {
				vue.modals = [];
				vue.data = {};
			});
		},
		mounted: function () {
			const vue = this;

			$(document).keyup(function (event) {
				if (vue.modals.length && event.keyCode === 27) {
					vue.clearModals();
					vue.removeBodyClasses('has-overlay', 'has-overlay--mobile-nav', 'has-donation-overlay');
				}
			});
		},
		methods: {
			calculateOverlayZIndex: function (index) {
				return 999 + (index * 1000);
			},
			calculateModalZIndex: function (index) {
				return this.calculateOverlayZIndex(index) + 1;
			}
		},
		components: {
      'menu-overlay': ComponentMenuModal,
      'donation-cart': ComponentDonationCartModal,
      'donation-tiers': ComponentDonationTiersModal,
      'spinner': ComponentSpinnerModal
		}
	};
</script>