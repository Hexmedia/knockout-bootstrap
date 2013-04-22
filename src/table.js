(function($) {
	ko.bootstrap.TableModel = function() {
		var self = this;

		this.items = ko.observableArray([]);
		this.columns = ko.observableArray([]);

		this.itemsCount = ko.computed(function() {
			return self.items().length;
		});

		this.columnsCount = ko.computed(function() {
			return self.columns().length;
		});
	};

	te.addTemplate("kb_table_header", "\
		<thead><tr>\
			<!-- ko foreach: columns -->\
				<th data-bind=\"attr: {'class': name}\">\
					<div data-bind=\"html: display\"></div>\
				</th>\
			<!-- /ko -->\
		</tr></thead>");
	te.addTemplate("kb_table_item", "<tbody data-bind=\"foreach: items\">\
			<tr data-bind=\"foreach: $parent.columns\">\
				<td data-bind=\"html: $parent[name]\"></td>\
			</tr></tbody>");

	ko.bindingHandlers.table = {
		init: function(element, valueAccessor, allBindingsAccessor) {
			return {"controlsDescendantBindings": true};
		},
		update: function(element, valueAccessor, allBindingsAccessor) {
			var viewModel = valueAccessor(), allBindings = allBindingsAccessor(), tableHeaderTemplate, tableListTemplate;

			tableHeaderTemplate = allBindings.headerTemplate || "kb_table_header";
			tableListTemplate = allBindings.itemTemplate || "kb_table_item";

			ko.renderTemplate(tableHeaderTemplate, viewModel, {templateEngine: te}, $("<div />").appendTo(element), "replaceNode");
			ko.renderTemplate(tableListTemplate, viewModel, {templateEngine: te}, $("<div />").appendTo(element), "replaceNode");
		}
	};
}(jQuery));