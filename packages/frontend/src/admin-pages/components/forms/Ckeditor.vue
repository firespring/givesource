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
    <vue-ckeditor v-if="loaded" v-model="localValue" :toolbar="toolbar" :id="id" :language="language" :extraplugins="plugins" :class="{ 'has-error': hasErrors }" :height="height">
    </vue-ckeditor>
    <layout-spinner v-else :height="height + 'px'"></layout-spinner>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {
			    language: 'en-us',
			    toolbar: [
				    {name: 'styles', items: ['Format']},
				    {name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
				    {name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Blockquote']},
				    {name: 'colors', items: ['TextColor', 'BGColor']},
				    {name: 'links', items: ['Link', 'Unlink']},
				    {name: 'tools', items: ['Maximize']}
			    ],
			    plugins: 'colorbutton,colordialog',

                localValue: '',
            }
        },
	    props: {
		    value: {},
		    id: {
			    type: String,
			    default: 'editor'
		    },
		    loaded: {
			    type: Boolean,
			    default: false
		    },
		    hasErrors: {
			    type: Boolean,
			    default: false
		    },
		    height: {
			    type: String,
			    default: '200'
		    }
	    },
        watch: {
    		localValue: function (value, oldValue) {
    			const vue = this;
    			if (value === oldValue) {
    				return;
                }
                vue.$emit('input', value);
            },
	        value: function (value, oldValue) {
		        const vue = this;
		        if (value === oldValue) {
			        return;
		        }
		        vue.localValue = value;
	        }
        },
        components: {
    		'layout-spinner': require('./../layout/Spinner.vue')
        }
    };
</script>