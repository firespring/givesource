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
    <div class="o-menubar__secondary">

        <ul>
            <router-link tag="li" :to="{ name: 'nonprofit-donations-list', params: { nonprofitUuid: nonprofitUuid } }">
                <a><i class="fa fa-fw fa-credit-card" aria-hidden="true"></i>Donations</a>
            </router-link>
            <router-link tag="li" :to="{ name: 'nonprofit-your-page', params: { nonprofitUuid: nonprofitUuid } }">
                <a><i class="fa fa-fw fa-bank" aria-hidden="true"></i>Your Page</a>
            </router-link>
            <router-link tag="li" :to="{ name: 'nonprofit-settings-list', params: { nonprofitUuid: nonprofitUuid } }">
                <a><i class="fa fa-fw fa-cogs" aria-hidden="true"></i>Settings</a>
            </router-link>
            <!--<router-link tag="li" :to="{ name: 'nonprofit-help', params: { nonprofitUuid: nonprofitUuid } }">-->
                <!--<a><i class="fa fa-fw fa-question-circle" aria-hidden="true"></i>Help</a>-->
            <!--</router-link>-->
        </ul>

        <select class="js-menubar-nav-select">
            <option value="#" selected>Donations</option>
            <option value="#">Your Page</option>
            <option value="#">Settings</option>
        </select>

    </div>
</template>

<script>
    module.exports = {
    	props: [
    		'nonprofitUuid'
        ]
    }
</script>