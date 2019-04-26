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
    <div>
        <router-view></router-view>
        <modals></modals>
    </div>
</template>

<script>
	import ComponentModals from './modals/Modals.vue';

	export default {
		beforeCreate() {
			const vm = this;

			const eventTitle = vm.$store.getters.setting('EVENT_TITLE');
			if (eventTitle) {
				document.title = eventTitle;
			}

			const seoDescription = vm.$store.getters.setting('SEO_DESCRIPTION');
			const socialDescription = vm.$store.getters.setting('SOCIAL_SHARING_DESCRIPTION');
			if (seoDescription || socialDescription) {
				const description = seoDescription ? seoDescription : socialDescription;
				document.querySelector('meta[name="description"]').setAttribute('content', description);
			}

			const favicon = vm.$store.getters.setting('FAVICON');
			if (favicon) {
				const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
				link.type = 'image/png';
				link.rel = 'shortcut icon';
				link.href = favicon;

				document.getElementsByTagName('head')[0].appendChild(link);
			}
		},
		components: {
			'modals': ComponentModals
		}
	};
</script>