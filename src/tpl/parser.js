/**
 * JSON Content compiler. This component will return compiled JSON for a view. It will
 * be created on demand by a ludo.View. If you want to create your own parser, extend this
 * class and
 * @namespace tpl
 * @class Parser
 * @augments Core
 */
ludo.tpl.Parser = new Class({
    Extends:ludo.Core,
    type:'tpl.Parser',
    compiledTpl:undefined,

    /**
     * Get compiled string
	 * @function getCompiled
     * @param {Object} records
     * @param {String} tpl
     * @return {Array} string items
     */
    getCompiled:function (records, tpl) {
        if (!ludo.util.isArray(records)) {
            records = [records];
        }
        var ret = [];

        tpl = this.getCompiledTpl(tpl);

        for (var i = 0; i < records.length; i++) {
            var content = [];
            for(var j = 0; j< tpl.length;j++){
                var k = tpl[j]["key"];
                if(k) {
                    content.push(records[i][k] ? records[i][k] : "");
                }else{
                    content.push(tpl[j]);
                }
            }
            ret.push(content.join(""));
        }
        return ret;
    },

    getCompiledTpl:function(tpl){
        if(!this.compiledTpl){
            this.compiledTpl = [];
            var pos = tpl.indexOf('{');
            var end = 0;

            while(pos >=0 && end != -1){
                if(pos > end){
                    var start = end === 0 ? end : end+1;
                    var len = end === 0 ? pos-end : pos-end-1;
                    this.compiledTpl.push(tpl.substr(start,len));
                }

                end = tpl.indexOf('}', pos);

                if(end != -1){
                    this.compiledTpl.push({
                        key : tpl.substr(pos, end-pos).replace(/[{}"]/g,"")
                    });
                }
                pos = tpl.indexOf('{', end);
            }

            if(end != -1 && end < tpl.length){
                this.compiledTpl.push(tpl.substr(end+1));
            }

        }
        return this.compiledTpl;
    },

    asString:function(data, tpl){
        return this.getCompiled(data, tpl).join('');
    },

    getTplValue:function (key, value) {
        return value;
    }
});