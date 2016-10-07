// TODO refactor this into the ludoJS framework
var Asset = {
    javascript: function(source, properties){
        if (!properties) properties = {};

        var script = $('<script src="' + source + '" type="javascript"></script>'),
            doc = properties.document || document,
            load = properties.onload || properties.onLoad;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load){
            if (typeof script.onreadystatechange != 'undefined'){
                script.on('readystatechange', function(){
                    if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
                });
            } else {
                script.on('load', load);
            }
        }

        this.addProperties(script, properties);

        $(doc.head).append(script);


        return script;
    },

    addProperties:function(to, properties){

        for(var key in properties){
            if(properties.hasOwnProperty(key)){
                to.attr(key, properties[key]);
            }
        }
    },

    css: function(source, properties){
        if (!properties) properties = {};

        var link = $('<link rel="stylesheet" type="text/css" media="screen" href="' + source + '" />');

        var load = properties.onload || properties.onLoad,
            doc = properties.document || document;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load) link.on('load', load);

        this.addProperties(link, properties);

        $(doc.head).append(link);


        return link;
    }
};
