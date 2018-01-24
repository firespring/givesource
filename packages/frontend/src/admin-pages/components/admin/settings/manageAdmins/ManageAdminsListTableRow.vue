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
    <tr>
        <td class="image">
            <v-gravatar :email="adminUser.email" :size="150" default-img="mm"></v-gravatar>
        </td>
        <td>

            <div class="c-user-strip u-flex u-items-center">

                <div class="c-user-strip__content u-flex u-items-center">

                    <div class="c-user-strip__name">
                        <strong>{{ adminUser.firstName }} {{ adminUser.lastName }}</strong>
                    </div>

                    <div class="c-user-strip__email u-icon u-flex u-items-center">
                        <a :href="`mailto:${ adminUser.email }`">{{ adminUser.email }}</a>
                    </div>

                </div>

            </div>

        </td>
        <td class="u-nowrap u-text-r">
            <div class="date">{{ date }}</div>
        </td>
        <td class="u-nowrap">
            <a href="#" role="button" v-on:click="remove" v-if="superAdmin" class="c-btn c-btn--sm c-btn--flat c-btn--neutral c-btn--icon js-modal-trigger" rel="modal-confirm-remove-org-member">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>Remove
            </a>
            <a v-else>(Super Admin)</a>
        </td>
    </tr>
</template>

<script>

    module.exports = {
        data: function () {
            return {
                selectedAdminUser: this.adminUser
            }
        },
        computed: {
            date: function () {
                return new Date(this.adminUser.createdOn).toLocaleDateString();
            },
            superAdmin: function () {
                return (this.adminUser.group !== 'SuperAdmin');
            }
        },
        props: [
            'adminUser'
        ],
        methods: {
            remove: function () {
                const vue = this;
                vue.bus.$emit('deleteUserAdminModal', vue.selectedAdminUser);
            },
        }
    };
</script>