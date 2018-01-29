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
    <div class="main__metrics">

        <div class="main__spotlight wrapper text-c">

            <div v-if="displayDonationTotals" class="main-spotlight-section day-totals">
                <div>We’ve received</div>
                <div class="day-totals__numbers">
                    <div v-for="digit in donationsCountArray" :class="metricClass(digit)">{{ digit }}</div>
                </div>
                <div>donations for</div>
                <div class="day-totals__numbers">
                    <div v-for="digit in donationsTotalArray" :class="metricClass(digit)">{{ digit }}</div>
                </div>
            </div>

            <div class="main-spotlight-section countdown" v-if="displayEventCountdown() && countdown.loaded">
                {{ countdownPrefix }}
                <span class="countdown__timer">
                    <span v-if="countdown.days > 0">{{ countdown.days }} days,</span>
                    <span v-if="countdown.days > 0 || countdown.hours > 0">{{ countdown.hours }} hours,</span>
                    <span v-if="countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0">{{ countdown.minutes }} minutes, and</span>
                    <span v-if="countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds >= 0">{{ countdown.seconds }} seconds</span>
                </span>
                {{ countdownSuffix }}
            </div>

            <div class="main-spotlight-section nonprofit-search">
                <form v-on:submit="submitSearch" class="nonprofit-search__name">
                    <div class="form-item">
                        <div class="form-item__label">
                            <label for="nonprofitName">Search by Name</label>
                        </div>
                        <div class="form-item__control">
                            <div class="grid--mobile grid--compact grid--middle grid--row">

                                <div class="grid-item">
                                    <div class="search-wrap">
                                        <input v-model="formData.search" type="search" name="nonprofitName" id="nonprofitName" placeholder="Enter Keywords">
                                    </div>
                                    <div v-if="formErrors.search" class="notes notes--below notes--error">
                                        {{ formErrors.search }}
                                    </div>
                                </div>

                                <div class="grid-item grid-item--collapse">
                                    <button type="submit" class="btn btn--dark">Go</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>

                <form class="nonprofit-search__category">
                    <div class="form-item">
                        <div class="form-item__label">
                            <label for="nonprofitCategory">Search by Category</label>
                        </div>
                        <div class="form-item__control">
                            <div class="select-wrap">
                                <forms-nonprofit-category-select v-model="category" placeholder="Select a category"></forms-nonprofit-category-select>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="nonprofit-search__love" v-if="displayMatchFund && canDonate">
                    <div class="mb3">
                        <a href="#" class="btn btn--accent btn--lg">{{ matchFundButtonText }}</a>
                    </div>
                    <div class="notes" v-if="matchFundDetails">
                        {{ matchFundDetails }}
                    </div>
                </div>

                <div class="nonprofit-search__see-all">
                    <router-link :to="{ name: 'search-results' }">See All Nonprofits</router-link>
                </div>
            </div>

            <div class="main-spotlight-section register wrapper wrapper--xs" v-if="displayRegisterButton">
                <div class="register__action mb4">
                    <router-link :to="{ name: 'register' }" class="btn btn--green btn--round btn--lg">{{ registerButtonText }}</router-link>
                </div>
                <div class="register__details" v-html="registerDetails" v-if="registerDetails"></div>
            </div>

            <div class="main-spotlight-section wrapper wrapper--xs" v-if="displaySendReceiptForm">
                <form v-on:submit="submitReceiptRequest" class="mb4">
                    <div>
                        <strong><label for="email">Enter your email and we'll send you a receipt for all of your donations this year.</label></strong>
                    </div>
                    <div class="grid justify-center items-center" style="max-width: 640px; margin: .5rem auto 0;">
                        <div class="grid-item grid-item--expand">
                            <input v-model="formData.email" type="text" name="email" id="email" placeholder="Your Email Address" :class="{'has-error': formErrors.email}">
                            <div v-if="formErrors.email" class="notes notes--below notes--error">
                                {{ formErrors.email }}
                            </div>
                        </div>
                        <div class="grid-item grid-item--collapse">
                            <forms-submit :processing="processing" color="accent" :rounded="false" :hasIcon="false">Send Email</forms-submit>
                        </div>
                    </div>
                </form>
            </div>

        </div>

    </div>
</template>

