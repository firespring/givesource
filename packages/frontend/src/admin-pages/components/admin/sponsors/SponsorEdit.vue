<template>
    <div class="o-app">

        <navigation></navigation>
        <!-- BEGIN app main -->
        <main class="o-app__main o-app__main--compact">

            <!-- BEGIN app main content wrapper -->
            <div class="o-app_main-content o-app_main-content--md">

                <!-- BEGIN page header -->
                <div class="o-page-header">

                    <div class="o-page-header__text">

                        <nav class="o-page-header-nav c-breadcrumb">

                            <span><router-link :to="{ name: 'sponsors-list' }">Sponsors</router-link></span><span><router-link :to="{ name: 'manage-tiers' }">Gold</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Sponsor</h1>
                    </div>

                </div>
                <!-- END page header -->

                <sponsor-edit-form></sponsor-edit-form>
            </div>
            <!-- END app main content wrapper -->

        </main>
        <!-- END app main -->

    </div>
</template>
<script>
    module.exports ={
    	components: {
    		'sponsor-edit-form': require('./SponsorEditForm.vue')
        }
    };
</script>