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
    <div id="modal-confirm-delete" class="c-modal c-modal--warning c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Do you want to delete this item?</h1>
                    </div>


                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <p>

                                </p>
                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="deleteQuestion" type="button" class="c-btn c-btn--bad js-modal-close">Yes, Delete This Item</button>
                                <button v-on:click="cancel" type="button" class="c-btn c-btn--neutral c-btn--text js-modal-close">No, Keep This Item</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
	module.exports = {
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: {
					content: {}
				}
			}
		},
		methods: {
			cancel: function () {
				this.clearModals();
			},
			deleteQuestion: function () {
				const vue = this;

				vue.addModal('spinner');
				vue.$request.delete('contents/' + vue.data.content.uuid).then(function () {
					vue.bus.$emit('deleteFAQList', vue.data.content);
					vue.clearModals();
				});
			},
		}
	};
</script>