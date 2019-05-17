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
    <table class="table-middle" :class="{ 'table-empty': !displayRows }">
        <thead>
        <tr>
            <th class="icon"><i class="fa fa-picture-o" aria-hidden="true"></i></th>
            <th class="u-width-100p">Name</th>
            <th>Added</th>
            <th></th>
        </tr>
        </thead>

        <tbody v-if="displayRows">
        <manage-admins-list-table-row v-for="adminUser in adminUsers" :adminUser="adminUser" :key="adminUser.uuid"></manage-admins-list-table-row>
        </tbody>

        <tbody v-else>
        <layout-empty-table-row :loaded="loaded" :colspan="5" message="There are no users."></layout-empty-table-row>
        </tbody>

    </table>
</template>

<script>
	import ComponentEmptyTableRow from './../../../layout/EmptyTableRow.vue';
	import ComponentManageAdminsListTableRow from './ManageAdminsListTableRow.vue';

	export default {
		data() {
			return {
				adminUsers: [],
				loaded: false
			};
		},
		computed: {
			displayRows() {
				return this.loaded && this.adminUsers.length;
			},
		},
		props: [
			'nonprofitUuid'
		],
		created() {
			const vm = this;

			vm.$request.get('users').then(response => {
				vm.adminUsers = response.data;
				vm.loaded = true;
			});

			vm.bus.$on('deleteUserAdmin', () => {
				vm.removeUser();
			});

			vm.bus.$on('deleteUserAdminModal', selectedAdminUser => {
				vm.selectedAdminUser = selectedAdminUser;
				vm.deleteModal(selectedAdminUser);
			});
		},
		beforeDestroy() {
			const vm = this;
			vm.bus.$off('deleteUserAdmin');
			vm.bus.$off('deleteUserAdminModal');
		},
		methods: {
			deleteModal(selectedAdminUser) {
				const vm = this;
				vm.addModal('confirm-delete', {
					modalTitle: 'Remove Admin User',
					modalText: 'Are you sure you want to remove ' + selectedAdminUser.email + ' ?',
					callback: 'deleteUserAdmin',
				});
			},
			removeUser() {
				const vm = this;

				vm.addModal('spinner');
				vm.$request.delete('users/' + vm.selectedAdminUser.uuid).then(() => {
					vm.adminUsers = _.filter(vm.adminUsers, adminUser => {
						return adminUser.uuid !== vm.selectedAdminUser.uuid;
					});
					vm.clearModals();
				}).catch(err => {
					vm.removeModal('spinner');
					vm.$emit('hasError', err);
				});
			}
		},
		components: {
			'layout-empty-table-row': ComponentEmptyTableRow,
			'manage-admins-list-table-row': ComponentManageAdminsListTableRow,
		}
	};
</script>