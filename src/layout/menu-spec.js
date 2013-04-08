/**
 * Spec of config options for the Menu Layout.
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
	active:false,

    /**
     * For horizontal menus, where to show sub menu vertically, below or above
     * @config {String} alignSubMenuV
     * @default 'below'
     */
    alignSubMenuV:'below',

    /**
     * Where to show sub menu horizontally, rightOrLeftOf, leftOrRightOf, leftOr or rightOf.
     * rightOrLeftOf will show sub menu to the right if there's enough space left. leftOrRightOf will show sub menu to
     * the left if there's enough available space. leftOf and rightOf will always show the sub menu to the left or right no
     * matter available space.
     * @config {String} alignSubMenuH
     * @default 'rightOrLeftOf'
     */
    alignSubMenuH:'rightOrLeftOf'
};