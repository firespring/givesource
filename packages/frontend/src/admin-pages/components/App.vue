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