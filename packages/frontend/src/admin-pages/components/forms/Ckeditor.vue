<template>
    <vue-ckeditor v-if="loaded" v-model="localValue" :toolbar="toolbar" :id="id" :language="language" :extraplugins="plugins" :class="{ 'has-error': hasErrors }" :height="height">
    </vue-ckeditor>
    <div v-else style="height: 12rem; justify-content: center; align-items: center; display: flex;">
        <div class="c-progress c-progress--spinner c-spinner-active">
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
        }
    };
</script>