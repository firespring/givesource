<template>
    <div class="u-control-icon u-control-icon--date">
        <input v-if="isDesktop" type="text" v-model="localValue" :name="name" :id="id" :placeholder="placeholder" ref="datetime">
        <input v-else type="date" v-model="localValue" :name="name" :id="id">
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
				    	console.log(vue.minDate);
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