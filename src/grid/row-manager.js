/**
 * Row renderer config for a grid.
 * @class ludo.grid.RowManager
 * @param {Object} config
 * @param {Function} config.rowCls Function returning css class as string for a row. Argument to function: JSON for a row.
 * @example:
 * new ludo.grid.Grid({
 * 	rowManager: {
 * 		rowCls:function(row){ return "my-css-class" }
 * 	}
 *
 *
 */
ludo.grid.RowManager = new Class({
	Extends: ludo.Core,
	type : 'grid.RowManager',

	rowCls:undefined,

	__construct:function(config){
		this.parent(config);
		if(config.rowCls)this.rowCls = config.rowCls;
	}

});