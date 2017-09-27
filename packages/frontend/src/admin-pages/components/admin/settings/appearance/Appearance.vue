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
    <div class="o-app">
        <navigation></navigation>

        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Customize Appearance</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form>
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Logos, Images &amp; Color</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--file">
                                    <div class="c-form-item__label">
                                        <label for="givingDayLogo" class="c-form-item-label-text">Your Giving Day Logo</label>
                                    </div>
                                    <div class="c-form-item__control u-flex-wrap">
                                        <input type="file" name="givingDayLogo" id="givingDayLogo" data-filenames="givingDayLogoFilenames">
                                        <button type="button" class="c-btn c-btn--good" id="givingDayLogoTrigger" data-control="givingDayLogo" data-filenames="givingDayLogoFilenames">Select File</button>
                                        <div class="filenames" id="givingDayLogoFilenames"></div>
                                        <div class="c-notes c-notes--below u-width-100p">
                                            Your Giving Day logo will be displayed on all pages. Logos are automatically resized as needed.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file">
                                    <div class="c-form-item__label">
                                        <label for="foundationLogo" class="c-form-item-label-text">Your Foundation's Logo</label>
                                    </div>
                                    <div class="c-form-item__control u-flex-wrap">
                                        <input type="file" name="foundationLogo" id="foundationLogo" data-filenames="foundationLogoFilenames">
                                        <button type="button" class="c-btn c-btn--good" id="foundationLogoTrigger" data-control="foundationLogo" data-filenames="foundationLogoFilenames">Select File</button>
                                        <div class="filenames" id="foundationLogoFilenames"></div>
                                        <div class="c-notes c-notes--below u-width-100p">
                                            Your foundation logo will be displayed in a "Presented By" slot throughout your Giving Day site. Logos are automatically resized as needed.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file">
                                    <div class="c-form-item__label">
                                        <label for="homepageSpotlight" class="c-form-item-label-text">Homepage Spotlight Image</label>
                                    </div>
                                    <div class="c-form-item__control u-flex-wrap">
                                        <input type="file" name="homepageSpotlight" id="homepageSpotlight" data-filenames="homepageSpotlightFilenames">
                                        <button type="button" class="c-btn c-btn--good" id="homepageSpotlightTrigger" data-control="homepageSpotlight" data-filenames="homepageSpotlightFilenames">Select File</button>
                                        <div class="filenames" id="homepageSpotlightFilenames"></div>
                                        <div class="c-notes c-notes--below u-width-100p">
                                            This image will appear in the masthead of your homepage. If you've uploaded a background masthead image, this spotlight image will appear on top of it.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--file">
                                    <div class="c-form-item__label">
                                        <label for="backgroundMasthead" class="c-form-item-label-text">Background Masthead Image</label>
                                    </div>
                                    <div class="c-form-item__control u-flex-wrap">
                                        <input type="file" name="backgroundMasthead" id="backgroundMasthead" data-filenames="backgroundMastheadFilenames">
                                        <button type="button" class="c-btn c-btn--good" id="backgroundMastheadTrigger" data-control="backgroundMasthead" data-filenames="backgroundMastheadFilenames">Select File</button>
                                        <div class="filenames" id="backgroundMastheadFilenames"></div>
                                        <div class="c-notes c-notes--below u-width-100p">
                                            This image will appear in the masthead of your page as a background image. We recommend using an image that's 1200x1200 or larger. Grayscale or duotone images work best.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--color">
                                    <div class="c-form-item__label">
                                        <label for="accentColor" class="c-form-item-label-text">Accent Color</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-color v-model="formData.accentColor" id="accentColor" name="accentColor"></forms-color>
                                        <div class="c-notes c-notes--below">
                                            Customize the look of your page with an accent color.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{ name: 'settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {

    			// Form Data
                formData: {
                	accentColor: '#0098d8',
                }

            };
        },
    	components: {
    		'forms-color': require('./../../../forms/Color.vue')
        }
    };
</script>