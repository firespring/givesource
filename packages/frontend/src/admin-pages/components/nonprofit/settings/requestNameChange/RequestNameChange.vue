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
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'nonprofit-settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Request Name Change</h1>
                    </div>
                </div>

                <form v-on:submit.prevent="submit">
                    <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                        <div class="c-page-section__main">

                            <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.requestedName }">
                                <div class="c-form-item__label">
                                    <label for="requestedName" class="c-form-item-label-text">Requested Name</label>
                                </div>
                                <div class="c-form-item__control">
                                    <input v-model="formData.requestedName" type="text" name="requestedName" id="requestedName" maxlength="200"
                                           :class="{ 'has-error': formErrors.requestedName }" v-auto-focus>
                                    <div v-if="formErrors.requestedName" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.requestedName }}
                                    </div>
                                    <div class="c-notes c-notes--below" v-else>
                                        Your nonprofit's current name is: {{ nonprofit.legalName }}
                                    </div>
                                </div>
                            </div>

                            <div class="c-form-item c-form-item--textarea" :class="{ 'c-form-item--has-error': formErrors.changeReason }">
                                <div class="c-form-item__label">
                                    <label for="changeReasons" class="c-form-item-label-text">Reasons for Name Change</label>
                                </div>
                                <div class="c-form-item__control">
                                    <textarea v-model="formData.changeReason" name="changeReasons" id="changeReasons" :class="{ 'has-error': formErrors.changeReason }"></textarea>
                                    <div v-if="formErrors.changeReason" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                        {{ formErrors.changeReason }}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <footer class="c-form-actions">
                        <button type="submit" class="c-btn">Submit Your Request</button>
                        <router-link :to="{ name: 'nonprofit-settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                    </footer>
                </form>

            </div>
        </main>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				nonprofit: {},

				// Form Data
				formData: {
					requestedName: '',
					changeReason: ''
				},

				// Errors
				formErrors: {}
			};
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
					vm.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('/nonprofits/' + to.params.nonprofitUuid).then(response => {
				vm.nonprofit = response.data;
				next();
			}).catch(() => {
				next();
			});
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
					requestedName: {
						presence: true,
					},
					changeReason: {
						presence: false,
					}
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.submitRequest();
				}
			},
			submitRequest() {
				const vm = this;

				const name = (vm.user.firstName && vm.user.lastName) ? vm.user.firstName + ' ' + vm.user.lastName : vm.nonprofit.legalName;
				vm.$request.post('messages', {
					name: name,
					email: vm.user.email,
					message: vm.formatMessage(),
					type: 'NAME_CHANGE'
				}).then(() => {
					vm.clearModals();
					vm.$router.push({name: 'nonprofit-settings-list'});
				}).catch(err => {
					console.log(err);
				});
			},
			formatMessage() {
				const vm = this;

				let message = '<strong>Original Name:</strong> ' + vm.nonprofit.legalName + '<br>';
				message += '<strong>Requested Name:</strong> ' + vm.formData.requestedName + '<br>';
				message += '<strong>Reason:</strong> ' + vm.formData.changeReason;

				return message;
			}
		}
	};
</script>