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
    <div id="modal-settings-edit-contact-email-address" class="c-modal c-modal--sm" :style="{ 'z-index': zIndex, display: 'block' }">
        <div class="c-modal__contents">
            <div class="c-modal-dialog">
                <div class="c-modal-dialog__contents">

                    <div class="c-modal-header">
                        <h1>Email Verification</h1>
                    </div>

                    <div class="c-modal-content">
                        <div class="c-page-section">
                            <div class="c-page-section__main">
                                <p>
                                    A new verification link has been sent to <strong class="u-break-word">{{ data.email }}</strong>.
                                    Click on this link to verify your email address.
                                </p>
                                <p>
                                    The verification link will expire after 24 hours.
                                </p>
                            </div>
                        </div>

                        <div class="c-modal-footer">
                            <div class="c-modal-footer__actions">
                                <button v-on:click="close" class="c-btn c-btn--neutral c-btn--text">Close</button>
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
				default: function () {
					return {
						email: ''
					};
				}
			},
		},
		created: function () {
			const vue = this;

			axios.get(API_URL + 'settings/email').then(function (response) {
				const setting = _.find(response.data, {email: vue.data.email});
				if (!setting || (setting && !setting.verified)) {
					return axios.post(API_URL + 'settings/email/verify', {
						email: vue.data.email
					});
				}
			});
		},
		methods: {
			close: function () {
				this.clearModals();
			}
		}
	};
</script>