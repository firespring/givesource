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
    <header class="page-header">

        <div class="page-header__logo">
            <router-link :to="{ name: 'homepage' }"><img alt="Give To Lincoln Day Logo" src="/assets/temp/logo-gtld-reverse.png"></router-link>
        </div>

        <nav class="page-header__nav-menu">
            <router-link :to="{ name: 'about' }">About</router-link>
            <router-link :to="{ name: 'toolkits' }">Toolkits</router-link>
            <router-link :to="{ name: 'faq' }">FAQ</router-link>
        </nav>

        <form class="page-header__search">
            <input type="search" name="searchNonprofit" id="searchNonprofit" placeholder="Find a Nonprofit">
        </form>

        <div class="page-header__user-info">
            <router-link :to="{ name: 'cart' }"><i class="fa fa-shopping-cart" aria-hidden="true"></i><span>Your Donations (0)</span></router-link>
        </div>

        <a v-on:click="openMenu" href="#" id="mobile-nav-trigger" class="page-header__nav-toggle"><i class="fa fa-bars" aria-hidden="true"></i><span>Menu</span></a>
    </header>
</template>

<script>
    module.exports = {
	    methods: {
    		openMenu: function (event) {
    			event.preventDefault();
    			const vue = this;

    			vue.addBodyClasses('has-overlay', 'has-overlay--mobile-nav');
            },
        }
    };
</script>