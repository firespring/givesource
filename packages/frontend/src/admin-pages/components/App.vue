<!--
  ~ Copyright 2018 Firespring, Inc.
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
    <div class="o-wrap">
        <router-view></router-view>
        <modals></modals>
    </div>
</template>

<script>
	module.exports = {
		components: {
			'modals': require('./modals/Modals.vue')
		}
	};

	// Ripple-effect animation
	(function ($) {
		$('body').delegate('.c-btn', 'click', function (e) {
			const rippler = $(this);

			// create .ink element if it doesn't exist
			if (rippler.find('.ink').length === 0) {
				rippler.append('<span class="ink"></span>');
			}

			const ink = rippler.find('.ink');

			// prevent quick double clicks
			ink.removeClass('animate');

			// set .ink diametr
			if (!ink.height() && !ink.width()) {
				const d = Math.max(rippler.outerWidth(), rippler.outerHeight());
				ink.css({height: d, width: d});
			}

			// get click coordinates
			const x = e.pageX - rippler.offset().left - ink.width() / 2;
			const y = e.pageY - rippler.offset().top - ink.height() / 2;

			// set .ink position and add class .animate
			ink.css({
				top: y + 'px',
				left: x + 'px'
			}).addClass('animate');
		})
	})(jQuery);

</script>