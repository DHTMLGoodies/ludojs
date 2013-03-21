// TODO rename this class
ludo.view.Loader = new Class({
    Extends:Events,
    txt:'Loading content...',
    view:undefined,
    el:undefined,
    shim:undefined,

    initialize:function (config) {
        this.view = config.view;
        if (config.txt)this.txt = config.txt;
        this.addDataSourceEvents();
    },

    addDataSourceEvents:function () {
        var dsConfig = this.view.dataSource;
        if (dsConfig) {
            var ds = this.view.getDataSource();
            ds.addEvent('beforeload', this.show.bind(this));
            ds.addEvent('load', this.hide.bind(this));
            if (ds.isLoading())this.show();
        }
    },

    getEl:function () {
        if (this.el === undefined) {
            this.el = ludo.dom.create({
                renderTo:this.view.getEl(),
                cls:'ludo-component-pleasewait',
                css:{'display':'none'},
                html : this.txt
            });
        }
        return this.el;
    },

    getShim:function () {
        if (this.shim === undefined) {
            this.shim = ludo.dom.create({
                renderTo:this.view.getEl(),
                cls:'ludo-loader-shim',
                css:{'display':'none'}
            });
        }
        return this.shim;
    },

    show:function (txt) {
        if (txt !== undefined) {
            this.el.set('html', txt);
        }
        this.css('');
    },

    hide:function () {
        this.css('none');
    },
    css:function (d) {
        this.getShim().style.display = d;
        this.getEl().style.display = d;
    }
});