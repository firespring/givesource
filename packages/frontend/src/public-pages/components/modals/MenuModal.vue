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
    <div class="overlay" :style="{ 'z-index': zIndex }">

        <nav class="overlay__nav">
            <router-link :to="{ name: 'homepage' }">Home</router-link>
            <router-link :to="{ name: 'about' }" v-if="displayAbout">About</router-link>
            <router-link :to="{ name: 'toolkits' }" v-if="displayToolkits">Toolkits</router-link>
            <router-link :to="{ name: 'faq' }" v-if="displayFAQ">FAQ</router-link>
            <router-link :to="{ name: 'contact' }">Contact Us</router-link>
            <router-link :to="{ name: 'cart' }" v-if="displayCart">Your Donations</router-link>

            <router-link v-for="page in pages" :key="page.uuid" :to="{ path: page.slug }" v-if="page.enabled">{{ page.title }}</router-link>
        </nav>

        <a v-on:click.prevent="close" href="#" id="overlay__close" role="button"><i class="fas fa-times-circle" aria-hidden="true"></i></a>
    </div>
</template>

<script>
	export default {
		computed: {
			displayAbout() {
				return this.$store.getters.booleanSetting('PAGE_ABOUT_ENABLED');
			},
			displayFAQ() {
				return this.$store.getters.booleanSetting('PAGE_FAQ_ENABLED');
			},
			displayToolkits() {
				return this.$store.getters.booleanSetting('PAGE_TOOLKIT_ENABLED');
			},
			displayCart() {
				return this.$store.getters.cartItems.length > 0;
			},
			pages() {
				return this.$store.getters.pages;
			},
		},
		props: {
			data: {},
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		},
		created() {
			this.addBodyClasses('has-overlay', 'has-overlay--mobile-nav');
		},
		methods: {
			close() {
				const vm = this;

				vm.removeModal('menu-overlay');
				vm.removeBodyClasses('has-overlay', 'has-overlay--mobile-nav');
			}
		}
	};
</script>