(function($) {
	ko.bootstrap.CarouselModel = function(options) {
		var self = this;
		
		options = $.extend({
			slides: []
		}, options || {});
		
		self.slides = ko.observableArray(options.slides);
		self.itemTemplate = options.itemTemplate || 'kb_carousel_item';
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
		<a class=\"carousel-control left\" href=\"#myCarousel\" data-slide=\"prev\">&lsaquo;</a>\
		<a class=\"carousel-control right\" href=\"#myCarousel\" data-slide=\"next\">&rsaquo;</a>\
	");
	
	ko.bootstrap.te.addTemplate("kb_carousel_inner", "\
		<div class=\"carousel-inner\" data-bind=\"foreach: slides\">\
			<!-- ko template: { 'name' : $parent.itemTemplate } -->\
			<!-- /ko -->\
		</div>\
	");
	
	ko.bootstrap.te.addTempalte("kb_carousel_item", "\
		<img src=\"#\" data-bind=\"attr: {'src' : image }\" />\
		<div class=\"carousel-caption\">\
			<h4 data-bind=\"text: title\">Second Thumbnail label</h4>\
			<p data-bind=\"text: text\">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\
		</div>\
	");
	
	ko.bootstrap.te.addTemplate("kn_carousel_indicators", "\
		<ol class=\"carousel-indicators\" data-bind=\"foreach: slides\">\
			<li data-bind=\"attr:{'data-slide-to': $index}\"></li>\
		</ol>\
	");
	
	ko.bindingHandlers.carousel = {
		init: function() {
			return {"controlsDescendantBindings": true};
		},
		update: function(element, valueAccessor, allBindingsAccessor) {
			var viewModel = valueAccessor(), allBindings = allBindingsAccessor(), indicatorsTemplate, innerTemplate, navTemplate;

			indicatorsTemplate = allBindings.indicatorsTemplate || "kn_carousel_indicators";
			innerTemplate = allBindings.innerTemplate || "kb_carousel_inner";
			navTemplate = allBindings.navTemplate || "kb_carousel_nav";
			
			$(element).addClass("carousel").addClass("slide");

			ko.renderTemplate(navTemplate, viewModel, {templateEngine: ko.bootstrap.te}, $('<div />').appendTo($(element)), "replaceNode");
			ko.renderTemplate(indicatorsTemplate, viewModel, {templateEngine: ko.bootstrap.te}, $('<div />').appendTo($(element)), "replaceNode");
			ko.renderTemplate(innerTemplate, viewModel, {templateEngine: ko.bootstrap.te}, $('<div />').appendTo($(element)), "replaceNode");
		}
	};
}(jQuery));