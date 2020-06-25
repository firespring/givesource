<template>
    <div v-if="isAdmin && displayBanner" class="c-alert c-alert--expand c-alert--bad c-alert--shadow u-flex u-justify-center">
        <div class="c-alert__body u-flex u-justify-between">
            <div class="c-alert__icon">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </div>
            <div class="c-alert__text">
                <p>
                    Please contact your support rep to enter your payment keys. This Giving Day event can't take donations until that's done.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				/**
				 * Settings that will be returned in api call
				 */
				settings: [],

				/**
				 * Should banner show
				 */
				displayBanner: false
			}
		},

		created: function () {
			const vue = this;

			vue.$request.get('settings', {
				keys: ['PAYMENT_SPRING_PUBLIC_API_KEY']
			}).then(function (response) {
				vue.settings = response.data;
				next();
			}).catch(function () {
				next();
			});
		},

		computed: {
			/**
			 * Check to see what user level the user is
			 *
			 * @return {boolean}
			 */
			isAdmin: function () {
				return this.isSuperAdminUser() || this.isAdminUser();
			},
		},

		watch: {
			/**
			 * Watch the setting data variable for change.
			 */
			settings: {
				handler: function () {
					const vue = this;
					if (vue.settings.length === 0) {
						vue.displayBanner = true;
					}
				}
			}
		},
	};
</script>