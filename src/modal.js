(function($) {
	ko.bootstrap.ModalModel = function(options) {
		var self = this;

		if (typeof options === 'undefined') {
			options = {};
		}

		options = $.extend({
			buttonTemplate: 'kb_modal_button'
		}, options);

		self.buttonTemplate = 'kb_modal_button';

		self.title = ko.observable();
		self.body = ko.observable();
		self.buttonsData = ko.observableArray([]);
		self.id = ko.observable();
		self.modal = function() {
			return $("#" + self.id());
		};

		self.buttons = ko.computed(function() {
			for (var b in self.buttonsData()) {
				self.buttonsData()[b].modal(self);
			}

			return self.buttonsData();
		});

		self.show = function() {
			self.modal().modal("show");
		};

		self.hide = function() {
			self.modal().modal("hide");
		};
	};

	ko.bootstrap.ModalButtonModel = function(options) {
		var self = this;

		if (typeof options === 'undefined') {
			options = {};
		}

		options = $.extend({
			clazz: 'btn',
			name: 'Cancel',
			action: null
		}, options);

		self.clazz = ko.observable(options.clazz);
		self.name = ko.observable(options.name);
		self.modal = ko.observable();

		self.id = ko.computed(function() {
			return (self.modal() ? self.modal().id() : null);
		});

		self.action = function() {
			if (typeof options.action === 'function') {
				options.action();
			} else {
				self.modal().hide();
			}
		};
	};

	te.addTemplate("kb_modal", '\
	<div class="modal hide fade" data-bind="attr: {\'id\': id}">\
		<div class="modal-header">\
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
			<h3 data-bind="text: title">Modal header</h3>\
		</div>\
		<div class="modal-body" data-bind="html:body">\
		</div>\
		<div class="modal-footer" data-bind="foreach: buttons">\
			<!-- ko template: {\'name\': $parent.buttonTemplate} -->\
			<!-- /ko -->\
		</div>\
	</div>');

	te.addTemplate("kb_modal_button", '\
			<div data-bind="click: action, text:name, attr: {\'class\': clazz}"></div>\
		');

	ko.bindingHandlers.modal = {
		init: function() {
			return {'controlsDescendantBindings': true};
		},
		update: function(element, valueAccessor, allBindingsAccessor, vm, bindingContext) {
			var viewModel = valueAccessor(), allBindings = allBindingsAccessor();

			var template = allBindings.headerTemplate || "kb_modal";
			var action = allBindings.action || "click";

			ko.renderTemplate(template, viewModel, {templateEngine: te}, $('<div />').appendTo($('body')), "replaceNode");

			$(element).bind(action, function() {
				$("#" + viewModel().id()).modal('show');
			});
		}
	};
}(jQuery));