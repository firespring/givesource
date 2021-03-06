<template>
    <div class="o-app">
        <navigation class="no-print"></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content o-app_main-content--md">
                <div class="o-app-main-content" ref="content">

                    <div class="o-page-header no-print">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{ name: 'donations-list' }">Donations</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Donor Receipt</h1>
                            <h2>For {{ donorEmail }}</h2>
                        </div>
                    </div>

                    <api-error v-model="apiError"></api-error>

                    <div class="c-header-actions no-print">
                        <div>
                            <a v-on:click.prevent="printReceipt" href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-print" aria-hidden="true"></i>Print Receipt</a>
                            <a v-on:click.prevent="emailReceipt" href="#" role="button" class="c-btn c-btn--sm c-btn--icon"><i class="fa fa-envelope" aria-hidden="true"></i>Email Receipt</a>
                        </div>
                    </div>

                    <iframe frameborder="0" ref="frame" id="receipt"></iframe>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import {mapState, mapActions} from 'vuex';

	export default {
		computed: {
			...mapState({
				receipt: state => state.receipt,
				donorEmail: state => state.donorEmail,
			})
		},

        data() {
			return {
				apiError: {}
            };
        },

        methods: {
            ...mapActions([
	            'clearReceipt'
            ]),

			printReceipt() {
                window.print();
            },

            emailReceipt() {
	            const vm = this;

	            vm.addModal('donor-receipt-email-modal', {
		            email: vm.donorEmail
	            });
            }
        },

		mounted() {
			const vm = this;

			if (vm.receipt) {
				vm.$refs.frame.contentWindow.document.write(vm.receipt);

				// Set frame size after all images are done loading in the iFrame
				let loaded = 0;
				const frameImages = vm.$refs.frame.contentWindow.document.images;
				for (let image of frameImages) {
					image.addEventListener('load', () => {
						loaded++;
						if (frameImages.length === loaded) {
							vm.$refs.frame.height = vm.$refs.frame.contentWindow.document.body.scrollHeight + 'px';
						}
					});
                }

                // Fallback - set frame size after document ready
				$(vm.$refs.frame.contentWindow.document).ready(() => {
					vm.$refs.frame.contentWindow.document.body.querySelector('table').style.background = '#fff';
					vm.$nextTick(() => {
						vm.$refs.frame.height = vm.$refs.frame.contentWindow.document.body.scrollHeight + 'px';
                    });
				});
			}
		},

        destroyed() {
			this.clearReceipt();
        }
	}
</script>

<style>
    iframe#receipt {
        border: 0;
        width: 100%;
    }

    @media print {
        @page {
            size: auto;
            margin: 0;
        }

        .no-print, .no-print * {
            display: none !important;
        }

        body, div.o-app, main.o-app__main, div.o-app-main-content {
            overflow: visible;
        }
    }
</style>