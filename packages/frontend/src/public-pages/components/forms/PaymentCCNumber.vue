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
    <div>
        <input v-if="isMobile" v-model="localValue" type="tel" :id="id" :name="name" ref="input" autocomplete="cc-number" placeholder="•••• •••• •••• ••••">
        <input v-else v-model="localValue" type="text" :id="id" :name="name" ref="input" autocomplete="cc-number" placeholder="•••• •••• •••• ••••">
        <div class="notes notes--below accepted-cc">
            <div class="cc visa" :class="{na: !displayCardType('visa')}">
                <i class="fab fa-cc-visa" aria-hidden="true"></i>
            </div>
            <div class="cc mastercard" :class="{na: !displayCardType('mastercard')}">
                <i class="fab fa-cc-mastercard" aria-hidden="true"></i>
            </div>
            <div class="cc amex" :class="{na: !displayCardType('amex')}">
                <i class="fab fa-cc-amex" aria-hidden="true"></i>
            </div>
            <div class="cc discover" :class="{na: !displayCardType('discover')}">
                <i class="fab fa-cc-discover" aria-hidden="true"></i>
            </div>
            <div class="cc dinersclub" :class="{na: !displayCardType('dinersclub')}">
                <i class="fab fa-cc-diners-club" aria-hidden="true"></i>
            </div>
        </div>
    </div>
</template>

<script>
	require('jquery.payment');

	module.exports = {
		data: function () {
			return {
				localValue: this.value ? this.value : null,
			}
		},
		computed: {
			isMobile: function () {
				return /Mobi/.test(navigator.userAgent);
			}
		},
		props: {
			value: {},
			id: {
				type: String,
				default: null
			},
			name: {
				type: String,
				default: null
			}
		},
		mounted: function () {
			const vue = this;
			$(vue.$refs.input).payment('formatCardNumber');
		},
		watch: {
			value: function (newVal) {
				this.localValue = newVal;
			},
			localValue: function () {
				this.$emit('input', this.localValue);
			}
		},
		methods: {
			displayCardType: function (cardType) {
				return !this.localValue || $.payment.cardType(this.localValue) === cardType;
			}
		}
	};
</script>