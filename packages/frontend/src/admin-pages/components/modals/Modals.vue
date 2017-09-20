<template>
    <div v-if="modals.length">
        <div v-for="(modal, index) in modals" class="c-modal-overlay" :style="{'z-index': calculateOverlayZIndex(index), display: 'block' }"></div>
        <component v-for="(modal, index) in modals" :is="modal" :key="index" :zIndex="calculateModalZIndex(index)" :data="data[modal]"></component>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				modals: [],
                data: {}
			}
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
					vue.modals = vue.modals.slice(0 , -1);
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
		methods: {
			calculateOverlayZIndex: function (index) {
				return 999 + (index * 1000);
			},
			calculateModalZIndex: function (index) {
				return this.calculateOverlayZIndex(index) + 1;
			}
		},
		components: {
			'spinner': require('./ModalSpinner.vue'),
			'account-edit-info': require('../account/UserAccountInfoModal.vue'),
			'account-edit-password': require('../account/UserAccountPasswordModal.vue'),
            'photo-editor': require('./photoEditor/PhotoEditorModal.vue'),
		}
	};
</script>

<style>
    .c-modal-overlay {
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0px;
        top: 0px;
        opacity: 0.95;
    }
</style>