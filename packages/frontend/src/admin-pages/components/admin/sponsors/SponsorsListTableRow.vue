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
        <td class="icon">
            <div class="c-drag-handle ui-sortable-handle"></div>
        </td>

        <td>
            <strong>Platinum</strong>
        </td>

        <td class="item-actions">
            <div class="c-btn-group c-btn-dropdown c-btn-dropdown--r">
                <router-link :to="{ name: 'sponsor-manage-tiers' }" role="button" class="c-btn c-btn--sm c-btn--icon">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>Manage Tiers
                </router-link>
                <a href="#" role="button" class="c-btn c-btn--sm c-btn-dropdown-trigger js-btn-dropdown-trigger"></a>
                <div class="c-btn-dropdown-menu">
                    <div class="c-btn-dropdown-menu__options">
                        <a href="sponsor-tier-edit.php"><i class="fa fa-fw fa-gear" aria-hidden="true"></i>Edit Tier Settings</a>
                        <hr>
                        <a href="#" class="js-modal-trigger" rel="modal-confirm-delete"><i class="fa fa-fw fa-trash" aria-hidden="true"></i>Delete This Tier</a>
                    </div>
                </div>
            </div>
        </td>

    </tr>
</template>