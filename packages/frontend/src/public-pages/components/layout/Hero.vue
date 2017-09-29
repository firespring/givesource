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
    <div class="page-hero">
        <div class="page-hero__title" :class="{ wrapper: wrap, 'wrapper--sm': wrap }">
            <div class="page-hero__logo" v-if="hasLogoSlot">
                <slot name="logo"></slot>
            </div>
            <slot name="title"></slot>
        </div>

        <div class="page-hero__message" v-if="hasMessageSlot">
            <slot></slot>
        </div>

        <div class="presented-by" v-if="presentedBy">
            <div>
                Presented by <a href="#">The Greater Area Foundation</a>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function () {
        	return {
        		backgroundImage: '/assets/temp/hero.jpg',
            }
        },
        computed: {
        	hasLogoSlot: function () {
        		return this.$slots.logo;
            },
	        hasMessageSlot: function () {
		        return this.$slots.default;
	        }
        },
        props: {
	        presentedBy: {
        		type: Boolean,
                default: false
            },
            wrap: {
	        	type: Boolean,
                default: false
            }
        }
    };
</script>