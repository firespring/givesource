<template>
    <div v-if="isAdmin && displayBanner" class="c-alert c-alert--expand c-alert--bad c-alert--shadow u-flex u-justify-center">
        <div class="c-alert__body u-flex u-justify-between">
            <div class="c-alert__icon">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </div>
            <div class="c-alert__text">
                <p>
                    Uh-oh! You are missing a critical piece to accepting donations. Contact Support right away to ensure donations can be sent through your site.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
	const moment = require('moment-timezone');

	export default {
		data() {
			return {
				/**
				 * Settings that will be returned in api call
				 */
				settings: [],

				/**
				 * Should banner show
				 */
				displayBanner: false
			}
		},

		created: function () {
			const vue = this;

			vue.$request.get('settings', {
				keys: ['PAYMENT_SPRING_PUBLIC_API_KEY', 'EVENT_TIMEZONE', 'DATE_DONATIONS_START']
			}).then(function (response) {
				vue.settings = response.data;
				next();
			}).catch(function () {
				next();
			});
		},

		computed: {
			/**
			 * Check to see what user level the user is
			 *
			 * @return {boolean}
			 */
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
		},

		methods: {
			/**
			 * Determines is the date is within 72 hours of the first donation
			 *
			 * @returns {boolean}
			 */
			showDonationsWarningBanner: function () {
				const vue = this;
				if (vue.settings.length > 0) {
					const eventTimezone = _.find(vue.settings, {key: 'EVENT_TIMEZONE'});
					const dateDonationsStart = _.find(vue.settings, {key: 'DATE_DONATIONS_START'});
					if (eventTimezone && dateDonationsStart) {
						const dateStart = moment(new Date(dateDonationsStart.value)).startOf('day').tz(eventTimezone.value, true);
						const threeDaysBefore = moment(new Date(dateDonationsStart.value)).startOf('day').tz(eventTimezone.value, true).subtract(3, 'd');

						return moment().isBetween(threeDaysBefore, dateStart);
					}
				}

				return false;
			}
		},

		watch: {
			/**
			 * Watch the setting data variable for change.
			 */
			settings: {
				handler: function () {
					const vue = this;
					const paymentKey = _.find(vue.settings, {key: 'PAYMENT_SPRING_PUBLIC_API_KEY'});
					if (!paymentKey && vue.showDonationsWarningBanner()) {
						vue.displayBanner = true;
					}

				}
			}
		},
	};
</script>