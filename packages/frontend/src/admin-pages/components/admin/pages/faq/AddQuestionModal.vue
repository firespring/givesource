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
    <div id="modal-faq-add" class="c-modal c-modal--warning" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Add FAQ Question & Answer</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="questionText" class="c-form-item-label-text">Question</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.FAQ_LIST_ITEM_QUESTION.value" type="text" name="questionText" id="questionText"
                                               :class="{'has-error': formErrors['FAQ_LIST_ITEM_QUESTION.value']}" v-auto-focus>
                                        <div v-if="formErrors['FAQ_LIST_ITEM_QUESTION.value']" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors['FAQ_LIST_ITEM_QUESTION.value'] }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--rich-text c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="questionAnswer" class="c-form-item-label-text">Answer</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.FAQ_LIST_ITEM_ANSWER.value" :loaded="true" id="questionAnswer"
                                                        :has-error="formErrors['FAQ_LIST_ITEM_ANSWER.value']"></forms-ckeditor>
                                        <div v-if="formErrors['FAQ_LIST_ITEM_ANSWER.value']" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors['FAQ_LIST_ITEM_ANSWER.value'] }}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="save" type="button" class="c-btn">Save &amp; Close</button>
                                <button v-on:click="cancel" type="button" class="c-btn c-btn--neutral c-btn--text">Cancel</button>
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
		data: function () {
			return {
				// Form Data
				formData: {
					FAQ_LIST_ITEM_QUESTION: {
						key: 'FAQ_LIST_ITEM_QUESTION',
						type: 'TEXT',
						value: '',
					},
					FAQ_LIST_ITEM_ANSWER: {
						key: 'FAQ_LIST_ITEM_ANSWER',
						type: 'RICH_TEXT',
						value: '',
					},
				},

				// Errors
				formErrors: {}
			};
		},
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: {}
			}
		},
		watch: {
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				return {
					'FAQ_LIST_ITEM_QUESTION.value': {
						label: 'Question',
						presence: true
					},
					'FAQ_LIST_ITEM_ANSWER.value': {
						label: 'Answer',
						presence: true
					},
				};
			},
			cancel: function () {
				this.clearModals();
			},
			save: function () {
				const vue = this;

				vue.addModal('spinner');
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.removeModal();
				} else {
					vue.saveContents();
				}
			},
			saveContents: function () {
				const vue = this;

				let faqListContent = {};
				vue.$request.post('contents', {
					key: 'FAQ_LIST',
					type: 'COLLECTION'
				}).then(function (response) {
					faqListContent = response.data;
					return vue.$request.patch('contents', {
						contents: Object.keys(vue.formData).map(function (key) {
							const content = vue.formData[key];
							content.parentUuid = faqListContent.uuid;
							return content;
						}),
					});
				}).then(function () {
					faqListContent.value = Object.keys(vue.formData).map(function (key) {
						return vue.formData[key];
					});
					vue.bus.$emit('addFAQList', faqListContent);
					vue.clearModals();
				}).catch(function (err) {
					vue.removeModal('spinner');
					console.log(err);
				});
			},
		},
		components: {
			'forms-ckeditor': require('./../../../forms/Ckeditor.vue')
		}
	};
</script>