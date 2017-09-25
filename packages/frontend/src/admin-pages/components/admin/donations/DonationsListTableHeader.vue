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
    <div class="c-header-actions">

        <div>
            <a href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-plus-circle" aria-hidden="true"></i>Add Offline Donations</a>
            <a href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-cloud-download" aria-hidden="true"></i>Export Donations</a>
        </div>

        <div class="c-header-actions__search u-flex-expand">
            <form>
                <div class="c-form-control-grid">
                    <div class="c-form-control-grid__item">
                        <div class="u-control-icon u-control-icon--search">
                            <input type="search" name="nameGroupDefaultLastName" id="nameGroupDefaultLastName" class="sm" placeholder="Search donations">
                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>