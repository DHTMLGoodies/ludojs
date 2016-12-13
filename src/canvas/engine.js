ludo.canvas.Engine = new Class({
	/*
	 * Returns property value of a SVG DOM node
	 * @function get
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	get:function (el, key) {
		if (key.substring(0, 6) == "xlink:") {
			return el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		} else {
			return el.getAttribute(key);
		}
	}
});
ludo.svg = new ludo.canvas.Engine();



