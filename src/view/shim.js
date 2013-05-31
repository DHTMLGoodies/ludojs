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
                cls:'ludo-shim-loading',
                css:{'display':'none'},
                html : this.getTextForShim()
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
            this.getEl().set('html', this.getText(txt));
        }else{
			this.getEl().set('html', this.getTextForShim());
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

	getTextForShim:function(){
		return this.getText(this.txt);
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