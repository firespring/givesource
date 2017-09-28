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
    <div class="donation-option">
        <a v-on:click="selectTier"  href="#">
            <h2 class="donation-option__title">{{ amount }}</h2>
            <div class="donation-option__description">
                {{ donationTier.description }}
            </div>
        </a>
    </div>
</template>

<script>
	module.exports = {
		computed: {
			amount: function () {
				return this.formatMoney(this.donationTier.amount);
			}
		},
		props: {
			donationTier: {}
		},
		methods: {
			selectTier: function (event) {
				event.preventDefault();
				const vue = this;

				vue.$emit('selectTier', vue.donationTier.amount);
			}
		}
	};
</script>