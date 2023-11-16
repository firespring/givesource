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

/* ============================================================================
 Floating labels for text inputs
 ============================================================================ */
const directive = {
  mounted: function (el) {
    const $el = $(el)

    $el.find('input, textarea').each(function () {
      if ($(this).val() !== '' || $(this).is(':focus')) {
        $(this).siblings('label').hide()
        $(this).parents('.js-floating-label').addClass('has-floating-label--float').find('label').show()
      }

      $(this).on('change', function () {
        if ($(this).val() === '') {
          $(this).parents('.js-floating-label').removeClass('has-floating-label--float')
        } else {
          $(this).siblings('label').hide()
          $(this).parents('.js-floating-label').addClass('has-floating-label--float').find('label').show()
        }
      })
    })

    $el.find('input, textarea').on('focus', function () {
      $(this).parents('.js-floating-label').addClass('has-floating-label--float')
    })

    $el.find('input, textarea').on('blur', function () {
      if ($(this).val() === '') {
        $(this).parents('.js-floating-label').removeClass('has-floating-label--float')
      }
    })
  },
  updated: function (el) {
    const $el = $(el)

    $el.find('input, textarea').each(function () {
      if ($(this).val() !== '' || $(this).is(':focus')) {
        $(this).siblings('label').hide()
        $(this).parents('.js-floating-label').addClass('has-floating-label--float').find('label').show()
      }
    })
  },
  componentUpdated: function (el) {
    const $el = $(el)

    $el.find('input, textarea').each(function () {
      if ($(this).val() !== '' || $(this).is(':focus')) {
        $(this).siblings('label').hide()
        $(this).parents('.js-floating-label').addClass('has-floating-label--float').find('label').show()
      }
    })
  }
}

export default directive
