<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <tr>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ formattedDate }}</div>
            <div class="time">{{ formattedTime }}</div>
        </td>

        <td class="u-text-r">
            {{ formattedAmount }}
        </td>

        <td v-if="donation.isAnonymous">
            Anonymous
        </td>

        <td v-else>
            {{ donation.donorFirstName }} {{ donation.donorLastName}}
        </td>

        <td v-if="donation.isAnonymous"></td>

        <td v-else-if="donation.isOfflineDonation">
            <div class="c-user-strip u-flex u-items-center" v-if="donation.donorEmail">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="'mailto:' + donation.donorEmail">{{ donation.donorEmail }}</a>
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap" v-else>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="'mailto:' + donation.donorEmail">{{ donation.donorEmail }}</a>
                    </div>
                    <div class="c-user-strip__phone u-icon u-flex u-items-center">
                        {{ donation.donorPhone }}
                    </div>
                </div>
            </div>
        </td>

        <td v-if="donation.isAnonymous"></td>

        <td v-else-if="donation.isOfflineDonation">
            Offline Donation
        </td>

        <td class="u-nowrap" v-else>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__address u-icon u-flex">
                        {{ donation.donorAddress1 }}<br v-if="donation.donorAddress2">
                        {{ donation.donorAddress2 }}<br v-if="donation.donorCity || donation.donorState || donation.donorZip">
                        {{ donation.donorCity }}, {{ donation.donorState }} {{ donation.donorZip }}
                    </div>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
	const numeral = require('numeral');

	module.exports = {
		computed: {
			formattedAmount: function () {
				return numeral(this.donation.subtotal / 100).format('$0,00.00');
			},
			formattedDate: function () {
				return new Date(this.donation.createdOn).toLocaleDateString();
			},
			formattedTime: function () {
				return new Date(this.donation.createdOn).toLocaleTimeString();
			},
		},
		props: {
			donation: {
				type: Object,
				default: function () {
					return {};
				}
			}
		}
	};
</script>