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
    <div style="justify-content: center; align-items: center; display: flex;" :style="{ height: height }">
        <div class="c-progress c-progress--spinner c-spinner-active" :class="spinnerClass">
            <div class="c-spinner-layer c-spinner-orange-only">
                <div class="c-spinner-circle-clipper left">
                    <div class="c-spinner-circle"></div>
                </div><div class="gap-patch">
                <div class="c-spinner-circle"></div>
            </div><div class="c-spinner-circle-clipper right">
                <div class="c-spinner-circle"></div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        computed: {
        	spinnerClass: function () {
        		switch (this.size) {
			        case 'lg':
        			case 'large':
        				return 'c-spinner-lg';

                    case 'sm':
                    case 'small':
                    	return 'c-spinner-sm';

                    case 'xm':
                    case 'extrasmall':
                    	return 'c-spinner-xs';

                    case 'md':
                    case 'medium':
                    default:
                    	return '';
                }
            }
        },
    	props: {
    		size: {
    			type: String,
                default: ''
            },
            height: {
    			type: String,
                default: ''
            }
        }
    };
</script>