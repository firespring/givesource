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
    <div>
        <layout-hero :presentedBy="true">
            <h1 slot="title">Contact Us</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <form>
                    <fieldset>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="nameFirst">Your Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input type="text" name="nameFirst" id="nameFirst" placeholder="First Name" required>
                                    </div>
                                    <div class="grid-item">
                                        <input type="text" name="nameLast" id="nameLast" placeholder="Last Name" required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="email">Your Email</label>
                            </div>
                            <div class="form-item__control">
                                <input type="email" name="email" id="email" required>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="questions">Your Questions</label>
                            </div>
                            <div class="form-item__control">
                                <textarea name="questions" id="questions" required></textarea>
                            </div>
                        </div>

                    </fieldset>

                    <div class="form-actions flex justify-center items-center">
                        <button type="submit" class="btn btn--blue btn--round">
                            Send Your Questions
                        </button>
                    </div>
                </form>

                <div class="notes text-c" style="margin-top: 1rem;">
                    (You can also call our support line at 1-111-111-1111.)
                </div>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	module.exports = {
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Contact Us');
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>