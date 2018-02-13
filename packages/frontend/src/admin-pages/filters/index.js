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

import fromCents from './string/fromCents'
import fromPercent from './string/fromPercent'
import money from './string/money'
import percent from './string/percent'
import toCents from './string/toCents'
import toPercent from './string/toPercent'
import zeroToEmptyString from './string/zeroToEmptyString'

const VueFilters = {
	install: function (Vue) {
		Vue.filter('fromCents', fromCents);
		Vue.filter('fromPercent', fromPercent);
		Vue.filter('money', money);
		Vue.filter('percent', percent);
		Vue.filter('toCents', toCents);
		Vue.filter('toPercent', toPercent);
		Vue.filter('zeroToEmptyString', zeroToEmptyString);
	}
};

export default VueFilters;