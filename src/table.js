(function($) {
	ko.dataTable = {
		ViewModel: function(options) {
			var self = this;
			
			this.items = ko.observableArray(options.items);
			this.columns = ko.observableArray(options.columns)
			
			this.itemsCount = ko.computed(function() {
				return self.items().length;
			});

			this.columnsCount = ko.computed(function() {
				return self.columns().length;
			});

			/*this.content = ko.computed(function() {
				self.dataBind();
			}); */
		}
	};

	var te = new ko.nativeTemplateEngine();

	te.addTemplate = function(name, html) {
		document.write('<script type="text/html" id="' + name + '">' + html + '</script>');
	};

	te.addTemplate('kb_table_header', '\
		<thead><tr>\
				<th data-bind="template: {\'name\':\'kbl_group_all\', \'data\':$data}"></th>\
			<!-- ko foreach: columnsData -->\
				<th>\
					<!-- ko if: $data.sortable -->\
					<a data-bind="html: display, click: $root.doSort"></a>\
					<!-- /ko -->\
					<!-- ko ifnot: $data.sortable -->\
					<div data-bind="html: display"></div>\
					<!-- /ko -->\
				</th>\
			<!-- /ko -->\
		</tr></thead>');
	te.addTemplate('kb_table_item', '<tbody data-bind="foreach: items">\
			<tr>\
				<td data-bind="template: { \'name\': \'kbl_group\', \'data\': $data }"></td>\
				<!-- ko foreach: $parent.columnsData -->\
				<td data-bind="html: $parent[name]"></td>\
				<!-- /ko -->\
				<td data-bind="template: { \'name\': \'kbl_actions\', \'data\': $data }"></td>\
			</tr></tbody>');

	ko.bindingHandlers.dataTable = {
		init: function(element, valueAccessor, allBindingsAccessor) {
			var viewModel = valueAccessor(), allBindings = allBindingsAccessor();

			var tableHeaderTemplate = allBindings.headerTemplate || "kb_table_header";
			var tableListTemplate = allBindings.itemTemplate || "kbl_table_item";

			ko.renderTemplate(tableHeaderTemplate, viewModel, {templateEngine: te}, $('<div />').appendTo(table), "replaceNode");
			ko.renderTemplate(tableListTemplate, viewModel, {templateEngine: te}, $('<div />').appendTo(table), "replaceNode");
			
			return {'controlsDescendantBindings': true};
		},
		update: function(element, valueAccessor, allBindingsAccessor) {
		}
	};
}(jQuery));