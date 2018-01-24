/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import store from './../store';

const moment = require('moment-timezone');

/**
 * Is nonprofit registration active?
 * Registration is considered active if an event timezone or start/end dates have not been configured.
 *
 * @returns {boolean}
 */
const acceptRegistrations = function () {

	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateEvent = store.getters.setting('DATE_EVENT');
	if (eventTimezone && dateEvent) {
		const now = moment().tz(eventTimezone);
		const start = moment(new Date(registrationStartDate())).tz(eventTimezone);
		const end = moment(new Date(registrationEndDate())).tz(eventTimezone);
		if (now.isBetween(start, end, 'day', '[]')) {
			return true;
		}
	}

	return false;
};

/**
 * Get registration start date
 *
 * @returns {String|null}
 */
const registrationStartDate = function () {
	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateEvent = store.getters.setting('DATE_EVENT');
	let dateRegistrationsStart = store.getters.setting('DATE_REGISTRATIONS_START');
	if (!dateRegistrationsStart && eventTimezone && dateEvent) {
		dateRegistrationsStart = moment(new Date(dateEvent)).tz(eventTimezone).subtract(30, 'days').format('MM/DD/YYYY');
	}

	return dateRegistrationsStart;
};

/**
 * Get registration end date
 *
 * @returns {String|null}
 */
const registrationEndDate = function () {
	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateEvent = store.getters.setting('DATE_EVENT');
	let dateRegistrationsEnd = store.getters.setting('DATE_REGISTRATIONS_END');
	if (!dateRegistrationsEnd && eventTimezone && dateEvent) {
		dateRegistrationsEnd = moment(new Date(dateEvent)).tz(eventTimezone).subtract(1, 'days').format('MM/DD/YYYY');
	}

	return dateRegistrationsEnd;
};

/**
 * Has nonprofit registration started yet?
 *
 * @returns {boolean}
 */
const isBeforeRegistrationStart = function () {

	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateRegistrationsStart = registrationStartDate();

	if (eventTimezone && dateRegistrationsStart) {
		let now = moment().tz(eventTimezone);
		if (now.isBefore(moment(new Date(dateRegistrationsStart)).tz(eventTimezone).startOf('day'))) {
			return true;
		}
	}

	return false;
};

/**
 * Has nonprofit registration ended?
 *
 * @returns {boolean}
 */
const isAfterRegistrationEnd = function () {

	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateRegistrationsEnd = registrationEndDate();

	if (eventTimezone && dateRegistrationsEnd) {
		let now = moment().tz(eventTimezone);
		if (now.isAfter(moment(new Date(dateRegistrationsEnd)).tz(eventTimezone).endOf('day'))) {
			return true;
		}
	}

	return false;
};

/**
 * Is it the day of the event?
 *
 * @returns {boolean}
 */
const isDayOfEvent = function () {
	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateEvent = store.getters.setting('DATE_EVENT');

	if (eventTimezone && dateEvent) {
		let now = moment().tz(eventTimezone);
		if (now.isSame(moment(new Date(dateEvent)).tz(eventTimezone), 'day')) {
			return true;
		}
	}

	return false;
};

/**
 * Is it the day of the event or after?
 *
 * @returns {boolean}
 */
const isDayOfEventOrAfter = function () {
	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateEvent = store.getters.setting('DATE_EVENT');

	if (eventTimezone && dateEvent) {
		let now = moment().tz(eventTimezone);
		if (now.isSameOrAfter(moment(new Date(dateEvent)).tz(eventTimezone), 'day')) {
			return true;
		}
	}

	return false;
};

/**
 * Get event title
 *
 * @returns {String}
 */
const eventTitle = function () {
	let title = store.getters.setting('EVENT_TITLE');
	if (title === null || title === '') {
		title = 'Give to Our City';
	}
	return title;
};

/**
 * Can donations be submitted?
 *
 * @returns {boolean}
 */
const acceptDonations = function () {

	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateEvent = store.getters.setting('DATE_EVENT');

	if (eventTimezone && dateEvent) {
		const dateDonationsStart = store.getters.setting('DATE_DONATIONS_START') ? store.getters.setting('DATE_DONATIONS_START') : dateEvent;
		const dateDonationsEnd = store.getters.setting('DATE_DONATIONS_END') ? store.getters.setting('DATE_DONATIONS_END') : dateEvent;

		const now = moment().tz(eventTimezone);
		const start = moment(new Date(dateDonationsStart)).tz(eventTimezone);
		const end = moment(new Date(dateDonationsEnd)).tz(eventTimezone);
		if (now.isBetween(start, end, 'day', '[]')) {
			return true;
		}
	}

	return false;
};

export {
	eventTitle,
	isAfterRegistrationEnd,
	isBeforeRegistrationStart,
	isDayOfEvent,
	isDayOfEventOrAfter,
	acceptRegistrations,
	acceptDonations,
	registrationStartDate
}