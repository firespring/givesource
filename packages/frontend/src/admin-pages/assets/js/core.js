/*
 * Copyright (C) 2017  Firespring
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$(document).ready(function() {

/* ============================================================================
App Nav JS
============================================================================ */

/* Toggle app nav */

$('#js-app-nav-toggle').click(function() {

	if ($('body').hasClass('has-app-nav')) {
		$('body').removeClass('has-app-nav');
	} else {
		$('body').addClass('has-app-nav');
	}

});

/* Toggle app nav submenus */

$('.js-app-nav-child-trigger').click(
	function(e) {
		
		e.preventDefault();

		if ($(this).parents('.level-0').hasClass('child-open')) {
			
			$(this).siblings('.child').slideToggle(function() {
				$(this).parents('.level-0').removeClass('child-open');
			});
			
		} else {
			
			$(this).siblings('.child').slideToggle();
			$(this).parents('.level-0').addClass('child-open');
			
		}

	}
);

/* ============================================================================
Navigate to menubar nav selection
============================================================================ */

$('.js-menubar-nav-select').change(function() {
	window.location.href = $(this).val();
});

/* ============================================================================
Toggle account nav popups
============================================================================ */

$('.js-user-popup-toggle').click(function(e) {
	
	e.preventDefault();
	var thisParent = $(this).parent();
	$('.o-menubar-popup-parent').removeClass('o-menubar-popup-parent--active');
	$('.o-menubar-popup').fadeOut(200);
	$(thisParent).addClass('o-menubar-popup-parent--active').find('.o-menubar-popup').fadeIn(200);

});

$('.o-menubar-popup-parent').lazybind(
    'mouseout',
    function() {
		$('.o-menubar-popup-parent').removeClass('o-menubar-popup-parent--active');
		$('.o-menubar-popup').fadeOut(200);
    },
    500,
    'mouseover'
);

/* ============================================================================
Tooltips
============================================================================ */

$('.tooltip-trigger.tooltip-trigger--left').tooltipster({
	distance: 2,
	maxWidth: 300,
	delay: 200,
	side: 'left'
});

$('.tooltip-trigger.tooltip-trigger--right').tooltipster({
	distance: 2,
	maxWidth: 300,
	delay: 200,
	side: 'right'
});

$('.tooltip-trigger.tooltip-trigger--top').tooltipster({
	distance: 2,
	maxWidth: 300,
	delay: 200,
	side: 'top'
});

$('.tooltip-trigger.tooltip-trigger--bottom').tooltipster({
	distance: 2,
	maxWidth: 300,
	delay: 200,
	side: 'bottom'
});

$('.has-tooltip').tooltipster({
	distance: 4,
	maxWidth: 300,
	delay: 200,
	side: 'bottom'
});

/* ============================================================================
Convert date/time fields to text fields on desktop
============================================================================ */

if (!/Mobi/.test(navigator.userAgent)) {

	$('input[type=date]').attr('type','text');

	$('input[type=time]').attr('type','text').timepicker({
		scrollDefault: 'now',
		timeFormat: 'g:i a',
		closeOnWindowScroll: true,
		className: 'timepicker'
	});
	
}

/* ============================================================================
Handle disabled link buttons
============================================================================ */

$('.c-btn--disabled').click(
	function(e) {
		e.preventDefault();
	}
);

/* ============================================================================
Toggle collapsible form section
============================================================================ */

$('.js-page-section-toggle').click(
	function(e) {
		
		e.preventDefault();
		
		var pageSection = $(this).closest('.c-page-section');
		var pageSectionMain = pageSection.children('.c-page-section__main');
		
		if (pageSection.hasClass('c-page-section--expanded')) {
			
			pageSectionMain.slideToggle(function() {
				pageSection.removeClass('c-page-section--expanded');
			});
			
		} else {
		
			pageSectionMain.slideToggle(function() {
				pageSection.addClass('c-page-section--expanded');
			});				
			
		}
	
	}
);

/* ============================================================================
Configure combobox selects
============================================================================ */

$('.js-combobox').chosen({
	allow_single_deselect: true,
	width: '100%'
});

/* ============================================================================
Configure colorpicker fields
============================================================================ */

if (!/Mobi/.test(navigator.userAgent)) {

	$('input[type=color]').attr('type','text').minicolors();
	
}

/* ============================================================================
Configure auto-size textareas
============================================================================ */

autosize($('textarea'));

/* ============================================================================
Toggle checked table rows
============================================================================ */

$('.js-check-this-row').click(function() {
	var thisInput = $(this).find('input');
	var thisInputRow = thisInput.parents('tr');
	var allInputs = thisInput.parents('tbody').find('.js-check-this-row input').length;
	var allInputsChecked = thisInput.parents('tbody').find('.js-check-this-row input:checked').length;
	var checkAllRows = thisInput.parents('table').find('.js-check-all-rows');
	
	if (thisInput.is(':checked')) {
		thisInputRow.addClass('checked');
	} else {
		thisInputRow.removeClass('checked');
	}
		
	if (allInputsChecked == allInputs) {
		checkAllRows.prop('checked', true);
	} else {
		checkAllRows.prop('checked', false);
	}

});

