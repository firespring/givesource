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
                                        All incoming messages (e.g., contact us messages) will be sent to this email address.
                                        <span v-if="displayResendContactEmailVerificationLink">
                                            However, it must be verified before it can be used to receive any messages.
                                            <a v-on:click.prevent="resendContactEmailVerification" href="#">
                                                Resend Verification Link
                                            </a>
                                        </span>
                                    </div>
                                </div>

                                <div class="o-grid-col o-grid-col--sm-shrink">
                                    <a v-on:click.prevent="editContactEmail" href="#" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--icon">
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
                                        All outgoing messages (e.g., to participating nonprofits and donors) will be sent from this email address.
                                        <span v-if="displayResendSenderEmailVerificationLink">
                                            However, it must be verified before it can be used to send any messages.
                                            <a v-on:click.prevent="resendSenderEmailVerification" href="#">
                                                Resend Verification Link
                                            </a>
                                        </span>
                                    </div>

                                    <div class="c-notes c-notes--below" v-if="senderEmailIsVerified && this.cognitoSenderEmailAddress">
                                        <a v-if="!isCognitoSenderEmailAddress" v-on:click.prevent="setCognitoSenderEmail" href="#">
                                            Use this email address for user registration and forgot password emails.
                                        </a>
                                        <span v-else>
                                            <i class="fa fa-check" aria-hidden="true"></i>
                                            This email address is currently being used to send user registration and forgot password emails.
                                        </span>
                                    </div>
                                </div>

                                <div class="o-grid-col o-grid-col--sm-shrink">
                                    <a v-on:click.prevent="editSenderEmail" href="#" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--icon">
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
                                    <a v-on:click.prevent="editContactPhone" href="#" role="button" class="c-btn c-btn--xs c-btn--flat c-btn--icon">
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

	export default {
		data() {
			return {
				settings: [],
				emailSettings: [],
				cognitoSenderEmailAddress: null,
			};
		},
		computed: {
			displayResendContactEmailVerificationLink() {
				return this.settings.length && this.emailSettings.length && !this.contactEmailIsVerified;
			},
			displayResendSenderEmailVerificationLink() {
				return this.settings.length && this.emailSettings.length && !this.senderEmailIsVerified;
			},
			contactEmail() {
				let setting = null;
				if (this.settings.length) {
					setting = _.find(this.settings, {key: 'CONTACT_EMAIL'});
				}
				return setting ? setting.value : null;
			},
			contactEmailIsVerified() {
				let setting = null;
				if (this.settings.length && this.emailSettings.length && this.contactEmail) {
					setting = _.find(this.emailSettings, {email: this.contactEmail});
				}
				return setting ? setting.verified : false;
			},
			contactEmailVerificaitonMessage() {
				let message = '';
				if (this.settings.length && this.emailSettings.length) {
					message = this.contactEmail && !this.contactEmailIsVerified ? ' (Awaiting Verification)' : '';
				}
				return message;
			},
			contactPhone() {
				let setting = null;
				if (this.settings.length) {
					setting = _.find(this.settings, {key: 'CONTACT_PHONE'});
				}
				return setting ? setting.value : null;
			},
			isCognitoSenderEmailAddress() {
				return this.senderEmail === this.cognitoSenderEmailAddress;
			},
			senderEmail() {
				let setting = null;
				if (this.settings.length) {
					setting = _.find(this.settings, {key: 'SENDER_EMAIL'});
				}
				return setting ? setting.value : null;
			},
			senderEmailIsVerified() {
				let setting = null;
				if (this.settings.length && this.emailSettings.length && this.senderEmail) {
					setting = _.find(this.emailSettings, {email: this.senderEmail});
				}
				return setting ? setting.verified : false;
			},
			senderEmailVerificaitonMessage() {
				let message = '';
				if (this.settings.length && this.emailSettings.length) {
					message = this.senderEmail && !this.senderEmailIsVerified ? ' (Awaiting Verification)' : '';
				}
				return message;
			},
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('settings', {
					keys: ['CONTACT_EMAIL', 'CONTACT_PHONE', 'SENDER_EMAIL']
				}).then(response => {
					vm.settings = response.data;
					return vm.$request.get('settings/email');
				}).then(response => {
					vm.emailSettings = response.data;
					return vm.$request.get('settings/email/sender');
				}).then(response => {
					if (response.data && response.data.email) {
						vm.cognitoSenderEmailAddress = response.data.email;
					}
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('settings', {
				keys: ['CONTACT_EMAIL', 'CONTACT_PHONE', 'SENDER_EMAIL']
			}).then(response => {
				vm.settings = response.data;
				return vm.$request.get('settings/email');
			}).then(response => {
				vm.emailSettings = response.data;
				return vm.$request.get('settings/email/sender');
			}).then(response => {
				if (response.data && response.data.email) {
					vm.cognitoSenderEmailAddress = response.data.email;
				}
				next();
			}).catch(() => {
				next();
			});
		},
		created() {
			const vm = this;

			vm.bus.$on('updateSetting', data => {
				_.remove(vm.settings, {key: data.key});
				vm.settings.push(data);
			});
		},
		beforeDestroy() {
			const vm = this;
			vm.bus.$off('updateSetting');
		},
		methods: {
			editContactEmail() {
				const vm = this;
				vm.addModal('settings-edit-contact-email', {CONTACT_EMAIL: vm.contactEmail});
			},
			editContactPhone() {
				const vm = this;
				vm.addModal('settings-edit-contact-phone', {CONTACT_PHONE: vm.contactPhone});
			},
			editSenderEmail() {
				const vm = this;
				vm.addModal('settings-edit-sender-email', {SENDER_EMAIL: vm.senderEmail, SENDER_EMAIL_IS_VERIFIED: vm.senderEmailIsVerified});
			},
			resendContactEmailVerification() {
				const vm = this;
				vm.addModal('settings-resend-verify-email', {email: vm.contactEmail});
			},
			resendSenderEmailVerification() {
				const vm = this;
				vm.addModal('settings-resend-verify-email', {email: vm.senderEmail});
			},
			setCognitoSenderEmail() {
				const vm = this;

				vm.addModal('spinner');

				vm.$request.patch('settings/email/sender', {
					email: vm.senderEmail
				}).then(() => {
					return vm.$request.get('settings/email/sender');
				}).then(response => {
					if (response.data && response.data.email) {
						vm.cognitoSenderEmailAddress = response.data.email;
					}
					vm.removeModal('spinner');
				}).catch(err => {
					vm.removeModal('spinner');
					console.log(err);
				});
			}
		}
	};
</script>