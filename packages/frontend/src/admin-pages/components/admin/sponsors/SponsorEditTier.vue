<template>
    <div class="o-app">

        <!-- BEGIN app main -->
        <main class="o-app__main o-app__main--compact">

            <!-- BEGIN app main content wrapper -->
            <div class="o-app_main-content o-app_main-content--md">

                <!-- BEGIN page header -->
                <div class="o-page-header">

                    <div class="o-page-header__text">

                        <nav class="o-page-header-nav c-breadcrumb">

                            <span><a href="../../giving-day-foundation/sponsors/">Sponsors</a></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Sponsor Tier</h1>
                    </div>
                    <sponsor-edit-tier-form></sponsor-edit-tier-form>
                </div>
                <!-- END page header -->

            </div>
            <!-- END app main content wrapper -->

        </main>
        <!-- END app main -->

    </div>
</template>
<script>
    modules.exports ={
    	components: {
    		'sponsor-edit-tier-form': require('./SponsorEditTierForm.vue')
        }
    };
</script>