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
    <div class="actions-row">
        <div class="actions-row__search" style="width: 100%;">
            <form>
                <div class="grid grid--compact grid--middle">

                    <div class="grid-item grid-item--expand">
                        <div class="select-wrap">
                            <select id="categoryId" name="categoryId" class="sm">
                                <option>Select a Nonprofit Category</option>
                                <option value="">-----</option>
                                <option value="1">Category #1</option>
                                <option value="2">Category #2</option>
                                <option value="3">Category #3</option>
                                <option value="4">Category #4</option>
                                <option value="5">Category #5</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid-item grid-item--expand">
                        <div class="search-wrap">
                            <input type="search" name="search" class="sm" placeholder="Search By Name">
                        </div>
                    </div>

                    <div class="grid-item grid-item--collapse">
                        <button type="submit" class="btn btn--dark btn--sm">Go</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
</template>