//UUID
function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
}

function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Outer HTML
(function($) {
	$.fn.outerHtml = function() {
		if (this.length == 0)
			return false;
		var elem = this[0], name = elem.tagName.toLowerCase();
		if (elem.outerHTML)
			return elem.outerHTML;
		var attrs = $.map(elem.attributes, function(i) {
			return i.name + '="' + i.value + '"';
		});
		return "<" + name + (attrs.length > 0 ? " " + attrs.join(" ") : "") + ">" + elem.innerHTML + "</" + name + ">";
	};
})(jQuery);

// Bind twitter typeahead
ko.bindingHandlers.typeahead = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element);
		var typeaheadArr = ko.utils.unwrapObservable(valueAccessor());

		$element.attr("autocomplete", "off")
				.typeahead({
			'source': typeaheadArr
		});
	}
};

// Bind Twitter Progress
ko.bindingHandlers.progress = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element);

		var bar = $('<div/>', {
			'class': 'bar',
			'data-bind': 'style: { width:' + valueAccessor() + ' }'
		});

		$element.attr('id', guid())
				.addClass('progress progress-info')
				.append(bar);

		ko.applyBindingsToDescendants(viewModel, $element[0]);
	}
}

// Bind Twitter Alert
ko.bindingHandlers.alert = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element);
		var alertInfo = ko.utils.unwrapObservable(valueAccessor());

		var dismissBtn = $('<button/>', {
			'type': 'button',
			'class': 'close',
			'data-dismiss': 'alert'
		}).html('&times;');

		var alertMessage = $('<p/>').html(alertInfo.message);

		$element.addClass('alert alert-' + alertInfo.priority)
				.append(dismissBtn)
				.append(alertMessage);
	}
};

// Bind Twitter Tooltip
ko.bindingHandlers.tooltip = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// read tooltip options
		var tooltipBindingValues = ko.utils.unwrapObservable(valueAccessor());

		// set tooltip title
		var tooltipTitle = tooltipBindingValues.title;

		// set tooltip placement
		var tooltipPlacement = tooltipBindingValues.placement;

		// set tooltip trigger
		var tooltipTrigger = tooltipBindingValues.trigger;

		var options = {
			title: tooltipTitle
		};

		ko.utils.extend(options, ko.bindingHandlers.tooltip.options);

		if (tooltipPlacement) {
			options.placement = tooltipPlacement;
		}

		if (tooltipTrigger) {
			options.trigger = tooltipTrigger;
		}

		$(element).tooltip(options);
	},
	options: {
		placement: "top",
		trigger: "hover"
	}
};

// Bind Twitter Popover
ko.bindingHandlers.popover = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// read popover options 
		var popoverBindingValues = ko.utils.unwrapObservable(valueAccessor());

		// set popover title 
		var popoverTitle = popoverBindingValues.title;

		// set popover template id
		var tmplId = popoverBindingValues.template;

		// set popover trigger
		var trigger = 'click';

		if (popoverBindingValues.trigger) {
			trigger = popoverBindingValues.trigger;
		}

		// update triggers
		if (trigger === 'hover') {
			trigger = 'mouseenter mouseleave';
		} else if (trigger === 'focus') {
			trigger = 'focus blur';
		}

		// set popover placement
		var placement = popoverBindingValues.placement;

		// get template html
		var tmplHtml = $('#' + tmplId).html();

		// create unique identifier to bind to
		var uuid = guid();
		var domId = "ko-bs-popover-" + uuid;

		// create correct binding context
		var childBindingContext = bindingContext.createChildContext(viewModel);

		// create DOM object to use for popover content
		var tmplDom = $('<div/>', {
			"class": "ko-popover",
			"id": domId
		}).html(tmplHtml);

		// set content options
		options = {
			content: $(tmplDom[0]).outerHtml(),
			title: popoverTitle
		};

		if (placement) {
			options.placement = placement;
		}

		// Need to copy this, otherwise all the popups end up with the value of the last item
		var popoverOptions = $.extend({}, ko.bindingHandlers.popover.options, options);

		// bind popover to element click
		$(element).bind(trigger, function() {
			var popoverAction = 'show';
			var popoverTriggerEl = $(this);

			// popovers that hover should be toggled on hover
			// not stay there on mouseout
			if (trigger !== 'click') {
				popoverAction = 'toggle';
			}

			// show/toggle popover
			popoverTriggerEl.popover(popoverOptions).popover(popoverAction);

			// hide other popovers and bind knockout to the popover elements
			var popoverInnerEl = $('#' + domId);
			$('.ko-popover').not(popoverInnerEl).parents('.popover').remove();

			// if the popover is visible bind the view model to our dom ID
			if ($('#' + domId).is(':visible')) {
				ko.applyBindingsToDescendants(childBindingContext, $('#' + domId)[0]);
			}

			// bind close button to remove popover
			$(document).on('click', '[data-dismiss="popover"]', function(e) {
				popoverTriggerEl.popover('hide');
			});
		});

		// Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
		return {controlsDescendantBindings: true};
	},
	options: {
		placement: "right",
		title: "",
		html: true,
		content: "",
		trigger: "manual"
	}
};

