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
        <td class="image u-text-c">
            <img alt="" src="">
        </td>
        <td>
            <!--<strong><a href="sponsor-edit.php">Sponsor #3</a></strong>-->
            <router-link :to="{ name: 'edit-sponsor' }" role="button" ><strong><a>Sponsor #3 </a></strong>
            </router-link>
        </td>
        <td class="icon">
            <a href="#" role="button" class="c-btn c-btn--sm c-btn--icon c-btn--bad c-btn--flat js-modal-trigger" rel="modal-confirm-delete"><i class="fa fa-trash"
                                                                                                                                                aria-hidden="true"></i>Delete</a>
        </td>
    </tr>
</template>