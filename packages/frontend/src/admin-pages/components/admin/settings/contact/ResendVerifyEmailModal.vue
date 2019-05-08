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
                                <button v-on:click.prevent="close" class="c-btn c-btn--neutral c-btn--text">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		props: {
			zIndex: {
				type: [Number, String],
				default: 1000
			},
			data: {
				type: Object,
				default() {
					return {
						email: ''
					};
				}
			},
		},
		created() {
			const vm = this;

			vm.$request.get('settings/email').then(response => {
				const setting = _.find(response.data, {email: vm.data.email});
				if (!setting || (setting && !setting.verified)) {
					return vm.$request.post('settings/email/verify', {
						email: vm.data.email
					});
				}
			});
		},
		methods: {
			close() {
				this.clearModals();
			}
		}
	};
</script>