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

/* ============================================================================
 Floating labels for text inputs
 ============================================================================ */
exports.floatingLabel = {
	inserted: function (el, binding) {
		const $el = $(el);

		$el.find('input, textarea').each(function () {

			if ($(this).val() !== ''  || $(this).is(':focus')) {
				$(this).siblings('label').hide();
				$(this).parents('.js-floating-label').addClass('has-floating-label--float').find('label').show();
			}

			$(this).on('change', function () {
				if ($(this).val() === '') {
					$(this).parents('.js-floating-label').removeClass('has-floating-label--float');
				} else {
					$(this).siblings('label').hide();
					$(this).parents('.js-floating-label').addClass('has-floating-label--float').find('label').show();
				}
			});

		});

		$el.find('input, textarea').on('focus', function () {
			$(this).parents('.js-floating-label').addClass('has-floating-label--float');
		});

		$el.find('input, textarea').on('blur', function () {
			if ($(this).val() === '') {
				$(this).parents('.js-floating-label').removeClass('has-floating-label--float');
			}
		});

	}
};

/* ============================================================================
 Autofocus on form inputs
 ============================================================================ */
exports.autoFocus = {
	inserted: function (el, binding) {
		const $el = $(el);
		$el.focus();
	}
};