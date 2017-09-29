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
        <layout-hero :presentedBy="true">
            <h1 slot="title">Nonprofit Search Results</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <search-results-header></search-results-header>

                <div class="leaderboard">
                    <search-results-row v-for="nonprofit in nonprofits" :nonprofit="nonprofit"></search-results-row>
                </div>

                <div class="pagination flex justify-center items-center">
                    <a href="#" class="prev"><i class="fa fa-fw fa-chevron-left" aria-hidden="true"></i>Prev</a>
                    <a href="#" class="here">1</a>
                    <a href="#">2</a>
                    <a href="#">3</a>
                    <a href="#">4</a>
                    <a href="#">5</a>
                    <a href="#" class="next">Next<i class="fa fa-fw fa-chevron-right" aria-hidden="true"></i></a>
                </div>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				nonprofits: []
            };
        },
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Give to Lincoln Day Search');
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				axios.get(API_URL + 'nonprofits').then(function (response) {
					vm.nonprofits = response.data;
				}).then(function () {
					while (vm.nonprofits.length < 10) {
						vm.nonprofits.push({
                            legalName: 'Demo Nonprofit',
                            donationsSum: 12345,
                            shortDescription: 'Dramatically productivate fully researched applications through value-added products. Monotonectally incubate market positioning testing procedures after adaptive results.',
                        });
                    }
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'nonprofits').then(function (response) {
				vue.nonprofits = response.data;
			}).then(function () {
				while (vue.nonprofits.length < 10) {
					vue.nonprofits.push({
						legalName: 'Demo Nonprofit',
						donationsSum: 12345,
						shortDescription: 'Dramatically productivate fully researched applications through value-added products. Monotonectally incubate market positioning testing procedures after adaptive results.',
					});
				}
			}).then(function () {
                next();
			}).catch(function () {
				next();
			});
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
            'search-results-header': require('./SearchResultsHeader.vue'),
            'search-results-row': require('./SearchResultsRow.vue')
		}
	};
</script>