<script>
	import * as Utils from './../../helpers/utils';
	import * as Settings from './../../helpers/settings';

	const moment = require('moment-timezone');
	const numeral = require('numeral');

	module.exports = {
		data: function () {
			return {
				category: '',
				processing: false,

				// Form Data
				formData: {
					email: '',
					search: '',
				},

				// Errors
				formErrors: {},

				countdown: {
					loaded: false,
					timer: 0,
					type: 'preEvent',

					days: null,
					hours: null,
					minutes: null,
					seconds: null,
				},

				metrics: {
					'DONATIONS_COUNT': 0,
					'DONATIONS_TOTAL': 0,
				}
			};
		},
		computed: {
			dateEvent: function () {
				const vue = this;
				return vue.$store.getters.setting('DATE_EVENT');
			},
			eventTimezone: function () {
				const vue = this;
				return vue.$store.getters.setting('EVENT_TIMEZONE');
			},
			eventTitle: function () {
				return Settings.eventTitle();
			},
			eventDateEndOfDay: function () {
				if (this.dateEvent && this.eventTimezone) {
					return new Date(moment(new Date(this.dateEvent)).tz(this.eventTimezone).endOf('day').format());
				}
				return '';
			},
			eventDateStartOfDay: function () {
				if (this.dateEvent && this.eventTimezone) {
					return new Date(moment(new Date(this.dateEvent)).tz(this.eventTimezone).startOf('day').format());
				}
				return '';
			},
			countdownPrefix: function () {
				return this.countdown.type === 'event' ? 'You have' : 'There are';
			},
			countdownSuffix: function () {
				if (this.countdown.type === 'event') {
					return 'left to make a donation.';
				}
				return this.eventTitle ? 'until ' + this.eventTitle + ' begins.' : 'until the event beings.';
			},
			displayRegisterButton: function () {
				const vue = this;

				if (!vue.registerButtonText) {
					return false;
				}

				return Settings.acceptRegistrations();
			},
			displaySendReceiptForm: function () {
				return Settings.isAfterEvent();
			},
			displayDonationTotals: function () {
				return Settings.isDayOfEventOrAfter();
			},
			donationsCountArray: function () {
				return numeral(this.metrics.DONATIONS_COUNT).format('0,000').split('');
			},
			donationsTotalArray: function () {
				return numeral(this.metrics.DONATIONS_TOTAL / 100).format('$0,00.00').split('');
			},
			canDonate: function () {
				return Settings.acceptDonations();
			}
		},
		props: {
			displayMatchFund: {
				type: Boolean,
				default: false,
			},
			matchFundButtonText: {
				type: String,
				default: null,
			},
			matchFundDetails: {
				type: String,
				default: null,
			},
			registerButtonText: {
				type: String,
				default: null,
			},
			registerDetails: {
				type: String,
				default: null,
			}
		},
		created: function () {
			const vue = this;

			axios.get(API_URL + 'metrics' + Utils.generateQueryString({keys: Object.keys(vue.metrics)})).then(function (response) {
				response.data.forEach(function (metric) {
					if (vue.metrics.hasOwnProperty(metric.key)) {
						vue.metrics[metric.key] = metric.value;
					}
				});
			});

			if(vue.displayEventCountdown()) {
				vue.initializeCountdown();
			}
		},
		watch: {
			category: function (value) {
				if (value) {
					this.$router.push({name: 'search-results', query: {category: value}});
				}
			},
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						if (vue.displaySendReceiptForm) {
							vue.formErrors = vue.validate(vue.formData, vue.getReceiptConstraints());
						} else {
							vue.formErrors = vue.validate(vue.formData, vue.getSearchConstraints());
						}
					}
				},
				deep: true
			},
		},
		methods: {
			displayEventCountdown: function () {
				if (this.dateEvent && this.eventTimezone && this.eventDateEndOfDay && this.eventDateStartOfDay) {
					return new Date().getTime() <= this.eventDateEndOfDay.getTime();
				}
				return false;
			},
			initializeCountdown: function () {
				const vue = this;

				const end = this.eventDateEndOfDay.getTime();
				const start = this.eventDateStartOfDay.getTime();

				vue.countdown.timer = setInterval(function () {
					const now = new Date().getTime();

					let distance = start - now;
					if (distance < 0) {
						distance = end - now;
						vue.countdown.type = 'event';
					}

					vue.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
					vue.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					vue.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					vue.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);

					vue.countdown.loaded = true;
					if (distance <= 0) {
						vue.countdown.loaded = false;
						clearInterval(vue.countdown.timer);
					}
				}, 1000);
			},
			getReceiptConstraints: function () {
				return {
					email: {
						presence: true,
						email: true,
					}
				};
			},
			getSearchConstraints: function () {
				return {
					search: {
						presence: false,
						length: {
							minimum: 3
						},
					},
				};
			},
			submitReceiptRequest: function (event) {
				event.preventDefault();
				const vue = this;

				vue.formErrors = vue.validate(vue.formData, vue.getReceiptConstraints());
				if (!Object.keys(vue.formErrors).length) {
					vue.processing = true;
					vue.requestReceipt();
				}
			},
			submitSearch: function (event) {
				event.preventDefault();
				const vue = this;

				vue.formErrors = vue.validate(vue.formData, vue.getSearchConstraints());
				if (!Object.keys(vue.formErrors).length) {
					vue.searchNonprofits();
				}
			},
			requestReceipt: function () {
				const vue = this;

				axios.post(API_URL + 'donations/receipt', {
					email: vue.formData.email,
				}).then(function () {
					vue.formData.email = '';
					vue.processing = false;
					// TODO: redirect to thank-you page
				}).catch(function (err) {
					console.log(err);
					vue.processing = false;
				});
			},
			searchNonprofits: function () {
				const vue = this;

				vue.$router.push(vue.generatePageLink({search: vue.formData.search}));
			},
			metricClass: function (digit) {
				return /^\d+$/.test(digit) ? 'number' : 'text';
			},
			generatePageLink: function (query) {
				const vue = this;
				query = query || {};
				query = _.extend({}, vue.$route.query, query);
				Object.keys(query).forEach(function (key) {
					if (query[key] === null || query[key] === 0 || query[key] === '' || query[key] === '0') {
						delete query[key];
					}
				});
				return {
					name: 'search-results',
					query: query
				};
			}
		},
		components: {
			'forms-nonprofit-category-select': require('./../forms/NonprofitCategorySelect.vue'),
			'forms-submit': require('./../forms/Submit.vue')
		}
	};
</script>