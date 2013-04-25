//UUID
ko.bootstrap = {
	s4: function() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	},
	guid: function() {
		return this.s4() + this.s4() + "-" + this.s4() + "=" + this.s4() + "=" + this.s4() + "=" + this.s4() + this.s4() + this.s4();
	},
	id: function() {
		return this.s4();
	}
};

ko.bootstrap.te = new ko.nativeTemplateEngine();

ko.bootstrap.te.addTemplate = function(name, html) {
	document.write("<script type=\"text/html\" id=\"" + name + "\">" + html + "</script>");
};

// Outer HTML
(function($) {
	$.fn.outerHtml = function() {
		var elem, attrs;
		if (this.length === 0) {
			return false;
		}
		elem = this[0], name = elem.tagName.toLowerCase();
		if (elem.outerHTML) {
			return elem.outerHTML;
		}
		attrs = $.map(elem.attributes, function(i) {
			return i.name + "=\"" + i.value + "\"";
		});
		return "<" + name + (attrs.length > 0 ? " " + attrs.join(" ") : "") + ">" + elem.innerHTML + "</" + name + ">";
	};
})(jQuery);



