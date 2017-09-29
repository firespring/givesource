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
            <router-link :to="{ name: 'nonprofit-landing-page', params: { nonprofitUuid: nonprofit.uuid } }"><img alt="" src="/assets/temp/thumbnail.jpg"></router-link>
        </div>

        <div class="leaderboard-item__image" v-else>
            <router-link :to="{ name: 'nonprofit-landing-page-demo' }"><img alt="" src="/assets/temp/thumbnail.jpg"></router-link>
        </div>

        <div class="leaderboard-item__info" v-if="nonprofit.uuid">
            <h3><router-link :to="{ name: 'nonprofit-landing-page', params: { nonprofitUuid: nonprofit.uuid } }">{{ nonprofit.legalName }}</router-link></h3>
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

        <div class="leaderboard-item__amount">{{ donationAmount }}</div>

        <div class="leaderboard-item__action"><a href="#" class="btn btn--sm btn--green">Donate</a></div>
    </div>
</template>

<script>
	const numeral = require('numeral');

    module.exports = {
    	computed: {
		    donationAmount: function () {
			    return numeral(this.nonprofit.donationsSum / 100).format('$0,0.00');
		    }
        },
    	props: [
    		'nonprofit'
        ]
    };
</script>