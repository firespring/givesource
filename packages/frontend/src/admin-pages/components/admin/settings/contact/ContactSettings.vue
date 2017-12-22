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

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Contact Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <section class="c-page-section c-page-section--border c-page-section--shadow">

                        <header class="c-page-section__header">
                            <div class="c-page-section-header-text">
                                <h2 class="c-page-section-title" id="section-password-security">Email Addresses</h2>
                            </div>
                        </header>

                        <div class="c-page-section__main">
                            <div class="c-page-section-segment o-grid o-grid--sm-middle">
                                <div class="o-grid-col o-grid-col--sm-expand">
                                    <h4 class="u-margin-none">Contact Email</h4>
                                    <div class="u-break-word">{{ contactEmail }}{{ contactEmailVerificaitonMessage }}</div>
                                    <div class="c-notes c-notes--below">
                                        All incoming messages (e.g., donation notifications) will be sent to this email address. However, it must be verified before it can be used
                                        to receive any messages.
                                        <a v-on:click.prevent="resendContactEmailVerification" href="#" class="js-modal-trigger" rel="modal-settings-resend-email-verification-link"
                                           v-if="displayResendContactEmailVerificationLink">
                                            Resend Verification Link
                                        </a>
                                    </div>
                                </div>

                                <div class="o-grid-col o-grid-col--sm-shrink">
                                    <a v-on:click.prevent="editContactEmail" href="#" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--icon js-modal-trigger"
                                       rel="modal-settings-edit-contact-email-address">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>Edit
                                    </a>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-page-section-segment o-grid o-grid--sm-middle">
                                <div class="o-grid-col o-grid-col--sm-expand">
                                    <h4 class="u-margin-none">Sender Email</h4>
                                    <div class="u-break-word">{{ senderEmail }}{{ senderEmailVerificaitonMessage }}</div>
                                    <div class="c-notes c-notes--below">
                                        All outgoing messages (e.g., to participating nonprofits and donors) will be sent from this email address. However, it must be verified
                                        before it can be used to send any messages.
                                        <a v-on:click.prevent="resendSenderEmailVerification" href="#" class="js-modal-trigger" rel="modal-settings-resend-email-verification-link"
                                           v-if="displayResendSenderEmailVerificationLink">
                                            Resend Verification Link
                                        </a>
                                    </div>
                                </div>

                                <div class="o-grid-col o-grid-col--sm-shrink">
                                    <a v-on:click.prevent="editSenderEmail" href="#" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--icon js-modal-trigger"
                                       rel="modal-settings-edit-sender-email-address">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>Edit
                                    </a>
                                </div>
                            </div>

                            <hr class="expand">

                            <div class="c-page-section-segment o-grid o-grid--sm-middle">
                                <div class="o-grid-col o-grid-col--sm-expand">
                                    <h4 class="u-margin-none">Contact Phone #</h4>
                                    <div class="u-break-word">{{ contactPhone }}</div>
                                    <div class="c-notes c-notes--below">
                                        This will be displayed in various locations throughout your event's site.
                                    </div>
                                </div>

                                <div class="o-grid-col o-grid-col--sm-shrink">
                                    <a v-on:click.prevent="editContactPhone" href="#" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--icon js-modal-trigger"
                                       rel="modal-settings-edit-contact-phone">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>Edit
                                    </a>
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
	import * as Utils from './../../../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				settings: [],
				emailSettings: [],
			};
		},
		computed: {
			displayResendContactEmailVerificationLink: function () {
				return this.settings.length && this.emailSettings.length && !this.contactEmailIsVerified;
			},
			displayResendSenderEmailVerificationLink: function () {
				return this.settings.length && this.emailSettings.length && !this.senderEmailIsVerified;
			},
			contactEmail: function () {
				let setting = null;
				if (this.settings.length) {
					setting = _.find(this.settings, {key: 'CONTACT_EMAIL'});
				}
				return setting ? setting.value : null;
			},
            contactEmailIsVerified: function () {
	            let setting = null;
	            if (this.settings.length && this.emailSettings.length && this.contactEmail) {
		            setting = _.find(this.emailSettings, {email: this.contactEmail});
	            }
	            return setting ? setting.verified : false;
            },
			contactEmailVerificaitonMessage: function () {
				let message = '';
				if (this.settings.length && this.emailSettings.length) {
					message = this.contactEmail && !this.contactEmailIsVerified ? ' (Awaiting Verification)' : '';
				}
				return message;
            },
			contactPhone: function () {
				let setting = null;
				if (this.settings.length) {
					setting = _.find(this.settings, {key: 'CONTACT_PHONE'});
				}
				return setting ? setting.value : null;
			},
			senderEmail: function () {
				let setting = null;
				if (this.settings.length) {
					setting = _.find(this.settings, {key: 'SENDER_EMAIL'});
				}
				return setting ? setting.value : null;
			},
			senderEmailIsVerified: function () {
				let setting = null;
				if (this.settings.length && this.emailSettings.length && this.senderEmail) {
					setting = _.find(this.emailSettings, {email: this.senderEmail});
				}
				return setting ? setting.verified : false;
			},
			senderEmailVerificaitonMessage: function () {
				let message = '';
				if (this.settings.length && this.emailSettings.length) {
					message = this.senderEmail && !this.senderEmailIsVerified ? ' (Awaiting Verification)' : '';
				}
				return message;
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('settings', {
					keys: ['CONTACT_EMAIL', 'CONTACT_PHONE', 'SENDER_EMAIL']
				}).then(function (response) {
					vue.settings = response.data;
					return vue.$request.get('settings/email');
				}).then(function (response) {
					vue.emailSettings = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('settings', {
				keys: ['CONTACT_EMAIL', 'CONTACT_PHONE', 'SENDER_EMAIL']
			}).then(function (response) {
				vue.settings = response.data;
				return vue.$request.get('settings/email');
			}).then(function (response) {
				vue.emailSettings = response.data;
				next();
			}).catch(function () {
				next();
			});
		},
		created: function () {
			const vue = this;

			vue.bus.$on('updateSetting', function (data) {
				_.remove(vue.settings, {key: data.key});
				vue.settings.push(data);
			});
		},
		beforeDestroy: function () {
			const vue = this;
			vue.bus.$off('updateSetting');
		},
		methods: {
			editContactEmail: function () {
				const vue = this;
				vue.addModal('settings-edit-contact-email', {CONTACT_EMAIL: vue.contactEmail});
			},
			editContactPhone: function () {
				const vue = this;
				vue.addModal('settings-edit-contact-phone', {CONTACT_PHONE: vue.contactPhone});
			},
			editSenderEmail: function () {
				const vue = this;
				vue.addModal('settings-edit-sender-email', {SENDER_EMAIL: vue.senderEmail, SENDER_EMAIL_IS_VERIFIED: vue.senderEmailIsVerified});
			},
			resendContactEmailVerification: function () {
				const vue = this;
				vue.addModal('settings-resend-verify-email', {email: vue.contactEmail});
			},
			resendSenderEmailVerification: function () {
				const vue = this;
				vue.addModal('settings-resend-verify-email', {email: vue.senderEmail});
			}
		}
	};
</script>