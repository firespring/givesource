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
        <footer class="page-footer">
            <slot></slot>

            <div class="contact-info">
                <div class="contact-info__copyright">
                    &copy; {{ year }} <router-link :to="{ name: 'homepage' }">Give To Our City</router-link>
                </div>

                <div class="contact-info__contact">
                    <router-link :to="{ name: 'contact' }"><i class="fa fa-envelope" aria-hidden="true"></i><span>Contact Us</span></router-link>
                </div>

                <div class="contact-info__contact" v-if="contactPhone">
                    <i class="fa fa-phone" aria-hidden="true"></i><span>{{ contactPhone }}</span>
                </div>

                <div class="contact-info__terms">
                    <router-link :to="{ name: 'terms' }">Terms of Service</router-link>
                </div>

                <div class="contact-info__login">
                    <a :href="adminPagesUrl"><i class="fa fa-sign-in" aria-hidden="true"></i><span>Admin Log In</span></a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
	module.exports = {
        computed: {
			adminPagesUrl: function () {
				return this.$store.getters.setting('ADMIN_PAGES_CLOUDFRONT_URL') + '/login';
            },
            contactPhone: function () {
	            return this.$store.getters.setting('CONTACT_PHONE') || null;
            },
            year: function () {
				return new Date().getFullYear();
            }
        }
    };
</script>