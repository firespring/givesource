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

            <div class="main-spotlight-section day-totals">
                <div>We’ve received</div>
                <div class="day-totals__numbers">
                    <div class="number">4</div>
                    <div class="number">6</div>
                </div>
                <div>donations for</div>
                <div class="day-totals__numbers">
                    <div class="text">$</div>
                    <div class="number">2</div>
                    <div class="number">1</div>
                    <div class="number">5</div>
                    <div class="text">,</div>
                    <div class="number">0</div>
                    <div class="number">2</div>
                    <div class="number">5</div>
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
                <form v-on:submit="search" class="nonprofit-search__name">
                    <div class="form-item">
                        <div class="form-item__label">
                            <label for="nonprofitName">Search by Name</label>
                        </div>
                        <div class="form-item__control">
                            <div class="grid--mobile grid--compact grid--middle grid--row">

                                <div class="grid-item">
                                    <div class="search-wrap">
                                        <input type="search" name="nonprofitName" id="nonprofitName" ref="search">
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
                                <select id="nonprofitCategory" name="nonprofitCategory">
                                    <option value="1">Category #1</option>
                                    <option value="2">Category #2</option>
                                    <option value="3">Category #3</option>
                                    <option value="4">Category #4</option>
                                    <option value="5">Category #5</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="nonprofit-search__love">
                    <div class="mb3">
                        <a href="#" class="btn btn--blue btn--lg">Love Them All</a>
                    </div>
                    <div class="notes">
                        Your donation will be added to the challenge match fund distributed to all nonprofits.
                    </div>
                </div>

                <div class="nonprofit-search__see-all">
                    <router-link :to="{ name: 'search-results' }">See All Nonprofits</router-link>
                </div>
            </div>

            <div class="main-spotlight-section register wrapper wrapper--xs">
                <div class="register__action mb4">
                    <router-link :to="{ name: 'register' }" class="btn btn--green btn--round btn--lg">Register Your Nonprofit Today</router-link>
                </div>
                <div class="register__details">
                    <p>
                        We invite nonprofit organizations in the Greater Area to join Give To Our City Day by registering to participate.
                        Nonprofits must register in order to participate in the event. For nonprofit eligibility information,
                        <router-link :to="{ name: 'about' }">please visit the About page</router-link>
                        .
                    </p>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
	const moment = require('moment-timezone');

	module.exports = {
		data: function () {
			return {
				countdown: {
					loaded: false,
					timer: 0,
					type: 'preEvent',

					days: null,
					hours: null,
					minutes: null,
					seconds: null,
				}
			};
		},
		computed: {
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
		},
		props: {
			dateDonationsEnd: {
				type: String,
				default: null,
			},
			dateDonationsStart: {
				type: String,
				default: null,
			},
			dateEvent: {
				type: String,
				default: null,
			},
			dateRegistrationsEnd: {
				type: String,
				default: null,
			},
			dateRegistrationsStart: {
				type: String,
				default: null,
			},
			eventTimezone: {
				type: String,
				default: null,
			},
			eventTitle: {
				type: String,
				default: null,
			}
		},
		watch: {
			eventDateEndOfDay: function (value) {
				if (value && !this.loaded) {
					this.initializeCountdown();
				}
			}
		},
		methods: {
			displayEventCountdown: function () {
				if (this.dateEvent && this.eventTimezone) {
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
			search: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$router.push({name: 'search-results', query: {q: vue.$refs.search.value}});
			}
		}
	};
</script>