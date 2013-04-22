(function($) {
	ko.bootstrap.PaginationModel = function(options) {
		var self = this;

		if (typeof options === "undefined") {
			options = {};
		}

		options = $.extend({
			page: 1,
			pageSize: 10,
			showPages: 10,
			itemCount: 1
		}, options);

		self.page = ko.observable(options.page);
		self.pageSize = ko.observable(10);
		self.showPages = ko.observable(10);
		self.itemCount = ko.observable();

		self.totalPages = ko.computed(function() {
			return Math.ceil(self.itemCount() / self.pageSize()) || 1;
		});

		self.goToPage = function(p) {
			if (p >= 1 && p <= self.totalPages()) {
				self.page(p);

				if (typeof options.goToPage === "function") {
					options.goToPage(p);
				}
			}
		};

		self.isFirstPage = ko.computed(function() {
			return self.page() === 1;
		});

		self.isLastPage = ko.computed(function() {
			return self.totalPages() === self.page();
		});

		self.prevPage = function() {
			self.goToPage(self.page() - 1);
		};

		self.nextPage = function() {
			self.goToPage(self.page() + 1);
		};

		self.firstPage = function() {
			self.page(1);
		};

		self.lastPage = function() {
			self.page(self.totalPages());
		};


		this.pages = ko.computed(function() {
			var pages = [], s, e, r;

			s = Math.floor(Math.max(1, self.page() - self.showPages() / 2));
			e = Math.floor(Math.min(self.totalPages(), self.page() + self.showPages() / 2));
			r = e - s;

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
	};

	te.addTemplate("kb_pagination", "\
			<div data-bind=\"if: totalPages() > 1\">\
				<div class=\"pagination\">\
					<ul>\
						<li data-bind=\"css:{disabled:isFirstPage()}\">\
							<a href=\"#\" data-bind=\"click: $root.firstPage\">« first</a>\
						</li>\
						<li data-bind=\"css:{disabled:isFirstPage()}\">\
							<a href=\"#\" data-bind=\"click: $root.prevPage\">« prev</a>\
						</li>\
						<!-- ko foreach: pages() -->\
							<li data-bind=\"css: { active: $data === ($root.page()), disabled: $data == ($root.page())}\">\
								<a href=\"#\" data-bind=\"text: $data, click: $root.goToPage\"/>\
							</li>\
						<!-- /ko -->\
						<li data-bind=\"css: { disabled: isLastPage() }\">\
							<a href=\"#\" data-bind=\"click: $root.nextPage\">next »</a>\
						</li>\
						<li data-bind=\"css: { disabled: isLastPage() }\">\
							<a href=\"#\" data-bind=\"click: $root.lastPage\">last »</a>\
						</li>\
					</ul>\
				</div>\
			</div>");

	ko.bindingHandlers.pagination = {
		init: function(element, valueAccessor, allBindingsAccessor) {
			return {"controlsDescendantBindings": true};
		},
		update: function(element, valueAccessor, allBindingsAccessor) {
			var viewModel = valueAccessor(), allBindings = allBindingsAccessor(), template;

			template = allBindings.headerTemplate || "kb_pagination";

			ko.renderTemplate(template, viewModel, {templateEngine: te}, element, "replaceNode");
		}
	};
})(jQuery);
