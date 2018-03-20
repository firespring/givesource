<!--
  ~ Copyright 2018 Firespring, Inc.
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