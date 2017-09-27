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
                        <h1 class="o-page-header-title">Customize Homepage Messages</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form>
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Primary Text</h2>
                                    <div class="c-notes c-notes--below">
                                        This is the text that will appear in your homepage's masthead and main content areas. This text will always appear on your homepage.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="mastheadText" class="c-form-item-label-text">Masthead Text</label>
                                        <div class="c-notes">
                                            This text will appear in your homepage's masthead, directly below the featured image (if one has been uploaded).
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.mastheadText" :loaded="true" id="mastheadText"></forms-ckeditor>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="mainText" class="c-form-item-label-text">Main Text</label>
                                        <div class="c-notes">
                                            This text will appear in the main content area of your homepage.
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.mainText" :loaded="true" id="mainText"></forms-ckeditor>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Nonprofit Registration Text</h2>
                                    <div class="c-notes c-notes--below">
                                        This text will only appear on your homepage while you're accepting nonprofit registrations.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--text">
                                    <div class="c-form-item__label">
                                        <label for="nonprofitRegistrationButtonLabel" class="c-form-item-label-text">Registration Button Label</label>
                                        <div class="c-notes">
                                            Defaults to "Register Your Nonprofit Today" if left blank.
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input type="text" name="nonprofitRegistrationButtonLabel" id="nonprofitRegistrationButtonLabel" value="Register Your Nonprofit Today">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="registrationDetailsText" class="c-form-item-label-text">Details</label>
                                        <div class="c-notes">
                                            This text appears below the registration button. Use it to give nonprofits some additional information about registering.
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.registrationDetailsText" :loaded="true" id="registrationDetailsText"></forms-ckeditor>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Match Fund</h2>
                                    <div class="c-notes c-notes--below">
                                        This text will only appear on your homepage if you're accepting match funds for all nonprofits.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--checkbox">
                                    <div class="c-form-item__control">
                                        <ul class="c-input-list c-input-list--checkbox" aria-labelledby="enableMatchFunds">
                                            <li class="has-sub-options" ref="hasSubOptions">
                                                <input type="checkbox" v-model="formData.enableMatchFunds" name="enableMatchFunds" id="enableMatchFunds" v-on:change="toggleSubOptions">
                                                <label for="enableMatchFunds">Enable Match Funds for all Participating Nonprofits</label>
                                                <div class="sub-options" ref="subOptions">

                                                    <div class="c-form-item c-form-item--text">
                                                        <div class="c-form-item__label">
                                                            <label for="matchFundButtonLabel" class="c-form-item-label-text">Match Fund Button Label</label>
                                                            <div class="c-notes">
                                                                Defaults to "Love Them All" if left blank.
                                                            </div>
                                                        </div>
                                                        <div class="c-form-item__control">
                                                            <input type="text" name="matchFundButtonLabel" id="matchFundButtonLabel" value="Love Them All">
                                                        </div>
                                                    </div>

                                                    <div class="c-form-item c-form-item--text">
                                                        <div class="c-form-item__label">
                                                            <label for="matchFundDetailsText" class="c-form-item-label-text">Match Fund Details Text</label>
                                                            <div class="c-notes">
                                                                This text appears below the Match Fund button.
                                                            </div>
                                                        </div>
                                                        <div class="c-form-item__control">
                                                            <input type="text" name="matchFundDetailsText" id="matchFundDetailsText" value="">
                                                        </div>
                                                    </div>

                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Post-Event Text</h2>
                                    <div class="c-notes c-notes--below">
                                        This text will only appear on your homepage after your Giving Day event has ended.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--rich-text">
                                    <div class="c-form-item__label">
                                        <label for="postEventDetailsText" class="c-form-item-label-text">Details</label>
                                        <div class="c-notes">
                                            This text appears below the email receipt form. Use it to give nonprofits some additional information to your nonprofits and donors..
                                        </div>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.postEventDetailsText" :loaded="true" id="postEventDetailsText"></forms-ckeditor>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{ name: 'settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {

    			// Form Data
                formData: {
	                mastheadText: '',
                    mainText: '',
	                registrationDetailsText: '',
	                postEventDetailsText: '',
                    enableMatchFunds: false,
                }

            };
        },
        methods: {
    		toggleSubOptions: function () {
                const vue = this;

                if (vue.formData.enableMatchFunds) {
                	$(vue.$refs.hasSubOptions).addClass('has-sub-options--show');
	                $(vue.$refs.hasSubOptions).find('.c-form-item:first-child > .c-form-item__control > input').focus();
                } else {
	                $(vue.$refs.hasSubOptions).removeClass('has-sub-options--show');
	                $(vue.$refs.hasSubOptions).find('.c-form-item:first-child > .c-form-item__control > input').blur();
                }
            }
        },
	    components: {
		    'forms-ckeditor': require('./../../../forms/Ckeditor.vue')
	    }
    };
</script>