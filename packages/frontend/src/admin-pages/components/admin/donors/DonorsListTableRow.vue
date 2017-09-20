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
                <input type="checkbox" name="checkThisRow[]" id="checkThisRow-1" class="check-this-row" value="1">
                <label for="checkThisRow-1"></label>
            </div>
        </td>
        <td>

            <div class="u-flex">
                <div class="u-flex-expand">
                    <strong><a :href="`/donors/${ donor.name }`">{{ donor.name }}</a></strong>
                </div>
            </div>

        </td>
        <td class="u-nowrap">

            <div class="c-user-strip__email u-icon u-flex u-items-center">
                <a :href="`mailto:${ donor.email }`">{{ donor.email }}</a>
            </div>

        </td>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ donor.date }}</div>
            <div class="time">{{ donor.time }}</div>
        </td>
        <td class="u-nowrap u-text-r">
            <a :href="`/donors/${ donor.name }`">{{ donor.formatAmount }}</a>
        </td>
        <td>

            <a href="#" class="c-btn c-btn--bad c-btn--sm js-modal-trigger" rel="modal-confirm-delete"><i class="fa fa-fw fa-trash" aria-hidden="true"></i>Delete</a>

        </td>
    </tr>
</template>

<script>
	module.exports = {
		props: [
			'donor'
		]
	};
</script>