// TODO rename this class
ludo.view.Loader = new Class({
	Extends: Events,
	txt : 'Loading content...',
	view:undefined,
	el:undefined,
    shim:undefined,

	initialize:function(config){
		this.view = config.view;
		if(config.txt)this.txt = config.txt;
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

    getShim:function(){
        if(this.shim === undefined){
            this.shim = new Element('div');
            ludo.dom.addClass(this.shim, 'ludo-loader-shim');
            this.view.getEl().appendChild(this.shim);
            this.shim.style.display = 'none';
        }
        return this.shim;
    },

	show:function(txt){
		if(txt !== undefined){
			this.el.set('html', txt);
		}
        this.getShim().style.display='';
		this.getEl().style.display = '';
	},

	hide:function(){
        this.getShim().style.display='none';
		this.getEl().style.display = 'none';
	}
});