$('.js-check-all-rows').click(function() {
	var thisInput = $(this);
	var thisInputTable = thisInput.parents('table');
	
	if (thisInput.is(':checked')) {
		thisInputTable.find('tbody tr').addClass('checked');
		thisInputTable.find('.js-check-this-row input').prop('checked', true);
	} else {
		thisInputTable.find('tbody tr').removeClass('checked');
		thisInputTable.find('.js-check-this-row input').prop('checked', false);
	}

});

/* ============================================================================
Handle reorder-able tables
============================================================================ */

var fixHelper = function(e, ui) {
	ui.children().each(function() {
		$(this).width($(this).width());
	});
	return ui;
};

if ($('.js-table-reorder').length > 0) {
	$('.js-table-reorder tbody').sortable({
		cursor: 'move',
		handle: '.c-drag-handle',
		helper: fixHelper,
		opacity: 0.5,
		placeholder: 'reorder-placeholder'
	});
}

/* ============================================================================
Toggle button dropdown menu
============================================================================ */

$('.js-btn-dropdown-trigger').click(function(e) {

	e.preventDefault();
	$('.c-btn-dropdown').removeClass('c-btn-dropdown--active');
	$('.c-btn-dropdown-menu').fadeOut();
	$(this).parent().addClass('c-btn-dropdown--active');
	$(this).siblings('.c-btn-dropdown-menu').fadeIn();

});

$('.c-btn-dropdown').lazybind(
    'mouseout',
    function() {
		$('.c-btn-dropdown').removeClass('c-btn-dropdown--active');
		$('.c-btn-dropdown-menu').fadeOut('fast');
    },
    250,
    'mouseover'
);

$('.c-btn-dropdown-menu a').click(
	function() {
		$('.c-btn-dropdown').removeClass('c-btn-dropdown--active');
		$('.c-btn-dropdown-menu').fadeOut();
	}
);

/* ============================================================================
Floating labels for text inputs
============================================================================ */

$('.js-floating-label').find('input, textarea').each(function(index) {

	var thisValue = $(this).val();

	if (thisValue != '') {
		$(this).siblings('label').hide();
		$(this).parents('.js-floating-label').addClass('has-floating-label--float', function() {
			$(this).find('label').show();
		});
	}	

	$(this).on('change', function() {
		if ($(this).val() == '') {
			$(this).parents('.js-floating-label').removeClass('has-floating-label--float');
		} else {
			$(this).siblings('label').hide();
			$(this).parents('.js-floating-label').addClass('has-floating-label--float', function() {
				$(this).find('label').show();
			});
		}
	});

});

$('.js-floating-label').find('input, textarea').on('focus', function() {
	$(this).parents('.js-floating-label').addClass('has-floating-label--float');
});

$('.js-floating-label').find('input, textarea').on('blur', function() {
	if ($(this).val() == '') {
		$(this).parents('.js-floating-label').removeClass('has-floating-label--float');
	}
});

/* Possibly deprecated
$('.js-floating-label').find('input, textarea').keyup(function() {
	if ($(this).val() == '') {
		$(this).addClass('empty');
	} else {
		$(this).removeClass('empty');
	}
});
*/

/* ============================================================================
Autofocus on form inputs
============================================================================ */

$('input[autofocus]').focus();

/* ============================================================================
Toggle form control sub-options
============================================================================ */

/* Radio Buttons, Default */

$('.c-input-list--radio > li > input[type="radio"]').click(function() {
	var thisInput = $(this);
	var thisInputParent = thisInput.parent();
	var thisInputList = thisInputParent.parent();
	
	thisInputList.children('.has-sub-options').removeClass('has-sub-options--show');
	
	if (thisInputParent.hasClass('has-sub-options')) {
		thisInputParent.addClass('has-sub-options--show');
		thisInputParent.find('.c-form-item:first-child > .c-form-item__control > input').focus();
	}
	
});

/* Radio Buttons, Inline */

$('.c-input-list--radio.c-input-list--inline > li > input[type="radio"]').click(function() {
	var thisInput = $(this);
	var thisRel = $(this).attr('rel');;
	var thisInputParent = thisInput.parent();
	var thisInputList = thisInputParent.parent();
	
	thisInputList.siblings('div').children('.sub-options-inline').removeClass('sub-options-inline--show');
	thisInputList.siblings('div').removeClass('sub-options-inline-wrapper--show');
	
	if (thisInputParent.hasClass('has-sub-options')) {
		thisInputList.addClass('has-sub-options--show');
		thisInputParent.addClass('has-sub-options--show');
		$('#' + thisRel).parent().addClass('sub-options-inline-wrapper--show');
		$('#' + thisRel).addClass('sub-options-inline--show');
		$('#' + thisRel).find('.c-form-item:first-child > .c-form-item__control > input').focus();
	}
	
});

