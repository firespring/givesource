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
    <div class="c-page-section__main">
        <h4>We need you to confirm your identity</h4>

        <p>
            If the email you entered matches our records, we have sent you an email with a link to reset your password.
        </p>

        <footer class="c-form-actions c-form-actions--compact">
            <router-link :to="{ name: 'login' }" class="c-btn c-btn--text c-btn--neutral">Return to login</router-link>
        </footer>

    </div>
</template>

<script>
	module.exports = {}
</script>