

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