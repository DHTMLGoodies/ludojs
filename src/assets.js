/**
 * TODO refactor this into the ludoJS framework
 */
var Asset = {
    javascript: function(source, properties){
        if (!properties) properties = {};

        var script = new Element('script', {src: source, type: 'text/javascript'}),
            doc = properties.document || document,
            load = properties.onload || properties.onLoad;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load){
            if (typeof script.onreadystatechange != 'undefined'){
                script.addEvent('readystatechange', function(){
                    if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
                });
            } else {
                script.addEvent('load', load);
            }
        }

        return script.set(properties).inject(doc.head);
    },

    css: function(source, properties){
        if (!properties) properties = {};

        var link = new Element('link', {
            rel: 'stylesheet',
            media: 'screen',
            type: 'text/css',
            href: source
        });

        var load = properties.onload || properties.onLoad,
            doc = properties.document || document;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load) link.addEvent('load', load);
        return link.set(properties).inject(doc.head);
    }
};

if(Browser.ie && Browser.version <9){
    Asset.css('dashboard/css/dashboard-ie.css');
}