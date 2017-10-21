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

        <!-- BEGIN app main -->
        <main class="o-app__main o-app__main--compact">

            <!-- BEGIN app main content wrapper -->
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-app-main-content">

                    <!-- BEGIN page header -->
                    <div class="o-page-header">


                        <div class="o-page-header__text" >
                            <nav class="o-page-header-nav c-breadcrumb">

                                <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                                <span><router-link :to="{ name: 'settings-manage-nonprofits' }">Manage Nonprofitss</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Invite Nonprofits</h1>
                        </div>

                    </div>
                    <!-- END page header -->

                    <form v-on:submit="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title" id="section-segmented">Nonprofits</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--textarea c-form-item--required">

                                    <div class="c-form-item__label">

                                        <label for="organizationInvitees" class="c-form-item-label-text">Enter email addresses of individuals you want to invite</label>

                                        <div class="c-notes">
                                            Separate individual email addresses with commas. Recipients who don't have Giving Day accounts will be asked to create one during the invitation process.
                                        </div>

                                    </div>

                                    <div class="c-form-item__control">
                                        <textarea v-model="formData.emailAddresses" name="organizationInvitees" id="organizationInvitees" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 100px;" :class="{ 'has-error': formErrors.emailAddresses }"></textarea>
                                        <div v-if="formErrors.emailAddresses" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                            {{ formErrors.emailAddresses }}
                                        </div>

                                        <div class="c-notes c-notes--below">
                                            <strong>Note:</strong> Some nongproft notes
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>

                        <!-- BEGIN hidden fields -->
                        <div class="hidden">
                            <input type="hidden" name="hiddenField" id="hiddenField">
                        </div>
                        <!-- END hidden fields -->

                        <!-- BEGIN form actions -->
                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Send Invites</button>
                            <router-link :to="{ name: 'settings-manage-nonprofits' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                        <!-- END form actions -->

                    </form>

                </div>

            </div>
            <!-- END app main content wrapper -->

        </main>
        <!-- END app main -->

    </div>

</template>
<script>
    module.exports = {
    	data: function() {
    	    return {
    	    	formData: {
    	    		emailAddresses: '',
                },

		        formErrors: {}
            }
        },
    	methods: {
		    getConstraints: function () {
			    return {
				    emailAddresses: {
					    label: 'Email addresses',
					    presence: true,
				    }
			    }
		    },
    		submit: function (event) {
                event.preventDeafault();
                const vue = this;

                vue.addModal('spinner');
                vue.formErrors = vue.validate(vue.formErrors, vue.getConstraints());
                if (Object.keys(vue.formErrors).length) {
                	vue.cleanModals();
                } else {
                	vue.inviteAdmins();
                }
		    },
            inviteAdmins: function () {
		    	const vue = this;

		    	axios.post(API_URL + 'admin/users', {
		    		email_addresses: vue.formData.emailAddresses,
                    user_pool_id: USER_POOL_ID
                }).then(function (response) {
                	vue.cleanModals();
                	if (response.data.errorMessage) {
                		console.log(response.data);
                    }else {
                		vue.$router.push({name: 'settings-manage-nonprofits'});
                    }

                }).catch(function(err) {
                	vue.cleanModals();
                	console.log(err);
                });
            }
        }
    }
</script>

