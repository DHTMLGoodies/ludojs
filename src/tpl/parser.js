/**
 * JSON Content compiler. This parser works with a template string, like: "<p>{lastname}, {firstname}</p>" and a JSON
 * array, like: [{"firstname":"John", "lastname": "Anderson"},{"firstname":"Anna", "lastname": "Anderson"}] and returns
 * <p>{Anderson}, {John}</p><p>{Anderson}, {Anna}</p>.
 *
 * It walks through all the objects in the JSON array and uses the template string on each one of them.
 * 
 * @namespace tpl
 * @class ludo.tpl.Parser
 * @augments Core
 */
ludo.tpl.Parser = new Class({
    Extends:ludo.Core,
    type:'tpl.Parser',
    compiledTpl:undefined,

    /**
     * Get compiled string
	 * @function getCompiled
     * @param {Array} records
     * @param {String} tpl
     * @return {Array} string items
     * @memberof ludo.tpl.Parser.prototype
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