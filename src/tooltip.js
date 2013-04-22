
// Bind Twitter Tooltip
ko.bindingHandlers.tooltip = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var tooltipBindingValues, tooltipTitle, tooltipPlacement, options;

		// read tooltip options
		tooltipBindingValues = ko.utils.unwrapObservable(valueAccessor());

		// set tooltip title
		tooltipTitle = tooltipBindingValues.title;

		// set tooltip placement
		tooltipPlacement = tooltipBindingValues.placement;

		// set tooltip trigger
		tooltipTrigger = tooltipBindingValues.trigger;

		options = {
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
