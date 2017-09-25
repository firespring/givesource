<template>
    <div class="o-app-main-content">

        <form method="post" action="tier.php" novalidate="">

            <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">

                <div class="c-page-section__main">

                    <div class="c-form-item c-form-item--text c-form-item--required">

                        <div class="c-form-item__label">

                            <label for="sponsorName" class="c-form-item-label-text">Name</label>

                        </div>

                        <div class="c-form-item__control">

                            <input type="text" name="sponsorName" id="sponsorName">

                        </div>

                    </div>

                    <div class="c-form-item c-form-item--url">

                        <div class="c-form-item__label">

                            <label for="sponsorUrl" class="c-form-item-label-text">URL</label>

                        </div>

                        <div class="c-form-item__control">

                            <div class="u-control-icon u-control-icon--url">
                                <input type="url" name="sponsorUrl" id="sponsorUrl" placeholder="http://">
                            </div>

                        </div>

                    </div>

                    <div class="c-form-item c-form-item--select">

                        <div class="c-form-item__label">

                            <label for="sponsorTier" class="c-form-item-label-text">Tier</label>

                        </div>

                        <div class="c-form-item__control">

                            <select id="sponsorTier" name="sponsorTier" class="u-width-auto">
                                <option value="1">Platinum</option>
                                <option value="2" selected="">Gold</option>
                                <option value="3">Silver</option>
                                <option value="4">Bronze</option>
                            </select>

                        </div>

                    </div>

                    <div class="c-form-item c-form-item--file">

                        <div class="c-form-item__label">
                            <label for="fileFieldDefault" class="c-form-item-label-text">Logo</label>

                            <div class="c-notes">
                                If no logo is uploaded, one will be automatically generated based on the sponsor's name.
                            </div>
                        </div>

                        <div class="c-form-item__control">

                            <input type="file" name="fileFieldDefault" id="fileFieldDefault" data-filenames="fileFieldDefaultFilenames">
                            <button type="button" class="c-btn c-btn--good" id="fileFieldDefaultTrigger" data-control="fileFieldDefault" data-filenames="fileFieldDefaultFilenames">
                                Select File
                            </button>
                            <div class="filenames" id="fileFieldDefaultFilenames"></div>


                        </div>

                    </div>

                </div>

            </section>

            <footer class="c-form-actions">

                <button type="submit" class="c-btn">Save &amp; Add Another</button>
                <button type="submit" class="c-btn">Save &amp; Finish</button>
                <a href="tier.php" class="c-btn c-btn--text c-btn--neutral">Cancel</a>

            </footer>

        </form>

    </div>

</template>