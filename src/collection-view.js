/**
 * Base class for List and tree.Tree
 * @class ludo.CollectionView
 * @param {Object} config
 * @param {String} config.emptyText Text to show on no data
 */
ludo.CollectionView = new Class({
	Extends: ludo.View,

	emptyText:undefined,

	__construct:function (config) {
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
			this._emptyEl = $('<div class="ludo-empty-text" style="position:absolute">' + this.getEmptyText() + '</div>');
			this.getBody().append(this._emptyEl);
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

			this[this.getDataSource().getCount() > 0 ? 'hideEmptyText' : 'showEmptyText']();
		}
	},

	JSON:function(){

	}
});