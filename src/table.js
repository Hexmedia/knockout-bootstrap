(function($) {
	ko.dataTable = {
		ViewModel: function(options) {
			var self = this;

			this.options = {
				loader: null,
				items: [],
				columns: [],
				additionalData: {}
			};

			$.extend(this.options, options);

			this.loader = this.options.loader;

			this.filter = ko.observable("");

			this.additionalData = ko.observable(this.options.additionalData);
			this.itemsData = ko.observableArray(this.options.items);
			this.itemsDataCount = ko.computed(function() {
				return self.itemsData().length;
			});
			this.allItemsCount = ko.observable();
			this.columnsData = ko.observableArray(this.options.columns);
			this.columnsDataCount = ko.computed(function() {
				return self.columnsData().length;
			});
			this.filter = ko.observable();

			this.items = ko.computed(function() {
				var items = self.itemsData();

				$.each(items, function(key, val) {
					items[key] = val;
					items[key].checked = ko.observable(false);
					items[key].isChecked = ko.computed({
						read: function() {
							return val.checked();
						},
						write: function() {
							val.checked(!val.checked());
							self.allChecked(false);
						}
					});
				});

				return items;
			});

			this.itemsCount = ko.computed(function() {
				return self.items().length;
			});

			this.columns = ko.computed(function() {
				var columns = [];
				var i = 0;

				columns[i++] = {
					display: '<input type="checkbox" value="1" name="group[all]" />',
					name: 'group',
					sortable: false
				};

				$.each(self.columnsData(), function(k, column) {
					columns[i++] = column;
				});

				columns[i++] = {
					display: "Add Action", //FIXME add add action here
					name: "actions",
					sortable: false
				};

				return columns;
			});

			this.columnsCount = ko.computed(function() {
				return self.columns().length;
			});

			this.sort = ko.observable();
			this.sortDirection = ko.observable();

			this.totalPages = ko.computed(function() {
				return self.allItemsCount() / self.pageSize();
			});
			this.isFirstPage = ko.computed(function() {
				return self.page() === 1;
			});
			this.isLastPage = ko.computed(function() {
				return self.totalPages() === self.page();
			});
			this.pages = ko.computed(function() {
				var pages = [];

				var s = Math.floor(Math.max(1, self.page() - self.showPages() / 2));
				var e = Math.floor(Math.min(self.totalPages(), self.page() + self.showPages() / 2));
				var r = e - s;

				if (r < self.showPages()) {
					if (e === self.totalPages() && s !== 1) {
						s = Math.floor(Math.max(1, s - self.showPages() + r));
					} else if (s === 1 && e !== self.totalPages()) {
						e = Math.floor(Math.min(self.totalPages(), self.showPages()));
					}
				}

				for (; s <= e; s++) {
					pages.push(s);
				}

				return pages;
			});

			this.doSort = function(obj) {
				var name = obj.name;

				if (self.sort() === obj.name) {
					self.sortDirection(self.sortDirection() === "ASC" ? "DESC" : "ASC");
				} else {
					self.sort(obj.name);
					self.sortDirection("DESC");
				}
			};

			this.allChecked = ko.observable(false);

			this.isChecked = ko.computed({
				read: function() {
					return self.allChecked();
				},
				write: function() {
					var checked = !self.allChecked();

					for (var i in self.items()) {
						self.items()[i].checked(checked);
					}

					return self.allChecked(checked);
				}
			});

			this.dataBind = function() {
				var post = this.additionalData();

				post.page = this.page();
				post.pageSize = this.pageSize();
				post.sort = this.sort();
				post.sortDirection = this.sortDirection();

				post.filter = this.filter();

				self.loader(function(data) {
					if (typeof data.items !== 'undefined') {
						self.itemsData(data.items);
					}

					if (typeof data.columns !== 'undefined') {
						self.columnsData(data.columns);
					}

					if (typeof data.pageSizeOptions !== 'undefined') {
						self.pageSizeOptions(data.pageSizeOptions);
					}

					if (typeof data.itemsCount !== 'undefined') {
						self.allItemsCount(data.itemsCount);
					}
				}, post);
			};
			
			this.content = ko.computed(function() {
				self.dataBind();
			});
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