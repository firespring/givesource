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
            <h1 slot="title">Thanks for your donation!</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <p>
                    Thank you for supporting the causes that make Our City such a wonderful place to live, work and play – today and in the future.
                </p>

                <p>
                    Please check your email for your donation receipt from Firespring Foundation on behalf of the charity or charities you supported on Give To Our City Day.
                </p>

                <p>
                    Donations made on the Give To Our City Website are final, non-refundable charitable gifts to the Firespring Foundation, an IRS recognized 501(c)(3).  See <router-link :to="{ name: 'terms' }">Terms of Service</router-link> for more information.
                </p>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	module.exports = {
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Give To Our City - Thank You');
		},
		components: {
			'layout-footer': require('./../../layout/Footer.vue'),
			'layout-hero': require('../../layout/Hero.vue'),
			'layout-sponsors': require('./../../layout/Sponsors.vue'),
		}
	};
</script>