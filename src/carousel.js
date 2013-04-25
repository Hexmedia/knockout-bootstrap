(function($) {
	ko.bootstrap.CarouselModel = function(options) {
		var self = this;

		options = $.extend({
			slides: []
		}, options || {});

		self.slides = ko.observableArray(options.slides);
		self.itemTemplate = options.itemTemplate || "kb_carousel_item";

		self.addSlide = function(slide) {
			this.slides.push(slide);
		};

		self.removeLastSlide = function() {
			this.slides.pop();
		};

		self.removeFirstSlide = function() {
			this.slides.shift();
		};

		self.removeSlide = function(slide) {
			var slides, i;
			
			for (i in slides) {
				slides = this.slides();
				
				if (slides[i].title === slide.title && slides[i].image === slide.image && slides[i].text == slide.text) {
					this.slides.splice(i, i);
				}
			}
		};

		self.carousel = ko.observable();

		self.id = "carousel_" + ko.bootstrap.id();

		self.goTo = function(to) {
			if (to > 0 && to < self.carousel().lenght) {
				$(self.carousel()).carousel(to);
			}
		};

		self.cycle = function() {
			$(self.carousel()).carousel('cycle');
		};

		self.pause = function() {
			$(self.carousel()).carousel('pause');
		};

		self.prev = function() {
			$(self.carousel()).carousel('prev');
		};

		self.next = function() {
			$(self.carousel()).carousel('next');
		};

		self.interval = ko.observable();
	};

	ko.bootstrap.CarouselItemModel = function(options) {
		var self = this;

		options = $.extend({
			image: null,
			title: "Title",
			text: "text"
		}, options || {});

		self.image = ko.observable(options.image);
		self.title = ko.observable(options.title);
		self.text = ko.observable(options.text);
	};

	ko.bootstrap.te.addTemplate("kb_carousel_nav", "\
		<a class=\"carousel-control left\" data-slide=\"prev\" data-bind=\"attr: {'href':'#' + id}\">&lsaquo;</a>\
		<a class=\"carousel-control right\" data-slide=\"next\" data-bind=\"attr: {'href':'#' + id}\">&rsaquo;</a>\
	");

	ko.bootstrap.te.addTemplate("kb_carousel_inner", "\
		<div class=\"carousel-inner\" data-bind=\"foreach: slides\">\
			<div class=\"item\" data-bind=\"template: { 'name' : $parent.itemTemplate }\">\
			</div>\
		</div>\
	");

	ko.bootstrap.te.addTemplate("kb_carousel_item", "\
		<img src=\"#\" data-bind=\"attr: {'src' : image }\" />\
		<div class=\"carousel-caption\">\
			<h4 data-bind=\"text: title\">Second Thumbnail label</h4>\
			<p data-bind=\"text: text\">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\
		</div>\
	");

	ko.bootstrap.te.addTemplate("kn_carousel_indicators", "\
		<ol class=\"carousel-indicators\" data-bind=\"foreach: slides\">\
			<li data-bind=\"attr:{'data-slide-to': $index, 'data-target':'#' + $parent.id}\"></li>\
		</ol>\
	");

	ko.bindingHandlers.carousel = {
		init: function() {
			return {"controlsDescendantBindings": true};
		},
		update: function(element, valueAccessor, allBindingsAccessor) {
			var $element, viewModel = valueAccessor(), allBindings = allBindingsAccessor(), indicatorsTemplate, innerTemplate, navTemplate;

			indicatorsTemplate = allBindings.indicatorsTemplate || "kn_carousel_indicators";
			innerTemplate = allBindings.innerTemplate || "kb_carousel_inner";
			navTemplate = allBindings.navTemplate || "kb_carousel_nav";

			$element = $('<div />');
			$element.appendTo($(element));
			$element.addClass("carousel").addClass("slide");

			ko.renderTemplate(indicatorsTemplate, viewModel, {templateEngine: ko.bootstrap.te}, $('<div />').appendTo($element), "replaceNode");
			ko.renderTemplate(innerTemplate, viewModel, {templateEngine: ko.bootstrap.te}, $('<div />').appendTo($element), "replaceNode");
			ko.renderTemplate(navTemplate, viewModel, {templateEngine: ko.bootstrap.te}, $('<div />').appendTo($element), "replaceNode");

			$($element.find('li').get(0)).addClass('active');
			$($element.find('div.item').get(0)).addClass('active');

			$element.attr('id', viewModel().id);

			$element.carousel();
		}
	};
}(jQuery));
