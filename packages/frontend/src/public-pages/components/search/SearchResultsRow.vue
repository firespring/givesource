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
    <div class="leaderboard-item leaderboard-item--detailed">

        <div class="leaderboard-item__image" v-if="nonprofit.uuid">
            <router-link :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }"><img alt="" src="/assets/temp/thumbnail.jpg"></router-link>
        </div>

        <div class="leaderboard-item__image" v-else>
            <router-link :to="{ name: 'nonprofit-landing-page-demo' }"><img alt="" src="/assets/temp/thumbnail.jpg"></router-link>
        </div>

        <div class="leaderboard-item__info" v-if="nonprofit.uuid">
            <h3><router-link :to="{ name: 'nonprofit-landing-page', params: { slug: nonprofit.slug } }">{{ nonprofit.legalName }}</router-link></h3>
            <p>
                {{ nonprofit.shortDescription }}
            </p>
        </div>

        <div class="leaderboard-item__info" v-else>
            <h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">{{ nonprofit.legalName }}</router-link></h3>
            <p>
                {{ nonprofit.shortDescription }}
            </p>
        </div>

        <div class="leaderboard-item__amount">{{ amount }}</div>

        <div class="leaderboard-item__action">
            <a v-on:click.prevent="donate" href="#" class="btn btn--sm btn--green" :class="{ 'btn--disabled': !loaded }">Donate</a>
        </div>
    </div>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {
    			loaded: false,
    			tiers: []
            };
        },
    	computed: {
		    amount: function () {
		    	return this.formatMoney(this.nonprofit.donationsSubtotal);
		    }
        },
    	props: [
    		'nonprofit'
        ],
        created: function () {
	        const vue = this;

	        if (vue.nonprofit.uuid) {
		        axios.get(API_URL + 'nonprofits/' + vue.nonprofit.uuid + '/tiers').then(function (response) {
			        response.data.sort(function (a, b) {
				        return b.amount - a.amount;
			        });
			        vue.tiers = response.data;
			        vue.loaded = true;
		        });
	        } else {
	        	vue.tiers = [
			        {
				        amount: 10000,
				        description: 'Intrinsicly enable ubiquitous opportunities for 24/365 data. Interactively predominate just in time communities via tactical e-tailers.'
			        },
			        {
				        amount: 5000,
				        description: 'Dynamically restore an expanded array of e-markets before leveraged technologies.'
			        },
			        {
				        amount: 2500,
				        description: 'Completely orchestrate impactful metrics after prospective infomediaries.'
			        },
			        {
				        amount: 1000,
				        description: 'Enthusiastically network frictionless solutions and high-payoff total linkage.'
			        }
                ];
	        	vue.loaded = true;
            }
        },
	    methods: {
		    donate: function () {
			    const vue = this;

			    if (!vue.loaded) {
			    	return;
                }

			    vue.addModal('donation-tiers', {
				    nonprofit: vue.nonprofit,
				    tiers: vue.tiers
			    });
		    }
	    }
    };
</script>