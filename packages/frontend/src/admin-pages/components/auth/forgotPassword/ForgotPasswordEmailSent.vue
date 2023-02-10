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
  <div class="c-page-section__main">
    <h4>We need you to confirm your identity</h4>

    <p>
      If the email you entered matches our records, we have sent you an email with a link to reset your password.
    </p>

    <footer class="c-form-actions c-form-actions--compact">
      <router-link
        :to="{ name: 'login' }"
        class="c-btn c-btn--text c-btn--neutral"
      >
        Return to login
      </router-link>
    </footer>
  </div>
</template>

<script>
export default {}
</script>
