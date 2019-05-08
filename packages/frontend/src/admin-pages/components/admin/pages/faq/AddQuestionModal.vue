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
                                        <forms-ckeditor v-model="formData.FAQ_LIST_ITEM_ANSWER.value" id="questionAnswer" type="advanced"
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
                                <button v-on:click.prevent="save" type="button" class="c-btn">Save &amp; Close</button>
                                <button v-on:click.prevent="cancel" type="button" class="c-btn c-btn--neutral c-btn--text">Cancel</button>
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
		data() {
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
				formErrors: {},
				apiError: {},
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
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
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
			cancel() {
				this.clearModals();
			},
			save() {
				const vm = this;

				vm.addModal('spinner');
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.removeModal();
				} else {
					vm.saveContents();
				}
			},
			saveContents() {
				const vm = this;

				let faqListContent = {};
				vm.$request.post('contents', {
					key: 'FAQ_LIST',
					type: 'COLLECTION'
				}).then(response => {
					faqListContent = response.data;
					return vm.$request.patch('contents', {
						contents: Object.keys(vm.formData).map(key => {
							const content = vm.formData[key];
							content.parentUuid = faqListContent.uuid;
							return content;
						}),
					});
				}).then(() => {
					faqListContent.value = Object.keys(vm.formData).map(key => {
						return vm.formData[key];
					});
					vm.bus.$emit('addFAQList', faqListContent);
					vm.clearModals();
				}).catch(err => {
					vm.removeModal('spinner');
					vm.apiError = err.response.data.errors;
				});
			},
		},
		components: {
			'forms-ckeditor': ComponentCKEditor,
		}
	};
</script>