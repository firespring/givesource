<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
    <div>
        <input v-if="isMobile" v-model="localValue" type="tel" :id="id" :name="name" ref="input" autocomplete="cc-number" placeholder="•••• •••• •••• ••••"
               :class="{'has-error': hasError}">
        <input v-else v-model="localValue" type="text" :id="id" :name="name" ref="input" autocomplete="cc-number" placeholder="•••• •••• •••• ••••"
               :class="{'has-error': hasError}">
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

	export default {
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
			},
			hasError: {
				type: Boolean,
				default: false
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