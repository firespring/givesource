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
    <div class="c-page-section c-page-section--headless c-page-section--shadow c-page-section--border u-margin-bottom-scale">
        <div class="c-page-section__main">
            <div class="c-leaderboard">

                <div class="c-leaderboard__metric">
                    <h6 class="metric-title">Donations</h6>
                    <div class="metric-value">
                        {{ donationsCount }}
                    </div>
                </div>

                <div class="c-leaderboard__metric">
                    <h6 class="metric-title">Donors</h6>
                    <div class="metric-value">
                        {{ donorsCount }}
                    </div>
                </div>

                <div class="c-leaderboard__metric">
                    <h6 class="metric-title">Total $</h6>
                    <div class="metric-value">
                        {{ donationsTotal }}
                    </div>
                </div>

                <div class="c-leaderboard__metric">
                    <h6 class="metric-title">Top Donation</h6>
                    <div class="metric-value">
                        {{ topDonation }}
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
	import * as Utils from './../../../helpers/utils';
	const numeral = require('numeral');

	module.exports = {
		data: function () {
			return {
				metrics: {
					'DONATIONS_COUNT': 0,
					'DONATIONS_TOTAL': 0,
					'DONORS_COUNT': 0,
					'TOP_DONATION': 0,
				}
			};
		},
        computed: {
			donationsCount: function () {
				return numeral(this.metrics.DONATIONS_COUNT).format('0,000');
            },
            donationsTotal: function () {
	            return numeral(this.metrics.DONATIONS_TOTAL / 100).format('$0,00.00');
            },
            donorsCount: function () {
	            return numeral(this.metrics.DONORS_COUNT).format('0,000');
            },
            topDonation: function () {
	            return numeral(this.metrics.TOP_DONATION / 100).format('$0,00.00');
            }
        },
		created: function () {
			const vue = this;

			axios.get(API_URL + 'metrics' + Utils.generateQueryString({keys: Object.keys(vue.metrics)})).then(function (response) {
				response.data.forEach(function (metric) {
					if (vue.metrics.hasOwnProperty(metric.key)) {
						vue.metrics[metric.key] = metric.value;
                    }
                });
			});
		}
	};
</script>