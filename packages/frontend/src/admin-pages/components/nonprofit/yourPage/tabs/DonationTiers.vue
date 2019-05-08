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
                                           :key="donationTier.uuid" v-on:change="changeDonationTier">
            </donation-tiers-list-table-row>
            </tbody>
        </table>

        <footer class="c-form-actions">
            <button v-on:click.prevent="submit" type="submit" class="c-btn c-btn--flat">Save Changes</button>
        </footer>

    </div>
</template>

<script>
	import ComponentDonationTiersListTableRow from './../donationTiers/DonationTiersListTableRow.vue';

	export default {
		data() {
			return {
				donationTiers: [],
				original: [],
				apiError: {}
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeMount() {
			this.fetchDonationTiers();
		},
		watch: {
			donationTiers: {
				handler() {
					const vm = this;
					const current = JSON.parse(JSON.stringify(vm.donationTiers));
					const emptyRows = _.filter(current, {amount: '0.00', description: ''}).length;
					if (emptyRows === 0 && current.length < 4) {
						vm.donationTiers.push({amount: '0.00', description: ''});
					} else if (emptyRows > 1) {
						vm.donationTiers = _.reject(current, {amount: '0.00', description: ''});
					}
				},
				deep: true
			}
		},
		methods: {
			fetchDonationTiers() {
				const vm = this;

				return vm.$request.get('nonprofits/' + vm.nonprofitUuid + '/tiers').then(response => {
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
					} else {
						response.data.sort((a, b) => {
							return a.amount - b.amount;
						});
						response.data = response.data.map(tier => {
							tier.description = tier.description === null ? '' : tier.description;
							return tier;
						});
						vm.original = JSON.parse(JSON.stringify(response.data));
						vm.donationTiers = JSON.parse(JSON.stringify(response.data));
					}
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			},
			submit() {
				const vm = this;

				if (vm.validateDonationTiers()) {
					vm.addModal('spinner');
					vm.updateDonationTiers();
				}
			},
			validateDonationTiers() {
				const vm = this;
				const donationTiers = JSON.parse(JSON.stringify(vm.donationTiers));
				const emptyRows = _.filter(donationTiers, {amount: '0.00'}).length;
				const donationTiersLessThanTen = _.filter(donationTiers, donationTierRow => {
					return donationTierRow.amount < 10;
				}).length;

				if (emptyRows === 0 && donationTiers.length === 4 && donationTiersLessThanTen >= 1) {
					return false;
				} else if (emptyRows === 1 && donationTiers.length > 1 && donationTiersLessThanTen > 1) {
					return false;
				}
				return true;
			},
			updateDonationTiers() {
				const vm = this;

				const original = JSON.parse(JSON.stringify(vm.original));
				const current = JSON.parse(JSON.stringify(vm.donationTiers)).map(tier => {
					tier.amount = Math.round(parseFloat(tier.amount) * 100);
					return tier;
				});

				let created = _.filter(current, tier => {
					return !tier.hasOwnProperty('uuid') && tier.amount !== 0;
				});

				let deleted = [];
				let updated = [];
				let changed = _.differenceWith(original, current, _.isEqual);
				changed.forEach(tier => {
					const donationTier = _.find(current, {uuid: tier.uuid});
					if (donationTier && donationTier.amount !== 0) {
						updated.push(donationTier);
					} else {
						deleted.push(tier);
					}
				});

				let promise = Promise.resolve();
				if (created.length) {
					created.forEach(donationTier => {
						promise = promise.then(() => {
							return vm.$request.post('nonprofits/' + vm.nonprofitUuid + '/tiers', donationTier);
						});
					});
				}
				if (updated.length) {
					promise = promise.then(() => {
						return vm.$request.patch('nonprofits/' + vm.nonprofitUuid + '/tiers', {
							donation_tiers: updated.map(donationTier => {
								return _.pick(donationTier, ['uuid', 'amount', 'description']);
							}),
						});
					});
				}
				if (deleted.length) {
					promise = promise.then(() => {
						return vm.$request.delete('nonprofits/' + vm.nonprofitUuid + '/tiers', {
							donation_tiers: deleted
						}).then(() => {
							vm.donationTiers = _.reject(vm.donationTiers, donationTier => {
								return _.find(deleted, {uuid: donationTier.uuid});
							});
						})
					});
				}

				promise.then(() => {
					return vm.fetchDonationTiers();
				}).then(() => {
					vm.clearModals();
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},
			changeDonationTier(index, values) {
				const vm = this;

				vm.donationTiers[index].amount = values.amount;
				vm.donationTiers[index].description = values.description;
			}
		},
		components: {
			'donation-tiers-list-table-row': ComponentDonationTiersListTableRow,
		}
	};
</script>
