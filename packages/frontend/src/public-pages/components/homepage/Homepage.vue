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
            <h1 slot="title">Phosfluorescently repurpose stand-alone outsourcing</h1>

            <strong>Please make your gift now, before midnight.</strong>
            Every gift you make is even more meaningful because agencies will receive a share of the $350,000 match fund.
        </layout-hero>

        <main class="main">
            <div class="wrapper">

                <metrics></metrics>

                <div class="main__content">

                    <div class="main__content-text wrapper wrapper--sm">
                        <p>
                            Give To Our City is your chance to make a real impact on our city’s quality of life. We encourage everyone to join us for a record-setting day of giving on May 18th from 12:00am to 11:59pm. Together, we have the power to support local nonprofit organizations and improve lives. Every donation you make on May 18th helps your favorite charities even more because they will also receive a proportional share of our $350,000 challenge match fund.
                        </p>
                        <p>
                            Gifts can be made online at this site beginning May 1st and will qualify for Give To Our City and matching funds.
                        </p>
                    </div>

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
                nonprofits: [],
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