var te = new ko.nativeTemplateEngine();

te.addTemplate = function(name, html) {
	document.write('<script type="text/html" id="' + name + '">' + html + '</script>');
};

te.addTemplate("kb_modal", '\
	<div class="modal hide fade" data-bind="attr: {\'id\': id}">\
		<div class="modal-header">\
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
			<h3 data-bind="text: title">Modal header</h3>\
		</div>\
		<div class="modal-body" data-bind="html:body">\
		</div>\
		<div class="modal-footer">\
		</div>\
	</div>');

te.addTemplate("kb_modal_button", '\
	<div class="btn" data-bind="click: action, text:name"></div>\
');

ko.modalModel = function() {
	this.title = ko.observable();
	this.body = ko.observable();
	this.buttons = ko.observableArray([]);
	this.id = ko.observable();
	this.buttonTemplate = ko.observable();
};

ko.modalButtonModel = function() {
	this.action = function() {
		alert('aa');
	};
	this.name = ko.observable();
};

var modalModel = {};

ko.bindingHandlers.modal = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// read popover options 
		var bindingValues = ko.utils.unwrapObservable(valueAccessor());

		// set popover title 
		var title = bindingValues.title;
		var body = bindingValues.body;
		var buttons = bindingValues.buttons;
		var template = bindingValues.template || "kb_modal";
		var id = template + "_modal";
		var buttonTemplate = bindingValues.buttonTemplate || "kb_modal_button";

		// set popover trigger
		var trigger = bindingValues.trigger || "click";

		$(element).bind(trigger, function() {
			$("#" + id).modal();
		});

		if (!$("#" + id).length) {
			modalModel[id] = new ko.modalModel();
		}

		modalModel[id].title(title);
		modalModel[id].body(body);
		modalModel[id].id(id);
		modalModel[id].buttonTemplate(buttonTemplate);

		if (!$("#" + id).length) {
			ko.renderTemplate(template, modalModel[id], {templateEngine: te}, $('<div />').prependTo($('body')), "replaceNode");
		}
	},
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// read popover options 
		var bindingValues = ko.utils.unwrapObservable(valueAccessor());

		// set popover title 
		var template = bindingValues.template || "kb_modal";
		var buttonTemplate = bindingValues.template || "kb_modal_button";

		var id = template + "_modal";
		var buttons = bindingValues.buttons;

		$("#" + id).find('.modal-footer').html("");

		for (var i in buttons) {
			var button = new ko.modalButtonModel();

			if (typeof buttons[i].action === "function") {
				button.action = function() {
					buttons[i].action();
					$("#" + id).modal('hide');
				};
			} else {
				button.action = function() {
					$('#' + id).modal("hide");
				};
			}

			button.name(buttons[i].name);

			ko.renderTemplate(buttonTemplate, button, {templateEngine: te}, $('<div />').appendTo($("#" + id).find('.modal-footer')), "replaceNode");
		}
	},
	options: {
	}
};