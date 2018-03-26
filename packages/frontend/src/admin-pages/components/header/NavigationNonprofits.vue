<!--
  ~ Copyright 2018 Firespring, Inc.
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