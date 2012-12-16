ludo.view.Loader = new Class({
	Extends: Events,
	txt : 'Loading content...',
	view:undefined,
	el:undefined,

	initialize:function(config){
		this.view = config.view;
		if(config.txt !== undefined)this.txt = config.txt;
		this.addDataSourceEvents();
	},

	addDataSourceEvents:function(){
		var dsConfig = this.view.dataSource;
		if(dsConfig){
			var ds = this.view.getDataSource();
			ds.addEvent('beforeload', this.show.bind(this));
			ds.addEvent('load', this.hide.bind(this));
			if(ds.isLoading())this.show();
		}
	},

	getEl:function(){
		if(this.el === undefined){
			this.el = new Element('div');
			ludo.dom.addClass(this.el, 'ludo-component-pleasewait');
			this.el.set('html', this.txt);
			this.view.getEl().appendChild(this.el);
			this.el.style.display = 'none';
		}
		return this.el;
	},

	show:function(txt){
		if(txt !== undefined){
			this.el.set('html', txt);
		}
		this.getEl().style.display = '';
	},

	hide:function(){
		this.getEl().style.display = 'none';
	}
});