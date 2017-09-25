<template>
    <div class="o-app-main-content">

        <!-- BEGIN form -->
        <form method="post" action="index.php" novalidate="">

            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">

                <div class="c-page-section__main">

                    <div class="c-form-item c-form-item--text c-form-item--required">

                        <div class="c-form-item__label">

                            <label for="tierName" class="c-form-item-label-text">Name</label>

                        </div>

                        <div class="c-form-item__control">

                            <input type="text" name="tierName" id="tierName">

                        </div>

                    </div>

                    <div class="c-form-item c-form-item--radio">

                        <div class="c-form-item__label">
                            <div class="c-form-item-label-text" id="logoSize">Logo Size</div>

                            <div class="c-notes">
                                Specify the size of this tier's logos when they're displayed on your website. For example, if you're creating a "Featured Sponsors" tier, you can make its logos larger than your other tiers.
                            </div>
                        </div>

                        <div class="c-form-item__control">

                            <ul class="c-input-list c-input-list--radio" aria-labelledby="logoSize">
                                <li>

                                    <input type="radio" name="logoSize" id="logoSize-1" value="1">
                                    <label for="logoSize-1">Large</label>

                                </li>
                                <li>

                                    <input type="radio" name="logoSize" id="logoSize-2" value="2" checked="">
                                    <label for="logoSize-2">Default</label>

                                </li>
                                <li>

                                    <input type="radio" name="logoSize" id="logoSize-3" value="3">
                                    <label for="logoSize-3">Small</label>

                                </li>
                            </ul>

                        </div>

                    </div>

                </div>

            </section>

            <!-- BEGIN form actions -->
            <footer class="c-form-actions">

                <button type="submit" class="c-btn">Save Changes</button>
                <a href="index.php" class="c-btn c-btn--text c-btn--neutral">Cancel</a>

            </footer>
            <!-- END form actions -->

        </form>
        <!-- END form -->

    </div>

</template>