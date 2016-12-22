/**
 * Text box class which handles simple HTML tags
 * and renders them in SVG format.
 * @namespace canvsa
 * @class ludo.svg.TextBox
 */
ludo.svg.TextBox = new Class({
    Extends:ludo.svg.Group,
    tag:'g',
    text:undefined,
    css:{
        'line-height':13
    },
    presentationAttributes:['x', 'y', 'width', 'height'],
    currentY:0,

    tags:{
        '<br>':'text'
    },

    __construct:function (config) {
        config = config || {};
        config.attr = this.getAttributes(config);
        this.parent(config);
        this.text = config.text;
        if (config.css)this.css = config.css;

        if(this.text){
			this.renderText();
		}
    },

    getAttributes:function (config) {
        var ret = config.attr || {};
        var p = this.presentationAttributes;
        for (var i = 0; i < p.length; i++) {
            if (config[p[i]] !== undefined) {
                ret[p[i]] = config[p[i]];
            }
        }
        return ret;
    },

    tagsToInsert:function () {
        var texts = this.getTextParts();
        return this.toTags(texts);
    },

    getTextParts:function () {
        var tokens = this.text.match(/(<\/?[a-z]+?>)/gmi);
		if(!tokens)return [this.text];
        var index = 0;

        var ret = [];
        for (var i = 0; i < tokens.length; i++) {
            var pos = this.text.indexOf(tokens[i], index === 0 ? index : index + 1);
            if (pos > index) {
                ret.push(this.text.substr(index, pos - index));
            }
            index = pos;
        }
        if (index < this.text.length) {
            ret.push(this.text.substr(index));
        }

        return ret;
    },

    toTags:function (items) {
        var ret = [
            {
                tag:'text',
                properties:{ y:this.getYOfLine() }
            }
        ];
        var currentParent = ret[0];

        for (var i = 0; i < items.length; i++) {
            var tag = items[i].match(/<([a-z]+?)>/gi);
            if (tag)tag = tag[0];

            var obj = {
                properties:{}
            };

            obj.tag = this.tags[tag] ? this.tags[tag] : 'tspan';


            obj = this.assignDefaultProperties(obj, tag);


            obj.text = this.stripTags(items[i]);
            if (obj.tag === 'tspan') {
                currentParent.children = currentParent.children || [];
                currentParent.children.push(obj);
            } else {
                ret.push(obj);
            }
            if (obj.tag === 'text') {
                obj.properties.y = this.getYOfLine();
                currentParent = obj;
            }
        }

        return ret;
    },

    assignDefaultProperties:function (obj, tag) {
        if (tag) {
            var props = this.getDefaultTagProperties();
            var p = props[tag];
            if (p) {
                for (var key in p) {
                    if (p.hasOwnProperty(key))obj.properties[key] = p[key];
                }
            }
        }
        return obj;

    },


    getYOfLine:function () {
        this.currentY += 15;
        return this.currentY;
    },

    setText:function (text) {
		this.currentY = 0;
        this.empty();
        this.text = text;
        this.renderText();
    },

    renderText:function () {
        this.renderItems(this.tagsToInsert(), this);
    },

    renderItems:function (items, parent) {
        for (var i = 0; i < items.length; i++) {
            var n = new ludo.svg.Node(items[i].tag, items[i].properties, items[i].text);
            parent.append(n);

            if (items[i].children) {
                this.renderItems(items[i].children, n);
            }
        }
    },


    stripTags:function (text) {
        return text.replace(/<\/?[^>]+?>/g, '');
    },

    getDefaultTagProperties:function () {
        return {
            '<strong>':{ 'font-weight':'bold' },
            '<b>':{ 'font-weight':'bold' },
            '<em>':{ 'font-style':'italic' },
            '<i>':{ 'font-style':'italic' }
        };
    }

});