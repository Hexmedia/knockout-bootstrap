//UUID
function s4() {
	return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
}

function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

ko.bootstrap = {};

var te = new ko.nativeTemplateEngine();

te.addTemplate = function(name, html) {
	document.write('<script type="text/html" id="' + name + '">' + html + '</script>');
};

// Outer HTML
(function($) {
	$.fn.outerHtml = function() {
		if (this.length === 0)
			return false;
		var elem = this[0], name = elem.tagName.toLowerCase();
		if (elem.outerHTML)
			return elem.outerHTML;
		var attrs = $.map(elem.attributes, function(i) {
			return i.name + '="' + i.value + '"';
		});
		return "<" + name + (attrs.length > 0 ? " " + attrs.join(" ") : "") + ">" + elem.innerHTML + "</" + name + ">";
	};
})(jQuery);



