// Bind Twitter Alert
ko.bindingHandlers.alert = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element, alertInfo, dismissBtn, alertMessage;
		$element = $(element);
		alertInfo = ko.utils.unwrapObservable(valueAccessor());

		dismissBtn = $("<button/>", {
			"type": "button",
			"class": "close",
			"data-dismiss": "alert"
		}).html("&times;");

		alertMessage = $("<p/>").html(alertInfo.message);

		$element.addClass("alert alert-" + alertInfo.priority)
				.append(dismissBtn)
				.append(alertMessage);
	}
};