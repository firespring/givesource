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
const isRegistrationActive = function () {

	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateRegistrationsStart = store.getters.setting('DATE_REGISTRATIONS_START');
	const dateRegistrationsEnd = store.getters.setting('DATE_REGISTRATIONS_END');

	if (eventTimezone) {
		let now = moment().tz(eventTimezone);
		if (dateRegistrationsStart && isBeforeRegistrationStart()) {
			return false;
		}

		if (dateRegistrationsEnd && isAfterRegistrationEnd()) {
			return false;
		}
	}

	return true;
};

/**
 * Has nonprofit registration started yet?
 *
 * @returns {boolean}
 */
const isBeforeRegistrationStart = function () {

	const eventTimezone = store.getters.setting('EVENT_TIMEZONE');
	const dateRegistrationsStart = store.getters.setting('DATE_REGISTRATIONS_START');

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
	const dateRegistrationsEnd = store.getters.setting('DATE_REGISTRATIONS_END');

	if (eventTimezone && dateRegistrationsEnd) {
		let now = moment().tz(eventTimezone);
		if (now.isAfter(moment(new Date(dateRegistrationsEnd)).tz(eventTimezone).endOf('day'))) {
			return true;
		}
	}

	return false;
};

export {
	isRegistrationActive,
	isBeforeRegistrationStart,
	isAfterRegistrationEnd
}