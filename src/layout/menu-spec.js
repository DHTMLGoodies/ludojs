/**
 * Spec of config options for menu layout
 * @namespace layout
 * @class MenuSpec
 * @type {Object}
 */
ludo.layout.MenuSpec = {
	/**
	 type attribute of parent must be set to "menu" to get menu layout
	 @config {String} type
	 @example
	 	new ludo.View({
	 		layout:{
	 			type:'menu'
			}
		});
	 */
	type : 'menu',

	/**
	 * How to render menu items, vertical or horizontal
	 * @config {String} orientation
	 * @default 'horizontal'
	 */
	orientation:'horizontal',

	/**
	 * true to show sub menus on mouse over without first having to click on parent menu item.
	 * @config {Boolean} active
	 * @default false
	 */
	active:false
};