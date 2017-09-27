<template>
    <input v-if="isDesktop" v-model="localValue" type="text" :name="name" :id="id" ref="input">
    <input v-else v-model="localValue" type="color" :name="name" :id="id">
</template>

<script>
    require('@claviska/jquery-minicolors');

    module.exports = {
    	data: function () {
    		return {
    			localValue: ''
            };
        },
        computed: {
	        isDesktop: function () {
		        return !/Mobi/.test(navigator.userAgent);
	        }
        },
        props: {
    		value: {},
	        id: {
		        type: String,
		        default: null,
	        },
	        name: {
		        type: String,
		        default: null
	        }
        },
        mounted: function () {
    		const vue = this;

    		if (vue.isDesktop) {
    			const options = {
				    change: function (value) {
					    vue.localValue = value;
				    }
                };
    			if (vue.value) {
    				options.defaultValue = vue.value;
                }
    			$(vue.$refs.input).minicolors(options);
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