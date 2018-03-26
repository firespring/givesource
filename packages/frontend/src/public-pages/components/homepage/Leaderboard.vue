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
    <div v-if="showLeaderboard" class="leaderboard">

        <h2 class="leaderboard__title"><span>{{ eventTitle }}</span> Leaderboard</h2>

        <div class="grid">
            <div class="grid-item" v-for="(column, columnIndex) in columns">
                <div class="leaderboard-item" v-for="(nonprofit, nonprofitIndex) in column.nonprofits">
                    <div class="leaderboard-item__num">{{ position(columnIndex, nonprofitIndex) }}.</div>
                    <div class="leaderboard-item__info">
                        <h3>
                            <router-link :to="{ name: 'nonprofit-landing-page', params: {slug: nonprofit.slug} }">{{ nonprofit.legalName}}</router-link>
                        </h3>
                    </div>
                    <div class="leaderboard-item__amount">{{ formatMoney(nonprofit.donationsSubtotal) }}</div>
                </div>
            </div>
        </div>

        <div class="leaderboard__actions">
            <router-link :to="{ name: 'leaderboard' }" class="btn btn--dark btn--lg">See Full Leaderboard</router-link>
        </div>

    </div>
</template>

<script>
	const numeral = require('numeral');
	import * as Utils from './../../helpers/utils';
	import * as Settings from './../../helpers/settings';

	module.exports = {
		data: function () {
			return {
				nonprofits: [],
				columns: [],
			};
		},
		created: function () {
			const vue = this;
			axios.get(API_URL + 'nonprofits' + Utils.generateQueryString({
				size: 20,
				sort: 'active_subtotal_descending',
                includeMatchFund: 0
			})).then(function (response) {
				if (response.data.hasOwnProperty('items')) {
					vue.nonprofits = response.data.items;
				}
				const chunks = _.chunk(vue.nonprofits, Math.ceil(vue.nonprofits.length / 2));
				chunks.forEach(function (chunk) {
					vue.columns.push({
						nonprofits: chunk
					});
				});
			});
		},
		computed: {
			showLeaderboard: function () {
				return Settings.isDayOfEventOrAfter();
			},
			eventTitle: function () {
				return Settings.eventTitle();
			}
		},
		methods: {
			position: function (columnIndex, nonprofitIndex) {
				const columnSize = Math.ceil(this.nonprofits.length / 2);
				return numeral(columnIndex * columnSize + nonprofitIndex + 1).format('00');
			}
		}
	};
</script>