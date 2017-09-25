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
        <navigation></navigation>
        <!-- BEGIN app main -->
        <main class="o-app__main o-app__main--compact">

            <!-- BEGIN app main content wrapper -->
            <div class="o-app_main-content o-app_main-content--md">

                <!-- BEGIN page header -->
                <div class="o-page-header">

                    <div class="o-page-header__text">

                        <nav class="o-page-header-nav c-breadcrumb">

                            <!--<span><a href="../../giving-day-foundation/sponsors/">Sponsors</a></span><span><a href="../../giving-day-foundation/sponsors/tier.php">Gold</a></span>-->
                            <span><router-link :to="{ name: 'sponsors-list' }">Sponsors</router-link></span><span><router-link :to="{ name: 'manage-tier' }">Gold</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Add Sponsor</h1>
                    </div>

                </div>
                <!-- END page header -->

                <sponsor-add-form></sponsor-add-form>

            </div>
            <!-- END app main content wrapper -->

        </main>
        <!-- END app main -->

    </div>
</template>
<script>
	module.exports = {
		components: {
			'sponsor-add-form': require('./SponsorAddForm.vue')
		}
	};
</script>