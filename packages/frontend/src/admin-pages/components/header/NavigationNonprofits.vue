<!--
  ~ Copyright 2019 Firespring, Inc.
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
        </ul>

        <select v-on:change="mobileSelect" v-model="selected">
            <option disabled value="">Navigation</option>
            <option value="nonprofit-donations-list" selected>Donations</option>
            <option value="nonprofit-your-page">Your Page</option>
            <option value="nonprofit-settings-list">Settings</option>
        </select>

    </div>
</template>

<script>
	export default {
		data: function () {
			return {
				selected: ''
			};
		},
		created: function () {
			this.setSelected();
		},
		props: [
			'nonprofitUuid'
		],
		methods: {
			setSelected: function () {
				const vue = this;

				if (vue.$route.path.indexOf('/donations') === 0) {
					vue.selected = 'nonprofit-donations-list';
				} else if (vue.$route.path.indexOf('/your-page') === 0) {
					vue.selected = 'nonprofit-your-page';
				} else if (vue.$route.path.indexOf('/settings') === 0) {
					vue.selected = 'nonprofit-settings-list';
				}
			},
			mobileSelect: function () {
				const vue = this;
				vue.$router.push({name: vue.selected});
			}
		}
	}
</script>