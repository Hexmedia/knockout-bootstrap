

// Bind Twitter Progress
ko.bindingHandlers.progress = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element), bar;

		bar = $("<div/>", {
			"class": "bar",
			"data-bind": "style: { width:" + valueAccessor() + " }"
		});

		$element.attr("id", ko.bootstrap.guid())
				.addClass("progress progress-info")
				.append(bar);
		ko.applyBindingsToDescendants(viewModel, $element[0]);
	}
};