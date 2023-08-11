/*
 * Copyright 2019 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import store from './../store'
import dayjs from './../helpers/day'

/**
 * Get event title
 *
 * @returns {String}
 */
const eventTitle = function () {
  let title = store.getters.setting('EVENT_TITLE')
  if (title === null || title === '') {
    title = 'Give to Our City'
  }
  return title
}

/**
 * Get Event start date
 *
 * @return {Object|null}
 */
const eventStartDate = function () {
  const eventTimezone = store.getters.setting('EVENT_TIMEZONE')
  const dateEventStart = store.getters.setting('DATE_EVENT_START')

  if (dateEventStart && eventTimezone) {
    return dayjs(new Date(dateEventStart)).startOf('day').tz(eventTimezone, true)
  }

  return null
}

/**
 * Get Event end date
 *
 * @return {Object|null}
 */
const eventEndDate = function () {
  const eventTimezone = store.getters.setting('EVENT_TIMEZONE')
  const dateEventEnd = store.getters.setting('DATE_EVENT_END')

  if (dateEventEnd && eventTimezone) {
    return dayjs(new Date(dateEventEnd)).endOf('day').tz(eventTimezone, true)
  }

  return null
}

/**
 * Is it before the event?
 *
 * @returns {boolean}
 */
const isBeforeEvent = function () {
  const start = eventStartDate()

  if (start) {
    const now = dayjs()
    return now.isBefore(start, 'day')
  }

  return false
}

/**
 * Is it the during the event?
 *
 * @returns {boolean}
 */
const isDuringEvent = function () {
  const start = eventStartDate()
  const end = eventEndDate()

  if (start && end) {
    const now = dayjs()
    return now.isBetween(start, end, 'day', '[]')
  }

  return false
}

/**
 * Is it after the event?
 *
 * @returns {boolean}
 */
const isAfterEvent = function () {
  const end = eventEndDate()

  if (end) {
    const now = dayjs()
    return now.isAfter(end, 'day')
  }

  return false
}

/**
 * Get countdown until event start
 *
 * @returns {Object}
 */
const countdownUntilEventStart = function () {
  return _getCountdown(eventStartDate())
}

/**
 * Get countdown until event end
 *
 * @returns {Object}
 */
const countdownUntilEventEnd = function () {
  return _getCountdown(eventEndDate())
}

/**
 * Get registration start date
 *
 * @returns {Object|null}
 */
const registrationStartDate = function () {
  const eventTimezone = store.getters.setting('EVENT_TIMEZONE')
  const dateEventStart = eventStartDate()
  const dateRegistrationsStart = store.getters.setting('DATE_REGISTRATIONS_START')

  if (dateRegistrationsStart) {
    return dayjs(new Date(dateRegistrationsStart)).startOf('day').tz(eventTimezone, true)
  } else if (eventTimezone && dateEventStart) {
    return dateEventStart.subtract(30, 'days')
  }

  return null
}

/**
 * Get registration end date
 *
 * @returns {Object|null}
 */
const registrationEndDate = function () {
  const eventTimezone = store.getters.setting('EVENT_TIMEZONE')
  const dateEventStart = eventStartDate()
  const dateRegistrationsEnd = store.getters.setting('DATE_REGISTRATIONS_END')

  if (dateRegistrationsEnd) {
    return dayjs(new Date(dateRegistrationsEnd)).endOf('day').tz(eventTimezone, true)
  } else if (eventTimezone && dateEventStart) {
    return dateEventStart.subtract(1, 'days').endOf('day')
  }

  return null
}

/**
 * Has nonprofit registration started?
 *
 * @returns {boolean}
 */
const isBeforeRegistrations = function () {
  const start = registrationStartDate()

  if (start) {
    const now = dayjs()
    return now.isBefore(start, 'day')
  }

  return false
}

/**
 * Is nonprofit registration active?
 *
 * @returns {boolean}
 */
const isDuringRegistrations = function () {
  const start = registrationStartDate()
  const end = registrationEndDate()

  if (start && end) {
    const now = dayjs()
    return now.isBetween(start, end, 'day', '[]')
  }

  return false
}

/**
 * Has nonprofit registration ended?
 *
 * @returns {boolean}
 */
const isAfterRegistrations = function () {
  const end = registrationEndDate()

  if (end) {
    const now = dayjs()
    return now.isAfter(end, 'day')
  }

  return false
}

/**
 * Get donations start date
 *
 * @return {Object|null}
 */
const donationsStartDate = function () {
  const eventTimezone = store.getters.setting('EVENT_TIMEZONE')
  const dateDonationsStart = store.getters.setting('DATE_DONATIONS_START')

  if (dateDonationsStart && eventTimezone) {
    return dayjs(new Date(dateDonationsStart)).startOf('day').tz(eventTimezone, true)
  }

  return null
}

/**
 * Get donations end date
 *
 * @return {Object|null}
 */
const donationsEndDate = function () {
  const eventTimezone = store.getters.setting('EVENT_TIMEZONE')
  const dateDonationsEnd = store.getters.setting('DATE_DONATIONS_END')

  if (dateDonationsEnd && eventTimezone) {
    return dayjs(new Date(dateDonationsEnd)).endOf('day').tz(eventTimezone, true)
  }

  return null
}

/**
 * Can donations be submitted?
 *
 * @returns {boolean}
 */
const isDuringDonations = function () {
  const start = donationsStartDate()
  const end = donationsEndDate()

  if (start && end) {
    const now = dayjs()
    return now.isBetween(start, end, 'day', '[]')
  }

  return false
}

/**
 * Get an object representing a countdown until a certain date
 *
 * @param {Object} date
 * @return {{days: number, hours: number, minutes: number, seconds: number}}
 * @private
 */
const _getCountdown = function (date) {
  const countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 }

  if (date) {
    const now = dayjs()
    const distance = date.diff(now)

    countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24))
    countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000)
  }

  return countdown
}

export {
  donationsEndDate,
  donationsStartDate,
  countdownUntilEventEnd,
  countdownUntilEventStart,
  eventEndDate,
  eventStartDate,
  eventTitle,
  isAfterEvent,
  isAfterRegistrations,
  isBeforeEvent,
  isBeforeRegistrations,
  isDuringDonations,
  isDuringEvent,
  isDuringRegistrations,
  registrationStartDate
}
