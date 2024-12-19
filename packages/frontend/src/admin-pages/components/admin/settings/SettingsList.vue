<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <div class="o-app">
    <navigation />
    <main id="main-content" class="o-app__main o-app__main--compact">
      <div class="o-app_main-content o-app_main-content--md">
        <div class="o-app-main-content">
          <paymentspring-keys-banner />

          <div class="o-app-main-content">
            <section class="c-page-section c-page-section--headless c-page-section--border c-page-section--shadow c-page-section--segmented">
              <div class="c-page-section__main">
                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-event' }">
                      Event Settings
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Modify your event's name, dates, etc.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-agreements' }">
                      Event Agreements
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Manage your event's various agreements and policies.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-contact' }">
                      Contact Settings
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Manage the email addresses and contact methods associated with your account.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-site-appearance' }">
                      Site Appearance
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Modify your site's logo, colors, and other visual settings.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-emails' }">
                      Emails
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Customize the content of various emails that your site sends out.
                  </div>
                </div>

                <hr
                  v-if="isSuperAdmin"
                  class="expand"
                >

                <div
                  v-if="isSuperAdmin"
                  class="c-page-section-segment"
                >
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-payment-gateway' }">
                      Payment Gateway Settings
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Integrate with PaymentSpring to process credit cards.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-analytics' }">
                      Google Analytics Settings
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Integrate with your Google Analytics account to track traffic to your site.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-admins-list' }">
                      Manage Admins
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Invite additional admin users
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-seo' }">
                      SEO Settings
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Manage how your website appears in search engine results.
                  </div>
                </div>

                <hr class="expand">

                <div class="c-page-section-segment">
                  <h3 class="c-page-section-segment__title">
                    <router-link :to="{ name: 'settings-social-sharing' }">
                      Social Sharing Settings
                    </router-link>
                  </h3>
                  <div class="c-notes c-notes--below">
                    Manage the text and image that is shared via the social media logos on donation pages.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    isSuperAdmin: function () {
      return this.isSuperAdminUser()
    }
  }
}
</script>
