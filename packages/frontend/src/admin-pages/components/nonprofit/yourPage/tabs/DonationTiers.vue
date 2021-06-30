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
    <div class="c-page-section__content">
        <api-error v-model="apiError"></api-error>
        <div class="c-alert c-alert--info c-alert--expand u-flex u-justify-center">

            <div class="c-alert__body u-flex u-justify-between">
                <div class="c-alert__text">
                    <p>
                        <strong>You can specify up to 4 donation tiers for your page.</strong>
                        Be sure to include details about how each donation tier can impact your organization to give potential donors more information about your needs and goals.
                    </p>
                </div>
            </div>

        </div>

        <table class="js-table-reorder">
            <thead>
            <tr>
                <th>
                    Amount
                </th>
                <th class="u-width-100p">
                    What will donations of this amount do for your organization? (100 characters or less)
                </th>
            </tr>
            </thead>

            <tbody class="ui-sortable">
            <donation-tiers-list-table-row v-for="(donationTier, index) in donationTiers" :index="index" :amount="donationTier.amount" :description="donationTier.description"
                                           :key="donationTier.id" v-on:change="changeDonationTier">
            </donation-tiers-list-table-row>
            </tbody>
        </table>

        <footer class="c-form-actions">
            <button v-on:click="submit" type="submit" class="c-btn c-btn--flat">Save Changes</button>
        </footer>

    </div>
</template>

<script>
	import ComponentDonationTiersListTableRow from './../donationTiers/DonationTiersListTableRow.vue';

	export default {
		data: function () {
			return {
				donationTiers: [],
				original: [],
				apiError: {}
			}
		},
		props: [
			'nonprofitId'
		],
		beforeMount: function () {
			const vue = this;
			vue.fetchDonationTiers();
		},
		watch: {
			donationTiers: {
				handler: function () {
					const vue = this;
					const current = JSON.parse(JSON.stringify(vue.donationTiers));
					const emptyRows = _.filter(current, {amount: '0.00', description: ''}).length;
					if (emptyRows === 0 && current.length < 4) {
						vue.donationTiers.push({amount: '0.00', description: ''});
					} else if (emptyRows > 1) {
						vue.donationTiers = _.reject(current, {amount: '0.00', description: ''});
					}
				},
				deep: true
			}
		},
		methods: {
			fetchDonationTiers: function () {
				const vue = this;

				return vue.$request.get('nonprofits/' + vue.nonprofitId + '/tiers').then(function (response) {
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						response.data.sort(function (a, b) {
							return a.amount - b.amount;
						});
						response.data = response.data.map(function (tier) {
							tier.description = tier.description === null ? '' : tier.description;
							return tier;
						});
						vue.original = JSON.parse(JSON.stringify(response.data));
						vue.donationTiers = JSON.parse(JSON.stringify(response.data));
					}
				}).catch(function (err) {
					vue.apiError = err.response.data.errors;
				});
			},
			submit: function () {
				const vue = this;

				if (vue.validateDonationTiers()) {
					vue.addModal('spinner');
					vue.updateDonationTiers();
				}
			},
			validateDonationTiers: function () {
				const vue = this;
				const donationTiers = JSON.parse(JSON.stringify(vue.donationTiers));
				const emptyRows = _.filter(donationTiers, {amount: '0.00'}).length;
				const donationTiersLessThanTen = _.filter(donationTiers, function (donationTierRow) {
					return donationTierRow.amount < 10;
				}).length;

				if (emptyRows === 0 && donationTiers.length === 4 && donationTiersLessThanTen >= 1) {
					return false;
				} else if (emptyRows === 1 && donationTiers.length > 1 && donationTiersLessThanTen > 1) {
					return false;
				}
				return true;
			},
			updateDonationTiers: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.original));
				const current = JSON.parse(JSON.stringify(vue.donationTiers)).map(function (tier) {
					tier.amount = Math.round(parseFloat(tier.amount) * 100);
					return tier;
				});

				let created = _.filter(current, function (tier) {
					return !tier.hasOwnProperty('id') && tier.amount !== 0;
				});

				let deleted = [];
				let updated = [];
				let changed = _.differenceWith(original, current, _.isEqual);
				changed.forEach(function (tier) {
					const donationTier = _.find(current, {id: tier.id});
					if (donationTier && donationTier.amount !== 0) {
						updated.push(donationTier);
					} else {
						deleted.push(tier);
					}
				});

				let promise = Promise.resolve();
				if (created.length) {
					created.forEach(function (donationTier) {
						promise = promise.then(function () {
							return vue.$request.post('nonprofits/' + vue.nonprofitId + '/tiers', donationTier);
						});
					});
				}
				if (updated.length) {
					promise = promise.then(function () {
						return vue.$request.patch('nonprofits/' + vue.nonprofitId + '/tiers', {
							donation_tiers: updated.map(function (donationTier) {
								return _.pick(donationTier, ['id', 'amount', 'description']);
							}),
						});
					});
				}
				if (deleted.length) {
					promise = promise.then(function () {
						return vue.$request.delete('nonprofits/' + vue.nonprofitId + '/tiers', {
							donation_tiers: deleted
						}).then(function () {
							vue.donationTiers = _.reject(vue.donationTiers, function (donationTier) {
								return _.find(deleted, {id: donationTier.id});
							});
						})
					});
				}

				promise.then(function () {
					return vue.fetchDonationTiers();
				}).then(function () {
					vue.clearModals();
				}).catch(function (err) {
					vue.clearModals();
					vue.apiError = err.response.data.errors;
				});
			},
			changeDonationTier: function (index, values) {
				const vue = this;

				vue.donationTiers[index].amount = values.amount;
				vue.donationTiers[index].description = values.description;
			}
		},
		components: {
			'donation-tiers-list-table-row': ComponentDonationTiersListTableRow,
		}
	};
</script>
