/**
 * Render a shim

 */
ludo.view.Shim = new Class({
    txt: 'Loading content...',
    el: undefined,
    shim: undefined,
    renderTo: undefined,

    initialize: function (config) {
        if (config.txt)this.txt = config.txt;
        this.renderTo = config.renderTo;
    },

    getEl: function () {
        if (this.el === undefined) {
            this.el = $('<div class="ludo-shim-loading" style="display:none">' + this.getText(this.txt) + "</div>");
            this.getRenderTo().append(this.el);
        }
        return this.el;
    },

    getShim: function () {
        if (this.shim === undefined) {
            if (ludo.util.isString(this.renderTo))this.renderTo = ludo.get(this.renderTo).getEl();
            this.shim = $('<div class="ludo-loader-shim" style="display:none"></div>');
            this.getRenderTo().append(this.shim);

        }
        return this.shim;
    },

    getRenderTo: function () {
        if (ludo.util.isString(this.renderTo)) {
            var view = ludo.get(this.renderTo);
            if (!view)return undefined;
            this.renderTo = ludo.get(this.renderTo).getEl();
        }
        return this.renderTo;
    },

    show: function (txt) {
        this.getEl().html(this.getText(( txt && !ludo.util.isObject(txt) ) ? txt : this.txt));
        this.css('');
        this.resizeShim();
    },

    resizeShim: function () {
        var span = $(this.el).find('span');
        var width = (span.width() + 5);
        this.el.css('width', width + 'px');
        this.el.css('marginLeft', (Math.round(width / 2) * -1) + 'px');
    },

    getText: function (txt) {
        txt = ludo.util.isFunction(txt) ? txt.call() : txt ? txt : '';
        return '<span>' + txt + '</span>';
    },

    hide: function () {
        this.css('none');
    },
    css: function (d) {
        this.getShim().css('display', d);
        this.getEl().css('display', d === '' && this.txt ? '' : 'none');
    }
});