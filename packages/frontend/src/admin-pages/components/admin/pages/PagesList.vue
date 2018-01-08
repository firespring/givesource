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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">
                <div class="o-app-main-content">
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-select-menus">Manage the pages that appear on your event site</h2>
                            </div>
                        </header>

                        <div class="c-page-section__main">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-homepage'}">Home</router-link>
                                        </strong> — <a :href="getPageUrl('')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Manage the content displayed on your event's homepage. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-checkout'}">Donation Checkout</router-link>
                                        </strong> — <a :href="getPageUrl('/cart')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/cart') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Manage the content that's displayed on your donation checkout page. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-contact-us'}">Contact Us</router-link>
                                        </strong> — <a :href="getPageUrl('/contact')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/contact') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        This page provides site visitors with a contact form so they can easily contact you. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-register'}">Register</router-link>
                                        </strong> — <a :href="getPageUrl('/register')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/register') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        This page provides nonprofit visitors with a registration form. This page is required and can't be disabled.
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-about'}">About</router-link>
                                        </strong> — <a :href="getPageUrl('/about')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/about') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to describe what your event is about, how it got started, and other important info.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_ABOUT_ENABLED" v-on:change="updateSetting('PAGE_ABOUT_ENABLED')" type="checkbox"
                                                       name="pageAbout" id="pageAbout">
                                                <label for="pageAbout" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-faq'}">FAQ</router-link>
                                        </strong> — <a :href="getPageUrl('/faq')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/faq') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to answer all of your potential donors' questions.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_FAQ_ENABLED" v-on:change="updateSetting('PAGE_FAQ_ENABLED')" type="checkbox" name="pageFaq"
                                                       id="pageFaq">
                                                <label for="pageFaq" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-toolkits'}">Toolkits</router-link>
                                        </strong> — <a :href="getPageUrl('/toolkits')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/toolkits') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to provide participating nonprofits with useful tools, images, and information to make their campaign more successful.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_TOOLKIT_ENABLED" v-on:change="updateSetting('PAGE_TOOLKIT_ENABLED')" type="checkbox"
                                                       name="pageToolkit" id="pageToolkit">
                                                <label for="pageToolkit" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-form-item-grid">
                                <div class="c-form-item c-form-item--text">
                                    <div>
                                        <strong>
                                            <i class="fa fa-fw fa-file" aria-hidden="true"></i>
                                            <router-link :to="{name: 'pages-terms'}">Terms</router-link>
                                        </strong> — <a :href="getPageUrl('/terms')" target="_blank" rel="noopener noreferrer">{{ getPageUrl('/terms') }}</a>
                                    </div>
                                    <div class="c-notes c-notes--below">
                                        Use this page to provide information about the terms of your fundraising, such as privacy and refund policies.
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--switch c-form-item--compact c-form-item--v-center">
                                    <div class="c-form-item__control">
                                        <div class="c-switch-control">
                                            <div>
                                                <input v-model="formData.PAGE_TERMS_ENABLED" v-on:change="updateSetting('PAGE_TERMS_ENABLED')" type="checkbox" name="pageTerms"
                                                       id="pageTerms">
                                                <label for="pageTerms" class="c-switch-lever"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				settings: [],

				// Form Data
				formData: {
					PAGE_ABOUT_ENABLED: false,
					PAGE_FAQ_ENABLED: false,
					PAGE_TERMS_ENABLED: false,
					PAGE_TOOLKIT_ENABLED: false,
					EVENT_URL: '',
				},

				// Errors
				formErrors: {}
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('settings', {
					keys: Object.keys(vue.formData)
				}).then(function (response) {
					vue.settings = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('settings', {
				keys: Object.keys(vue.formData)
			}).then(function (response) {
				vue.settings = response.data;
				next();
			}).catch(function () {
				next();
			});
		},
		watch: {
			settings: {
				handler: function () {
					const vue = this;
					if (vue.settings.length) {
						Object.keys(vue.formData).forEach(function (key) {
							const setting = _.find(vue.settings, {key: key});
							if (setting) {
								vue.formData[key] = setting.value;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			getPageUrl: function (relativeLink) {
				return this.formData.EVENT_URL + relativeLink;
			},
			updateSetting: function (key) {
				const vue = this;

				if (_.find(vue.settings, {key: key})) {
					vue.$request.patch('settings/' + key, {
						value: vue.formData[key]
					}).catch(function (err) {
						console.log(err);
					});
				} else {
					vue.$request.post('settings', {
						key: key,
						value: vue.formData[key]
					}).catch(function (err) {
						console.log(err);
					});
				}
			},
		}
	};
</script>