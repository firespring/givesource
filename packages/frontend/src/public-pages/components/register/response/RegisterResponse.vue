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
            <h1 slot="title">Thank You for Registering</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <p>
                    Thank you for registering! We will get back to you over email as soon as we have reviewed your submission.
                </p>

                <router-link :to="{ name: 'homepage' }"> Click here to return to the home page.</router-link>

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
			'layout-hero': require('./../../layout/Hero.vue'),
			'layout-sponsors': require('./../../layout/Sponsors.vue'),
		}
	};
</script>