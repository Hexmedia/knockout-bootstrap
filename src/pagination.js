(function($) {
	ko.pagiationModel = {
		ViewModel: function(options) {
			var self = this;

			self.page = ko.observable(options.page);
			self.pageSize = ko.observable(options.pageSize);
			self.showPages = ko.observable(options.showPages);

			self.goToPage = function(p) {
				if (p >= 1 && p <= self.totalPages()) {
					self.page(p);
				}
			};

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
		}
	};

	var te = new ko.nativeTemplateEngine();

	te.addTemplate = function(name, html) {
		document.write('<script type="text/html" id="' + name + '">' + html + '</script>');
	};

	te.addTemplate('kb_pagination', '\
			<div data-bind="if: totalPages() > 1">\
				<div class="pagination">\
					<ul>\
						<li data-bind="css:{disabled:isFirstPage()}">\
							<a href="#" data-bind="click: $root.firstPage">« first</a>\
						</li>\
						<li data-bind="css:{disabled:isFirstPage()}">\
							<a href="#" data-bind="click: $root.prevPage">« prev</a>\
						</li>\
						<!-- ko foreach: pages() -->\
							<li data-bind="css: { active: $data === ($root.page()), disabled: $data == ($root.page())}">\
								<a href="#" data-bind="text: $data, click: $root.goToPage"/>\
							</li>\
						<!-- /ko -->\
						<li data-bind="css: { disabled: isLastPage() }">\
							<a href="#" data-bind="click: $root.nextPage">next »</a>\
						</li>\
						<li data-bind="css: { disabled: isLastPage() }">\
							<a href="#" data-bind="click: $root.lastPage">last »</a>\
						</li>\
					</ul>\
				</div>\
			</div>');
})(jQuery);
