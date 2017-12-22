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
    <div class="c-page-section__content">
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

        <table class="table-middle js-table-reorder">
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
            <button v-on:click="submit" type="submit" class="c-btn c-btn--flat">Save Changes</button>
        </footer>

    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				donationTiers: [],
				originalDonationTiers: []
			}
		},
		props: [
			'nonprofitUuid'
		],
		beforeMount: function () {
			const vue = this;

			vue.$request.get('nonprofits/' + vue.nonprofitUuid + '/tiers').then(function (response) {
				if (response.data.errorMessage) {
					console.log(response.data);
				} else {
					response.data.sort(function (a, b) {
						return a.amount - b.amount;
					});
					vue.originalDonationTiers = JSON.parse(JSON.stringify(response.data));
					vue.donationTiers = JSON.parse(JSON.stringify(response.data));
				}
			}).catch(function (err) {
				console.log(err);
			});
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
			submit: function () {
				const vue = this;

				vue.addModal('spinner');
				vue.updateDonationTiers();
			},
			updateDonationTiers: function () {
				const vue = this;

				const original = JSON.parse(JSON.stringify(vue.originalDonationTiers));
				const donationTiers = JSON.parse(JSON.stringify(vue.donationTiers));
				const filtered = _.reject(donationTiers, {amount: '0.00'});
				const modified = _.differenceWith(filtered, original, _.isEqual);

				const toDelete = _.differenceWith(original, filtered, _.isEqual);
				const toUpdate = _.map(vue.format(_.reject(modified, {amount: '0.00'})), function (tier) {
					if (!tier.description) {
						delete tier.description;
					}
					return tier;
				});

				if (toUpdate.length && !toDelete.length) {
					vue.$request.patch('nonprofits/' + vue.nonprofitUuid + '/tiers', {
						donation_tiers: toUpdate
					}).then(function () {
						vue.clearModals();
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});
				} else if (toDelete.length && !toUpdate.length) {
					vue.$request.delete('nonprofits/' + vue.nonprofitUuid + '/tiers', {
						donation_tiers: toDelete
					}).then(function () {
						vue.clearModals();
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});
				} else if (toUpdate.length && toDelete.length) {
					vue.$request.delete('nonprofits/' + vue.nonprofitUuid + '/tiers', {
						donation_tiers: toDelete
					}).then(function () {
						return vue.$request.patch('nonprofits/' + vue.nonprofitUuid + '/tiers', {
							donation_tiers: toUpdate
						});
					}).then(function () {
						vue.clearModals();
					}).catch(function (err) {
						vue.clearModals();
						console.log(err);
					});
				} else {
					vue.clearModals();
				}
			},
			format: function (donationTiers) {
				const formatted = [];
				donationTiers.forEach(function (donationTier, index) {
					formatted.push(donationTier);
					formatted[index].amount = Math.round(Number.parseFloat(donationTier.amount) * 100);
				});
				return formatted;
			},
			changeDonationTier: function (index, values) {
				const vue = this;

				vue.donationTiers[index].amount = values.amount;
				vue.donationTiers[index].description = values.description;
			},
		},
		components: {
			'donation-tiers-list-table-row': require('./../donationTiers/DonationTiersListTableRow.vue')
		}
	};
</script>
