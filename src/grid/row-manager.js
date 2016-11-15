ludo.grid.RowManager = new Class({
	Extends: ludo.Core,
	type : 'grid.RowManager',

	/**
	 * A function returning css class for current row as string. Current record
	 * will be passed to function
	 * @config renderer
	 * @type {Function}
	 * @default undefined
	 */
	renderer:undefined,

	__construct:function(config){
		this.parent(config);
		if(config.renderer)this.renderer = config.renderer;
	}

});