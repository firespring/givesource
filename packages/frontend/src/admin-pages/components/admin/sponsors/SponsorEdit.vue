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
                            <span><router-link :to="{ name: 'sponsors-tiers-list' }">Sponsors</router-link></span>
                            <span><router-link :to="{ name: 'sponsors-list' }">Gold</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Edit Sponsor</h1>
                    </div>
                </div>

                <div class="o-app-main-content">
                    <form>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="name" class="c-form-item-label-text">Name</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input v-model="formData.name" type="text" name="name" id="name">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--url">
                                    <div class="c-form-item__label">
                                        <label for="url" class="c-form-item-label-text">URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input v-model="formData.url" type="url" name="sponsorUrl" id="sponsorUrl" placeholder="http://">
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--select">
                                    <div class="c-form-item__label">
                                        <label for="tier" class="c-form-item-label-text">Tier</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <select v-model="formData.tier" id="tier" name="tier" class="u-width-auto">
                                            <option value="1">Platinum</option>
                                            <option value="2">Gold</option>
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
                                        <button type="button" class="c-btn c-btn--good" id="fileFieldDefaultTrigger" data-control="fileFieldDefault" data-filenames="fileFieldDefaultFilenames">Select File</button>
                                        <div class="filenames" id="fileFieldDefaultFilenames"></div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{name:'sponsors-list'}" class="c-btn c-btn--text c-btn--neutral">Cancel</router-link>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
    module.exports ={
    	data: function () {
    		return {
    			sponsor: {},

    			// Form Data
                formData: {
                	name: 'Sponsor #3',
                    url: '',
                    tier: '1',
                    logo: '',
                }
            };
        }
    };
</script>