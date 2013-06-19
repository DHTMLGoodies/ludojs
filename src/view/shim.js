/**
 * Render a shim
 * @namespace view
 * @class Shim
 */
ludo.view.Shim = new Class({
    txt:'Loading content...',
    el:undefined,
    shim:undefined,
    renderTo:undefined,

    initialize:function (config) {
        if (config.txt)this.txt = config.txt;
        this.renderTo = config.renderTo;
    },

    getEl:function () {
        if (this.el === undefined) {
            this.el = ludo.dom.create({
                renderTo:this.getRenderTo(),
                cls:'ludo-shim-loading',
                css:{'display':'none'},
                html : this.getText(this.txt)
            });
        }
        return this.el;
    },

    getShim:function () {
        if (this.shim === undefined) {
			if(ludo.util.isString(this.renderTo))this.renderTo = ludo.get(this.renderTo).getEl();
            this.shim = ludo.dom.create({
                renderTo:this.getRenderTo(),
                cls:'ludo-loader-shim',
                css:{'display':'none'}
            });
        }
        return this.shim;
    },

	getRenderTo:function(){
		if(ludo.util.isString(this.renderTo)){
			var view = ludo.get(this.renderTo);
			if(!view)return undefined;
			this.renderTo = ludo.get(this.renderTo).getEl();
		}
		return this.renderTo;
	},

    show:function (txt) {
        if (txt !== undefined) {
            this.getEl().set('html', this.getText(txt));
        }else{
			this.getEl().set('html', this.getText(this.txt));
		}
        this.css('');
		this.resizeShim();
    },

	resizeShim:function(){
		var span = document.id(this.el).getElement('span');
		var width = (span.offsetWidth + 5);
		this.el.style.width = width + 'px';
		this.el.style.marginLeft = (Math.round(width/2) * -1) + 'px';

	},

	getText:function(txt){
		return '<span>' + (ludo.util.isFunction(txt) ? txt.call() : txt ? txt : '') + '</span>';
	},

    hide:function () {
        this.css('none');
    },
    css:function (d) {
        this.getShim().style.display = d;
        this.getEl().style.display = d === '' && this.txt ? '' : 'none';
    }
});