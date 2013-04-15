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