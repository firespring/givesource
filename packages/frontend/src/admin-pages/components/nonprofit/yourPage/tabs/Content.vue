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
    <div class="c-page-section__content">
        <form v-on:submit="submit">

            <div class="c-form-item c-form-item--text">
                <div class="c-form-item__label">
                    <label for="pageSlug" class="c-form-item-label-text">Page URL</label>
                </div>
                <div class="c-form-item__control">
                    <div class="c-form-control-grid u-items-center">
                        <div class="c-form-control-grid__item u-flex-collapse">
                            https://www.domain.com/pius-x-foundation
                        </div>
                        <div class="c-form-control-grid__item u-flex-collapse">
                            <a href="#" class="c-btn c-btn--xs c-btn--flat c-btn--neutral">Change</a>
                        </div>
                    </div>

                    <div style="display: none;">
                        <div class="c-form-control-grid u-items-center">
                            <div class="c-form-control-grid__item u-flex-collapse">
                                <label for="pageSlug"><strong>https://www.domain.com/</strong></label>
                            </div>
                            <div class="c-form-control-grid__item u-flex-expand">
                                <input type="text" name="pageSlug" id="pageSlug" value="pius-x-foundation">
                            </div>
                        </div>
                        <div class="c-notes c-notes--below">
                            Note: Changing your page's URL will break existing bookmarks and links to your page.
                        </div>
                    </div>

                </div>
            </div>

            <div class="c-form-item c-form-item--text">
                <div class="c-form-item__label">
                    <label for="shortDescription" class="c-form-item-label-text">Short Description (Up to 200 characters)</label>
                </div>
                <div class="c-form-item__control">
                    <input v-model="formData.shortDescription" type="text" name="shortDescription" id="shortDescription" maxlength="200"
                           :class="{ 'has-error': formErrors.shortDescription }">
                    <div v-if="formErrors.shortDescription" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                        {{ formErrors.shortDescription }}
                    </div>
                    <div class="c-notes c-notes--below">
                        This text will be what appears when the donation page is shared on social media.
                    </div>
                </div>
            </div>

            <div class="c-form-item c-form-item--rich-text">
                <div class="c-form-item__label">
                    <label for="longDescription" class="c-form-item-label-text">Long Description</label>
                </div>
                <div class="c-form-item__control">
                    <div class="c-notes c-notes--above">
                        Describe the non-profit's mission, purpose, and goals for the giving day.
                    </div>
                    <vue-ckeditor v-if="loaded" v-model="formData.longDescription" :toolbar="toolbar" :id="id" :language="language" :extraplugins="plugins"
                                  :class="{ 'has-error': formErrors.longDescription }">
                    </vue-ckeditor>
                    <div v-else style="height: 12rem; justify-content: center; align-items: center; display: flex;">
                        <div class="c-progress c-progress--spinner c-spinner-active">
                            <div class="c-spinner-layer c-spinner-orange-only">
                                <div class="c-spinner-circle-clipper left">
                                    <div class="c-spinner-circle"></div>
                                </div><div class="gap-patch">
                                <div class="c-spinner-circle"></div>
                            </div><div class="c-spinner-circle-clipper right">
                                <div class="c-spinner-circle"></div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="formErrors.longDescription" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                        {{ formErrors.longDescription }}
                    </div>
                </div>
            </div>

            <footer class="c-form-actions">
                <button type="submit" class="c-btn c-btn--flat">Save Changes</button>
            </footer>
        </form>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				language: 'en-us',
				id: 'longDescription',
				toolbar: [
					{name: 'styles', items: ['Format']},
					{name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
					{name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Blockquote']},
					{name: 'colors', items: ['TextColor', 'BGColor']},
					{name: 'links', items: ['Link', 'Unlink']},
					{name: 'tools', items: ['Maximize']}
				],
				plugins: 'colorbutton,colordialog',
                loaded: false,

				// Form Data
				formData: {
					longDescription: '',
					shortDescription: ''
				},

                // Errors
                formErrors: {}
			}
		},
        props: {
			nonprofit: {
				type: Object,
                default: function () {
                	return {};
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
            nonprofit: {
				handler: function () {
					const vue = this;

					vue.formData.shortDescription = vue.nonprofit.shortDescription;
					vue.formData.longDescription = vue.nonprofit.longDescription;
					vue.loaded = true;
                },
                deep: true
            }
		},
		methods: {
			getConstraints: function () {
				return {
					shortDescription: {
						presence: false,
						length: 200,
					},
					longDescription: {
						presence: false,
					}
				}
			},
			submit: function (e) {
				e.preventDefault();
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.updateNonprofit();
				}
			},
			updateNonprofit: function () {
				const vue = this;

				const params = {
					shortDescription: vue.formData.shortDescription,
                    longDescription: vue.formData.longDescription
                };
				axios.patch(API_URL + 'nonprofits/' + vue.user.nonprofitUuid, params).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			}
		}
	};
</script>
