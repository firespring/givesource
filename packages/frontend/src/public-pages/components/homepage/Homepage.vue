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
            <img alt="" :src="spotlightImage" slot="spotlight">

            <strong>Please make your gift now, before midnight.</strong>
            Every gift you make is even more meaningful because agencies will receive a share of the $350,000 match fund.
        </layout-hero>

        <main class="main">
            <div class="wrapper">

                <metrics></metrics>

                <div class="main__content">
                    <leaderboard></leaderboard>
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
			    spotlightImage: '/assets/temp/logo-gtld.png',
            }
        },
	    beforeMount: function () {
		    const vue = this;

		    vue.setBodyClasses('home', 'home--live');
		    vue.setPageTitle('Give to Lincoln Day');
	    },
        components: {
            'layout-footer': require('./../layout/Footer.vue'),
	        'layout-hero': require('../layout/Hero.vue'),
	        'layout-sponsors': require('../layout/Sponsors.vue'),
            'leaderboard': require('./Leaderboard.vue'),
            'metrics': require('./Metrics.vue'),
        }
    };
</script>