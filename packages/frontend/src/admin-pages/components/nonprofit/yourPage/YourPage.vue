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
    <div class="o-app">
        <navigation :nonprofitUuid="nonprofitUuid"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content">
                <div class="o-app-main-content">

                    <div class="o-page-header" v-if="isAdmin">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{ name: 'nonprofits-list' }">Nonprofits</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title" v-if="nonprofit.legalName">Manage {{ nonprofit.legalName }}'s Donation Page</h1>
                        </div>
                    </div>

                    <div class="c-page-section c-page-section--border c-page-section--shadow c-page-section--sidebar c-page-section--headless" style="margin-top: 0;">
                        <div class="c-page-section__main">

                            <div class="c-page-section__sidebar">
                                <p class="u-text-c">
                                    <a :href="pageLink" rel="noreferrer noopener" target="_blank" class="c-btn c-btn--flat c-btn--sm">Preview Your Page</a>
                                </p>
                                <div class="c-page-section-nav">
                                    <router-link :to="{name: 'nonprofit-your-page', query: {tab: 'content'}}" :class="{ here: tabComponent === 'tab-content'}" active-class=""
                                                 replace>
                                        <i class="fa fa-fw fa-pencil" aria-hidden="true"></i>Edit Page Content
                                    </router-link>
                                    <router-link :to="{name: 'nonprofit-your-page', query: {tab: 'media'}}" :class="{ here: tabComponent === 'tab-media'}" active-class="" replace>
                                        <i class="fa fa-fw fa-picture-o" aria-hidden="true"></i>Manage Photos &amp; Videos
                                    </router-link>
                                    <router-link :to="{name: 'nonprofit-your-page', query: {tab: 'donation-tiers'}}" :class="{ here: tabComponent === 'tab-donation-tiers'}"
                                                 active-class="" replace>
                                        <i class="fa fa-fw fa-list" aria-hidden="true"></i>Manage Donation Tiers
                                    </router-link>
                                </div>
                            </div>

                            <component :is="tabComponent" :nonprofitUuid="nonprofitUuid" :nonprofit.sync="nonprofit"></component>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				nonprofit: {},
				tabComponent: 'tab-content',
				pageLink: PUBLIC_PAGES_CLOUDFRONT_URL + '/nonprofits/' + this.nonprofitUuid,
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
		},
		props: [
			'nonprofitUuid'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				if (to.query.hasOwnProperty('tab')) {
					vm.tabComponent = vm.getTabComponent(to.query.tab);
				}

				axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid).then(function (response) {
					vm.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			if (to.query.hasOwnProperty('tab')) {
				vue.tabComponent = vue.getTabComponent(to.query.tab);
			}

			axios.get(API_URL + 'nonprofits/' + to.params.nonprofitUuid).then(function (response) {
				vue.nonprofit = response.data;
			}).then(function () {
				next();
			}).catch(function () {
				next();
			});
		},
		components: {
			'tab-content': require('./tabs/Content.vue'),
			'tab-media': require('./tabs/Media.vue'),
			'tab-donation-tiers': require('./tabs/DonationTiers.vue')
		},
		methods: {
			getTabComponent: function (query) {
				switch (query) {
					case 'media':
						return 'tab-media';
					case 'donation-tiers':
						return 'tab-donation-tiers';
					default:
					case 'content':
						return 'tab-content';
				}
			}
		}
	};
</script>