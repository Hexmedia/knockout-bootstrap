

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