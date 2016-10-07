/**
 * Base class for List and tree.Tree
 * @class CollectionView
 */
ludo.CollectionView = new Class({
	Extends: ludo.View,
	/**
	 * Text to display when the tree or list has no data, i.e. when there's no data in data source or when filter returned no data.
	 * @config {String} emptyText
	 * @default undefined
	 */
	emptyText:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['emptyText']);
	},

	ludoEvents:function(){
		this.parent();
		if(this.emptyText && !this.getDataSource().hasRemoteSearch()){
			this.getDataSource().getSearcher().addEvents({
				'matches' : this.hideEmptyText.bind(this),
				'noMatches' : this.showEmptyText.bind(this)
			});
		}
	},

	hideEmptyText:function(){
		this.emptyEl().css('display', 'none');
	},

	showEmptyText:function(){
		this.emptyEl().css('display',  '');
		this._emptyEl.html(this.getEmptyText());
	},

	emptyEl:function(){
		if(this._emptyEl === undefined){
			this._emptyEl = ludo.dom.create({
				tag : 'div',
				renderTo:this.getBody(),
				cls : 'ludo-empty-text',
				css:{
					position : 'absolute'
				},
				html : this.getEmptyText()
			})
		}
		return this._emptyEl;
	},

	getEmptyText:function(){
		return ludo.util.isFunction(this.emptyText) ? this.emptyText.call() : this.emptyText;
	},

	_nodeContainer:undefined,

	nodeContainer:function(){
		if(this._nodeContainer === undefined){
			this._nodeContainer = $('<div>');
			this.getBody().append(this._nodeContainer);
	
		}
		return this._nodeContainer;
	},

	render:function(){
		if(this.emptyText){
			this[this.getDataSource().hasData() ? 'hideEmptyText' : 'showEmptyText']();
		}
	},

	insertJSON:function(){

	}
});