/**
 * Menu class
 * @namespace menu
 * @class Menu
 * @extends View
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

    },

    isMenu:function(){
        return true;
    }
});


