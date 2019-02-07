<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <div id="modal-faq-add" class="c-modal c-modal--warning" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Edit FAQ Question & Answer</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <api-error v-model="apiError"></api-error>

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
                                        <forms-ckeditor v-model="formData.FAQ_LIST_ITEM_ANSWER.value" id="questionAnswer" type="Advanced" :allowImages="true"
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
	import ComponentCKEditor from './../../../forms/Ckeditor.vue';

	export default {
		data: function () {
			return {
				original: [],

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
				formErrors: {},
				apiErrors: {},
			};
		},
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default: {
					content: {},
				}
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
			},
			data: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.data.content).length) {
						Object.keys(vue.formData).forEach(function (key) {
							const content = _.find(vue.data.content.value, {key: key});
							if (content) {
								vue.formData[key] = content;
							}
						});
					}
				},
				deep: true
			}
		},
		mounted: function () {
			const vue = this;
			if (Object.keys(vue.data.content).length) {
				vue.original = JSON.parse(JSON.stringify(vue.data.content.value));
				Object.keys(vue.formData).forEach(function (key) {
					const content = _.find(vue.data.content.value, {key: key});
					if (content) {
						vue.formData[key] = content;
					}
				});
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
					vue.updateContents();
				}
			},
			updateContents: function () {
				const vue = this;

				const toUpdate = _.differenceWith(vue.data.content.value, vue.original, _.isEqual);
				if (toUpdate.length) {
					vue.$request.patch('contents', {
						contents: toUpdate
					}).then(function () {
						vue.bus.$emit('updateFAQList', vue.data.content);
						vue.clearModals();
					}).catch(function (err) {
						vue.removeModal('spinner');
						vue.apiError = err.response.data.errors;
					});
				}
			},
		},
		components: {
			'forms-ckeditor': ComponentCKEditor,
		}
	};
</script>