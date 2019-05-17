/*
 * Copyright 2019 Firespring, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default {
	data() {
		return {
			pagination: {
				items: [],
				loaded: false,
				size: 0,
				sort: '',
				start: 0,
				total: 0
			}
		};
	},
	methods: {
		resetPaginationData() {
			const vm = this;

			vm.pagination = {
				items: [],
				loaded: false,
				size: 0,
				sort: '',
				start: 0,
				total: 0
			};
		},
		setPaginationData(data) {
			const vm = this;

			Object.keys(vm.pagination).forEach(key => {
				if (data.hasOwnProperty(key)) {
					vm.pagination[key] = data[key];
				}
			});
			vm.pagination.loaded = true;
		}
	}
};