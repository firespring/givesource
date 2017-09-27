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
                        <h1 class="o-page-header-title">General Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form>
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Giving Day Event Info</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="eventTitle" class="c-form-item-label-text">Event Title</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input type="text" name="eventTitle" id="eventTitle" maxlength="200" value="">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--date c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="dateEvent" class="c-form-item-label-text">Event Date</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-datetime v-model="formData.dateEvent" name="dateEvent" id="dateEvent"></forms-datetime>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--url c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="eventUrl" class="c-form-item-label-text">Event URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input type="url" name="eventUrl" id="eventUrl" maxlength="200" value="" placeholder="http://">
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--tel">
                                    <div class="c-form-item__label">
                                        <label for="phoneNum" class="c-form-item-label-text">Contact Phone #</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--tel">
                                            <input type="tel" name="phoneNum" id="phoneNum">
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--combobox">
                                    <div class="c-form-item__label">
                                        <label for="eventTimezone" class="c-form-item-label-text">Time Zone</label>
                                    </div>

                                    <div class="c-form-item__control">
                                        <forms-select-time-zone v-model="formData.eventTimezone" id="eventTimezone" name="eventTimezone"></forms-select-time-zone>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Giving Day Event Stages</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--date c-form-item--date-range">
                                    <div class="c-form-item__label">
                                        <label for="dateRegistrationsStart" class="c-form-item-label-text">When do you accept nonprofit registrations?</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateRegistrationsStart" name="dateRegistrationsStart" id="dateRegistrationsStart"
                                                                placeholder="Start" :maxDate="dateRegistrationsMaxDate"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateRegistrationsEnd" name="dateRegistrationsEnd" id="dateRegistrationsEnd"
                                                                placeholder="End" :minDate="dateRegistrationsMinDate"></forms-datetime>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            During this time range, nonprofits in your community can register to create their own landing pages. If no range is specified, then nonprofits can start registering 30 days before your event's start date up until the date of your event.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--date c-form-item--date-range">
                                    <div class="c-form-item__label">
                                        <label for="dateAcceptDonationsStart" class="c-form-item-label-text">When do you accept donations?</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateAcceptDonationsStart" name="dateAcceptDonationsStart" id="dateAcceptDonationsStart"
                                                                placeholder="Start" :maxDate="dateAcceptDonationsMaxDate"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateAcceptDonationsEnd" name="dateAcceptDonationsEnd" id="dateAcceptDonationsEnd"
                                                                placeholder="End" :minDate="dateAcceptDonationsMinDate"></forms-datetime>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            During this time range, visitors to your site can make donations to any registered and verified nonprofits. If no range is specified, then donations will only be accepted on the actual date your event.
                                        </div>
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
	                dateEvent: '',
	                eventTimezone: '',
                    dateRegistrationsStart: '',
                    dateRegistrationsEnd: '',
	                dateAcceptDonationsStart: '',
	                dateAcceptDonationsEnd: '',
                }

            };
        },
        computed: {
	        dateRegistrationsMinDate: function () {
		        return this.formData.dateRegistrationsStart ? this.formData.dateRegistrationsStart : false;
	        },
    		dateRegistrationsMaxDate: function () {
    			return this.formData.dateRegistrationsEnd ? this.formData.dateRegistrationsEnd : false;
            },
	        dateAcceptDonationsMinDate: function () {
	        	return this.formData.dateAcceptDonationsStart ? this.formData.dateAcceptDonationsStart : false;
            },
	        dateAcceptDonationsMaxDate: function () {
    			return this.formData.dateAcceptDonationsEnd ? this.formData.dateAcceptDonationsEnd : false;
            }
        },
        components: {
    		'forms-datetime': require('./../../../forms/Datetime.vue'),
            'forms-select-time-zone': require('./../../../forms/SelectTimeZone.vue')
        }
    };
</script>