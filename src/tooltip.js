
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
