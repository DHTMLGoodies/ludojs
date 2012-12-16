/**
 * JSON Content compiler. This component will return compiled JSON for a view. It will
 * be created on demand by a ludo.View. If you want to create your own parser, extend this
 * class and
 * @namespace tpl
 * @class Parser
 * @extends Core
 */
ludo.tpl.Parser = new Class({
    Extends:ludo.Core,
    type:'tpl.Parser',
    singleton:true,

    /**
     * Get compiled string
	 * @method getCompiled
     * @param {Object} json
     * @param {String} tpl
     */
    getCompiled:function (json, tpl) {

        var records = json.data ? json.data : json;
        if (!this.isArray(records)) {
            records = [records];
        }
        var html = '';
        for (var i = 0; i < records.length; i++) {
            var content = tpl;
            var prop;
            for (prop in records[i]) {
                if (records[i].hasOwnProperty(prop)) {
                    var value = this.getTplValue(prop, records[i][prop]);
                    value = value ? value : '';
                    var reg = new RegExp('{' + prop + '}', 'g');
                    content = content.replace(reg, value);
                }
            }
            html = html + content;
        }
        return html;
    },

    getTplValue:function (key, value) {
        return value;
    }
});