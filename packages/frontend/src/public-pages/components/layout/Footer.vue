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
    <div>
        <footer class="page-footer">
            <slot></slot>

            <div class="contact-info">
                <div class="contact-info__copyright">
                    &copy; {{ year }} <router-link :to="{ name: 'homepage' }">{{ eventTitle }}</router-link>
                </div>

                <div class="contact-info__contact">
                    <router-link :to="{ name: 'contact' }"><i class="fas fa-envelope" aria-hidden="true"></i><span>Contact Us</span></router-link>
                </div>

                <div class="contact-info__contact" v-if="contactPhone">
                    <i class="fas fa-phone" aria-hidden="true"></i><span>{{ contactPhone }}</span>
                </div>

                <div class="contact-info__terms" v-if="displayTerms">
                    <router-link :to="{ name: 'terms' }">Terms of Service</router-link>
                </div>

                <div class="contact-info__login">
                    <a :href="adminPagesUrl"><i class="fas fa-sign-in-alt" aria-hidden="true"></i><span>Admin Log In</span></a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
	import * as Settings from './../../helpers/settings';

	module.exports = {
        computed: {
			adminPagesUrl: function () {
				return this.$store.getters.setting('ADMIN_URL') + '/login';
            },
            contactPhone: function () {
	            return this.$store.getters.setting('CONTACT_PHONE') || null;
            },
	        displayTerms: function () {
		        return this.$store.getters.booleanSetting('PAGE_TERMS_ENABLED');
	        },
            year: function () {
				return new Date().getFullYear();
            },
			eventTitle: function () {
				return Settings.eventTitle();
			}
        }
    };
</script>