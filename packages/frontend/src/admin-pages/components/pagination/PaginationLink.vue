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
    <strong class="c-pagination__here" v-if="page == current">{{ page + 1 }}</strong>
    <router-link :to="generatePageLink({start: start})" v-else>{{ page + 1 }}</router-link>
</template>

<script>
    module.exports = {
    	computed: {
    		start: function () {
                return this.page * this.size;
            }
        },
    	props: [
    		'current',
		    'page',
            'size'
        ],
        methods: {
	        generatePageLink: function (query) {
		        const vue = this;
		        query = query || {};
		        return {
			        name: vue.$route.name,
			        query: _.extend({}, vue.$route.query, query)
		        };
	        }
        }
    };
</script>