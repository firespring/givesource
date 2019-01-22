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
        <layout-header></layout-header>
        <router-view></router-view>
        <modals></modals>
    </div>
</template>

<script>
	import ComponentHeader from './layout/Header.vue';
	import ComponentModals from './modals/Modals.vue';

	export default {
		beforeCreate() {
			const vm = this;

			const eventTitle = vm.store.getters.setting('EVENT_TITLE');
			if (eventTitle) {
                document.title = eventTitle;
            }

			const favicon = vm.$store.getters.setting('FAVICON');
			if (favicon) {
                vm.createFavicon(favicon);
            }
        },
        methods: {
			createFavicon(url) {
				const head = document.head || document.getElementsByTagName('head')[0];
				const current = document.querySelector("link[rel*='icon']");
				const link = document.createElement('link');
				link.type = 'image/png';
				link.rel = 'shortcut icon';
				link.href = url;

				if (current) {
					head.removeChild(current);
                }

                head.appendChild(link);
            }
        },
		components: {
			'layout-header': ComponentHeader,
			'modals': ComponentModals
		}
	};
</script>