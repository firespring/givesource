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
                    <label for="slug" class="c-form-item-label-text">Page URL</label>
                </div>
                <div class="c-form-item__control">
                    <div class="c-form-control-grid u-items-center" v-if="editSlug">
                        <div class="c-form-control-grid__item u-flex-collapse">
                            <label for="slug"><strong>{{ pageLink }}</strong></label>
                        </div>
                        <div class="c-form-control-grid__item u-flex-expand">
                            <input v-model="formData.slug" type="text" name="slug" id="slug" v-on:change="slugMask">
                        </div>
                    </div>
                    <div class="c-notes c-notes--below" v-if="editSlug">
                        Note: Changing your page's URL will break existing bookmarks and links to your page.
                    </div>

                    <div class="c-form-control-grid u-items-center" v-if="!editSlug">
                        <div class="c-form-control-grid__item u-flex-collapse">
                            {{ pageLink }}{{ nonprofit.slug }}
                        </div>
                        <div class="c-form-control-grid__item u-flex-collapse">
                            <a v-on:click="changeSlug" href="#" class="c-btn c-btn--xs c-btn--flat c-btn--neutral">Change</a>
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
                    <forms-ckeditor v-model="formData.longDescription" :loaded="loaded" id="longDescription" :hasErrors="formErrors.longDescription"></forms-ckeditor>
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
    const slug = require('slug');

	module.exports = {
		data: function () {
			return {
                loaded: false,
                editSlug: false,
				pageLink: PUBLIC_PAGES_URL + '/nonprofits/',

				// Form Data
				formData: {
					longDescription: '',
					shortDescription: '',
					slug: '',
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
				handler: function (value) {
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

					vue.formData = vue.sync(vue.formData, vue.nonprofit);
					vue.loaded = true;
                },
                deep: true
            }
		},
		methods: {
			getConstraints: function () {
				return {
					longDescription: {
						presence: false,
					},
					shortDescription: {
						presence: false,
						length: 200,
					},
                    slug: {
						presence: true
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

				const params = vue.getUpdatedParameters(vue.formData, vue.nonprofit);
				if (Object.keys(params).length === 0) {
					vue.clearModals();
					return;
				}

				axios.patch(API_URL + 'nonprofits/' + vue.nonprofit.uuid, params).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					}
					vue.editSlug = false;
					vue.$emit('updateNonprofit', response.data);
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
            changeSlug: function (event) {
				event.preventDefault();
				const vue = this;

                vue.editSlug = true;
            },
            slugMask: function (event) {
				const vue = this;
				vue.formData.slug = slug(event.target.value, {lower: true});
            }
		},
        components: {
			'forms-ckeditor': require('./../../../forms/Ckeditor.vue')
        }
	};
</script>
