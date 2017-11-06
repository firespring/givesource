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
    <div class="u-control-icon u-control-icon--date">
        <input v-if="isDesktop" type="text" v-model="localValue" :name="name" :id="id" :placeholder="placeholder" ref="datetime" :class="{'has-error': hasError}">
        <input v-else type="date" v-model="localValue" :name="name" :id="id" :class="{'has-error': hasError}">
    </div>
</template>

<script>
	import DatePicker from 'jquery-datetimepicker';

    module.exports = {
    	data: function () {
    		return {
    			localValue: '',
                defaultOptions: {
	                timepicker: false,
	                format: 'm/d/Y',
	                scrollMonth: false,
	                closeOnDateSelect: true,
	                yearStart: 1900,
	                lang: 'en',
	                i18n:{
		                en:{
			                dayOfWeekShort:['S', 'M', 'T', 'W', 'T', 'F', 'S']
		                }
	                }
                }
            };
        },
        computed: {
    		datetimeOptions: function () {
    			return _.defaultsDeep({}, this.defaultOptions, this.options);
            },
            isDesktop: function () {
    			return !/Mobi/.test(navigator.userAgent);
            }
        },
    	props: {
    		value: {},
            id: {
    			type: String,
                default: 'date',
            },
            name: {
    			type: String,
                default: 'date',
            },
            placeholder: {
    			type: String,
                default: '',
            },
            options: {
    			type: Object,
                default: function () {
                	return {};
                }
            },
            minDate: {
    			type: [String, Boolean],
                default: null
            },
            maxDate: {
    			type: [String, Boolean],
                default: null
            },
            hasError: {
    			type: Boolean,
                default: false
            }
        },
	    mounted: function () {
		    const vue = this;

		    if (vue.isDesktop) {
		    	const options = _.merge({}, vue.datetimeOptions, {
				    onChangeDateTime: function(value, $el) {
					    vue.localValue = $el.val();
				    },
                    onShow: function () {
				    	if (vue.minDate !== null) {
				    		this.setOptions({
							    minDate: vue.minDate || false,
                                formatDate: 'm/d/Y'
                            });
                        }
                        if (vue.maxDate !== null) {
	                        this.setOptions({
		                        maxDate: vue.maxDate || false,
		                        formatDate: 'm/d/Y'
	                        });
                        }
                    }
                });
                $(vue.$refs.datetime).datetimepicker(options);
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
        }
    };
</script>