/* Checkboxes, Default */

$('.c-input-list--checkbox > li > input[type="checkbox"]').click(function() {
	var thisInput = $(this);
	var thisInputParent = thisInput.parent();
	var thisInputList = thisInputParent.parent();
	
	if (thisInputParent.hasClass('has-sub-options')) {
	
		if (thisInput.is(':checked')) {
			thisInputParent.addClass('has-sub-options--show');	
			thisInputParent.find('.c-form-item:first-child > .c-form-item__control > input').focus();
		} else {
			thisInputParent.removeClass('has-sub-options--show');
			thisInputParent.find('.c-form-item:first-child > .c-form-item__control > input').blur();
		}
		
	}
	
});

/* Checkboxes, Toggle */

$('input[type="checkbox"].js-toggle-display').click(function() {
	var thisInput = $(this);
	var toggleDisplay = $(this).data('toggle-display');
	
	if (thisInput.is(':checked')) {
		$('#' + toggleDisplay).removeClass('u-hidden').css('display','none').slideDown();
	} else {
		$('#' + toggleDisplay).slideUp(function() {
			$(this).addClass('u-hidden');
		});
	}
	
});

/* Selects, Default */

$('select.js-has-sub-options').change(function() {

    var toggleSubOption = $(this).children('option:selected').data('sub-option');

    /* Hide any currently displaying sub-options */
    $(this).siblings('div.sub-options-wrapper').removeClass('sub-options-wrapper--show').children('div.sub-options').removeClass('sub-options--show');

    /* Slide down selected option's sub options, if any */
    $(this).siblings('div.sub-options-wrapper').addClass('sub-options-wrapper--show')
    $('#' + toggleSubOption).addClass('sub-options--show')

});

/* Switches, Default */

$('.c-form-item--switch > .c-form-item__control > .js-toggle-sub-options input[type="checkbox"]').click(function() {
	var thisInput = $(this);
	var thisInputParent = thisInput.parents('.js-toggle-sub-options');
	
	if (thisInputParent.hasClass('js-toggle-sub-options')) {
	
		if (thisInput.is(':checked')) {
			thisInputParent.addClass('has-sub-options--show');
			thisInputParent.siblings('.sub-options').find('.c-form-item:first-child > .c-form-item__control > input').focus();
		} else {
			thisInputParent.removeClass('has-sub-options--show');
			thisInputParent.siblings('.sub-options').find('.c-form-item:first-child > .c-form-item__control > input').blur();
		}
		
	}
	
});

/* Country Selects */

$('select.js-country-select').change(function() {

	var thisCountryOptions = $(this).data('options');

	$('[id*=' + thisCountryOptions).addClass('u-hidden');
    
    if ($(this).children('option:selected').hasClass('has-regions')) {
    	$('#' + thisCountryOptions + '-' + $(this).val()).removeClass('u-hidden');
    } else {
    	$('#' + thisCountryOptions + '-custom').removeClass('u-hidden');
    }

});

/* ============================================================================
Alerts
============================================================================ */

$('.c-alert__close button').click(function() {
	$(this).parents('.c-alert').fadeOut('slow', function() {
		$(this).remove();
	});
});

});

/* ============================================================================
jQuery Delay Bind Event Handler
http://www.ideawu.com/blog/2011/05/jquery-delay-bind-event-handler-lazy-bind.html
============================================================================ */

(function($){
   $.fn.lazybind = function(event, fn, timeout, abort){
        var timer = null;
        $(this).bind(event, function(){
            timer = setTimeout(fn, timeout);
        });
        if(abort == undefined){
            return;
        }
        $(this).bind(abort, function(){
            if(timer != null){
                clearTimeout(timer);
            }
        });
    };
})(jQuery);

// Ripple-effect animation
(function($) {
	$('.c-btn').click(function(e){
		var rippler = $(this);

		// create .ink element if it doesn't exist
		if(rippler.find('.ink').length == 0) {
			rippler.append('<span class="ink"></span>');
		}

		var ink = rippler.find('.ink');

		// prevent quick double clicks
		ink.removeClass('animate');

		// set .ink diametr
		if(!ink.height() && !ink.width()) {
			var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
			ink.css({height: d, width: d});
		}

		// get click coordinates
		var x = e.pageX - rippler.offset().left - ink.width()/2;
		var y = e.pageY - rippler.offset().top - ink.height()/2;

		// set .ink position and add class .animate
		ink.css({
			top: y+'px',
			left:x+'px'
		}).addClass('animate');
	})
})(jQuery);