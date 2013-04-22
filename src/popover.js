// Bind Twitter Popover
ko.bindingHandlers.popover = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// read popover options 
		var popoverBindingValues, popoverTitle, tmplId, trigger, placement, tmplHtml, uuid, domId, childBindingContext, tmplDom,
				popoverOptions;

		popoverBindingValues = ko.utils.unwrapObservable(valueAccessor());

		// set popover title 
		popoverTitle = popoverBindingValues.title;

		// set popover template id
		tmplId = popoverBindingValues.template;

		// set popover trigger
		trigger = "click";

		if (popoverBindingValues.trigger) {
			trigger = popoverBindingValues.trigger;
		}

		// update triggers
		if (trigger === "hover") {
			trigger = "mouseenter mouseleave";
		} else if (trigger === "focus") {
			trigger = "focus blur";
		}

		// set popover placement
		placement = popoverBindingValues.placement;

		// get template html
		tmplHtml = $("#" + tmplId).html();

		// create unique identifier to bind to
		uuid = ko.bootstrap.guid();
		domId = "ko-bs-popover-" + uuid;

		// create correct binding context
		childBindingContext = bindingContext.createChildContext(viewModel);

		// create DOM object to use for popover content
		tmplDom = $("<div/>", {
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
		popoverOptions = $.extend({}, ko.bindingHandlers.popover.options, options);

		// bind popover to element click
		$(element).bind(trigger, function() {
			var popoverAction, popoverTriggerEl, popoverInnerEl;

			popoverAction = "show";
			popoverTriggerEl = $(this);

			// popovers that hover should be toggled on hover
			// not stay there on mouseout
			if (trigger !== "click") {
				popoverAction = "toggle";
			}

			// show/toggle popover
			popoverTriggerEl.popover(popoverOptions).popover(popoverAction);

			// hide other popovers and bind knockout to the popover elements
			popoverInnerEl = $("#" + domId);
			$(".ko-popover").not(popoverInnerEl).parents(".popover").remove();

			// if the popover is visible bind the view model to our dom ID
			if ($("#" + domId).is(":visible")) {
				ko.applyBindingsToDescendants(childBindingContext, $("#" + domId)[0]);
			}

			// bind close button to remove popover
			$(document).on("click", "[data-dismiss=\"popover\"]", function(e) {
				popoverTriggerEl.popover("hide");
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