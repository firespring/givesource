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
		components: {
			'layout-header': ComponentHeader,
			'modals': ComponentModals
		}
	};
</script>