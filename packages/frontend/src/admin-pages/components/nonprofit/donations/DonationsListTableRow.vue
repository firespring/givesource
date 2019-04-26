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
    <tr>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ formattedDate }}</div>
            <div class="time">{{ formattedTime }}</div>
        </td>

        <td class="u-nowrap" v-if="isOfflineBulk">
            Offline ({{ donation.count }})
        </td>
        <td class="u-nowrap" v-else-if="isOffline">
            Offline
        </td>
        <td class="u-nowrap" v-else>
            Online
        </td>

        <td class="u-text-r">
            {{ formattedAmount }}
        </td>

        <td class="u-nowrap empty" v-if="isOfflineBulk"></td>
        <td v-else-if="isAnonymous">
            Anonymous
        </td>
        <td v-else>
            {{ donation.donorFirstName }} {{ donation.donorLastName }}
        </td>

        <td class="u-nowrap empty" v-if="isOfflineBulk || isAnonymous || !donation.donorEmail"></td>
        <td class="u-nowrap" v-else>
            <div class="c-user-strip u-flex u-items-center">
                <div class="c-user-strip__content">
                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="'mailto:' + donation.donorEmail">{{ donation.donorEmail }}</a>
                    </div>
                    <div class="c-user-strip__phone u-icon u-flex u-items-center" v-if="donation.donorPhone">
                        {{ donation.donorPhone }}
                    </div>
                </div>
            </div>
        </td>

        <td class="u-nowrap empty" v-if="!hasAddress || isAnonymous"></td>
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

	export default {
		computed: {
			isAnonymous() {
				return this.donation.isAnonymous;
			},

			isOffline() {
				return this.donation.isOfflineDonation;
			},

			isOfflineBulk() {
				return this.isOffline && this.donation.type === 'BULK';
			},

			hasAddress() {
				return this.donation.donorAddress1 || this.donation.donorAddress2 || this.donation.donorCity || this.donation.donorState || this.donation.donorZip;
			},

			formattedAmount() {
				return numeral(this.donation.subtotal / 100).format('$0,00.00');
			},

			formattedDate() {
				return new Date(this.donation.createdOn).toLocaleDateString();
			},

			formattedTime() {
				return new Date(this.donation.createdOn).toLocaleTimeString();
			},
		},

		props: {
			donation: {
				type: Object,
				default() {
					return {};
				}
			}
		}

	};
</script>