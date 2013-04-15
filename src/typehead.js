
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
