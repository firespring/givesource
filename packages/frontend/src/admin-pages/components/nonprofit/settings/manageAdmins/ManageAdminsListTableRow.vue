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
    <tr>
        <td class="input">
            <div class="checkbox checkbox--sm js-check-this-row">
                <input type="checkbox" name="checkThisRow[]" id="checkThisRow-1" class="check-this-row" value="3">
                <label for="checkThisRow-1"></label>
            </div>
        </td>
        <td class="image">
            <img width="400" height="400" alt="firespring" src="../../../../assets/photos/firespring.jpg">
        </td>
        <td>

            <div class="c-user-strip u-flex u-items-center">

                <div class="c-user-strip__content u-flex u-items-center">

                    <div class="c-user-strip__name">
                        <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                    </div>

                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="`mailto:${ user.email }`">{{ user.email }}</a>
                    </div>

                </div>

            </div>

        </td>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ date }}</div>
        </td>
        <td class="u-nowrap">
            <a href="#" role="button" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member"><i
                    class="fa fa-minus-circle" aria-hidden="true"></i>Remove</a>
        </td>
    </tr>
</template>

<script>
	module.exports = {
		computed: {
			date: function () {
				return new Date(this.user.createdOn).toLocaleDateString();
            }
        },
		props: [
			'user'
        ]
	};
</script>