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
    <div class="o-app">
        <navigation :nonprofitId="nonprofitId"></navigation>
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
                                    <a :href="landingPageUrl" rel="noreferrer noopener" target="_blank" class="c-btn c-btn--flat c-btn--sm">Preview Your Page</a>
                                </p>
                                <div class="c-page-section-nav">
                                    <router-link :to="{name: 'nonprofit-your-page', query: {tab: 'content'}}" :class="{ here: tabComponent === 'tab-content'}" active-class=""
                                                 replace>
                                        <i class="fa fa-fw fa-pencil" aria-hidden="true"></i>Edit Page Content
                                    </router-link>
                                    <router-link :to="{name: 'nonprofit-your-page', query: {tab: 'media'}}" :class="{ here: tabComponent === 'tab-media'}" active-class="" replace>
                                        <i class="fa fa-fw fa-picture-o" aria-hidden="true"></i>Manage Images &amp; Videos
                                    </router-link>
                                    <router-link :to="{name: 'nonprofit-your-page', query: {tab: 'donation-tiers'}}" :class="{ here: tabComponent === 'tab-donation-tiers'}"
                                                 active-class="" replace>
                                        <i class="fa fa-fw fa-list" aria-hidden="true"></i>Manage Donation Tiers
                                    </router-link>
                                </div>
                            </div>

                            <component :is="tabComponent" :nonprofitId="nonprofitId" :nonprofit="nonprofit" v-on:updateNonprofit="updateNonprofit"></component>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import ComponentTabContent from './tabs/Content.vue';
	import ComponentTabDonationTiers from './tabs/DonationTiers.vue';
	import ComponentTabMedia from './tabs/Media.vue';

	export default {
		data: function () {
			return {
				nonprofit: {},
				tabComponent: 'tab-content',
			}
		},
		computed: {
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
			landingPageUrl: function () {
				return this.$store.getters.setting('EVENT_URL') + '/nonprofits/' + this.nonprofit.slug;
			}
		},
		props: [
			'nonprofitId'
		],
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				if (to.query.hasOwnProperty('tab')) {
					vue.tabComponent = vue.getTabComponent(to.query.tab);
				}

				vue.$request.get('nonprofits/' + to.params.nonprofitId).then(function (response) {
					vue.nonprofit = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			if (to.query.hasOwnProperty('tab')) {
				vue.tabComponent = vue.getTabComponent(to.query.tab);
			}

			vue.$request.get('nonprofits/' + to.params.nonprofitId).then(function (response) {
				vue.nonprofit = response.data;
				next();
			}).catch(function () {
				next();
			});
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
			},
			updateNonprofit: function (nonprofit) {
				const vue = this;
				vue.nonprofit = nonprofit;
			}
		},
		components: {
			'tab-content': ComponentTabContent,
			'tab-donation-tiers': ComponentTabDonationTiers,
			'tab-media': ComponentTabMedia,
		},
	};
</script>