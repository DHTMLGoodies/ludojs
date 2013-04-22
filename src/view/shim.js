/**
 * Render a shim
 * @type {Class}
 */
ludo.view.Shim = new Class({
    txt:'Loading content...',
    el:undefined,
    shim:undefined,
    renderTo:undefined,

    initialize:function (config) {
        if (config.txt)this.txt = config.txt;
        this.renderTo = config.renderTo;
        if(ludo.util.isString(this.renderTo))this.renderTo = ludo.get(this.renderTo).getEl();
    },

    getEl:function () {
        if (this.el === undefined) {
            this.el = ludo.dom.create({
                renderTo:this.renderTo,
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
                renderTo:this.renderTo,
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
        this.getEl().style.display = d === '' && this.txt ? '' : 'none';
    }
});