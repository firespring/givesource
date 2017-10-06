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
            <router-link tag="li" :to="{ name: 'donations-list' }">
                <a><i class="fa fa-fw fa-credit-card" aria-hidden="true"></i>Donations</a>
            </router-link>
            <router-link tag="li" :to="{ name: 'nonprofits-list' }">
                <a><i class="fa fa-fw fa-bank" aria-hidden="true"></i>Nonprofits</a>
            </router-link>
            <router-link tag="li" :to="{ name: 'sponsors-tiers-list' }">
                <a><i class="fa fa-fw fa-star" aria-hidden="true"></i>Sponsors</a>
            </router-link>
            <router-link tag="li" :to="{ name: 'pages-list' }">
                <a><i class="fa fa-fw fa-files-o" aria-hidden="true"></i>Pages</a>
            </router-link>
            <!--<router-link tag="li" :to="{ name: 'reports' }">-->
                <!--<a><i class="fa fa-fw fa-bar-chart" aria-hidden="true"></i>Reports</a>-->
            <!--</router-link>-->
            <router-link tag="li" :to="{ name: 'settings-list' }">
                <a><i class="fa fa-fw fa-cogs" aria-hidden="true"></i>Settings</a>
            </router-link>
            <!--<router-link tag="li" :to="{ name: 'help' }">-->
                <!--<a><i class="fa fa-fw fa-question-circle" aria-hidden="true"></i>Help</a>-->
            <!--</router-link>-->
        </ul>

        <select v-on:change="mobileSelect"  v-model="selected" >
            <option value="donations-list">Donations</option>
            <option value="nonprofits-list">Nonprofits</option>
            <option value="sponsors-tiers-list">Sponsors</option>
            <option value="pages-list">Pages</option>
            <option value="settings-list">Settings</option>
        </select>

    </div>
</template>

<script>
    module.exports = {
    	data: function(){
    	    return {
    	    	selected: ''
            };
        },
    	methods:{
    		mobileSelect: function(){
                const vue = this;
                vue.$router.push({name: vue.selected});

            }
        },
    	props: [
    		'nonprofitUuid'
        ]
    }
</script>