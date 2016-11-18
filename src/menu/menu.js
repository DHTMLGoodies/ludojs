/**
 * A ludo.View with with layout properties set to "type": "menu", orientation:"vertical", "width":"wrap", "height":"wrap"
 * @namespace ludo.menu
 * @class ludo.menu.Menu
 * @augments View
 */
ludo.menu.Menu = new Class({
    Extends : ludo.View,
    type : 'menu.Menu',
    layout:{
		type:'Menu',
		orientation:'vertical',
		width:'wrap',
		height:'wrap'
	},

    addCoreEvents : function(){

    }
});


