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
        <i class="fa fa-spinner fa-pulse fa-fw" :class="sizeClass"></i>
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script>
	export default {
		computed: {
			sizeClass: function () {
				switch (this.size) {
					case 'small':
						return 'fa-lg';

					case 'medium':
						return 'fa-2x';

					default:
					case 'large':
						return 'fa-4x';
				}
			},
		},
		props: {
			size: {
				type: String,
				default: 'large'
			}
		}
	};
</script>