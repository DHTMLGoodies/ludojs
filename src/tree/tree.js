/**
 * Tree widget
 * @namespace tree
 * @class Tree
 */
ludo.tree.Tree = new Class({
	Extends:ludo.CollectionView,
    type:'tree.Tree',
	nodeCache:{},
    renderedRecords: {},
	/**
	 String template for nodes in the tree
	 @config {String|Object}
	 @example
	 	tpl : '{title}
	 or as an object:
	 @example
	 	tpl:{
	 		tplKey : 'type',
	 		city : 'City : {city}',
	 		country : 'Country : {country}
	 	}
	 When using an object, "tplKey" is a reference to a common property of all objects, example "type". When type
	 for a node is "city", it will use the city : 'City : {city}' tpl. When it's "country", it will use the "country" tpl.
	 @example
	 	[
			{ id:1, "country":"Japan", "type":"country", "capital":"Tokyo", "population":"13,185,502",
				children:[
					{ id:11, city:'Kobe', "type":"city" },
					{ id:12, city:'Kyoto', "type":"city" },
					{ id:13, city:'Sapporo', "type":"city"},
					{ id:14, city:'Sendai', "type":"city"},
					{ id:15, city:'Kawasaki', "type":"city"}
				]},
			{id:2, "country":"South Korea", "capital":"Seoul", "population":"10,464,051", "type":"country",
				children:[
					{ id:21, city:'Seoul', "type":"city" }

				]},
			{id:3, "country":"Russia", "capital":"Moscow", "population":"10,126,424", "type":"country"},
		]
	 is an example of a data structure for this tpl.
	 */
	tpl : '<span class="ludo-tree-node-spacer"></span> {title}',
	tplKey:undefined,
	dataSource:{
	},
    defaultDS: 'dataSource.TreeCollection',

	/**
	 Default values when not present in node.
	 @config {Object} defaults
	 @default undefined
	 @example
	 	defaults:{
	 		"database" : {
	 			"icon" : "image.gif"
	 		}
	 	}
	 where "database" refers to the record attribute with name defined in categoryKey property of tree(default "type" ).
	 */
	defaults:undefined,

	/**
	 * Key used to defined nodes inside categories. This key is used for default values and node config
	 * @config {String} categoryKey
	 * @default "type"
	 */
	categoryKey : 'type',

	/**
	 Config of tree node categories
	 @config {Object} categoryConfig
	 @example
	 	categoryConfig:{
	 		"database":{
	 			"selectable" : false
	 		}
	 	}
	 */
	categoryConfig:undefined,

	ludoConfig:function(config){
		this.parent(config);
		this.setConfigParams(config, ['defaults','categoryConfig','categoryKey']);
	},

	ludoEvents:function () {
		this.parent();
		if (this.dataSource) {
            this.getDataSource().addEvents({
                'select' : this.selectRecord.bind(this),
                'deselect' : this.deSelectRecord.bind(this),
                'add' : this.addRecord.bind(this),
                'addChild' : this.addChild.bind(this),
                'dispose' : this.removeChild.bind(this),
                'removeChild' : this.removeChild.bind(this),
                'show' : this.showRecord.bind(this),
                'hide' : this.hideRecord.bind(this)
            });


		}
	},

	ludoDOM:function () {
		this.parent();
		this.getBody().css('overflowY', 'auto');
		this.getBody().on("click", this.onClick.bind(this));
		this.getBody().on("dblclick", this.onDblClick.bind(this));


	},

	onClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			if(e.target.tagName.toLowerCase() === 'span' && this.isSelectable(record)) {
				this.getDataSource().selectRecord(record);
            }
            if($(e.target).hasClass('ludo-tree-node-expand')){
                this.expandOrCollapse(record, e.target);
            }else{
                this.expand(record, e.target);
            }
		}
	},

	onDblClick:function(e){
		var record = this.getRecordByDOM(e.target);
		if(record){
			this.fireEvent('dblClick', record);
		}
	},

	selectRecord:function (record) {
        if(!record.getPlainRecord)record = this.getDataSource().getRecord(record);
		if(!record)return;
        if(!this.isRecordRendered(record))this.showRecord(record);
		var el = this.getDomElement(record, '.ludo-tree-node-plain');
		if (el)el.addClass('ludo-tree-selected-node');
	},

	deSelectRecord:function (record) {
		var el = this.getDomElement(record, '.ludo-tree-node-plain');
		if (el)el.removeClass('ludo-tree-selected-node');
	},

	getDomElement:function (record, cls) {
		var el = this.getDomByRecord(record);
		if (el)return $(el).find(cls).first();
		return undefined;
	},

	expandOrCollapse:function (record, el) {
        el = this.getExpandEl(record);
        var method = el.hasClass('ludo-tree-node-collapse') ? 'collapse' : 'expand';
        this[method](record,el);
	},

	expand:function (record, el) {
		el = this.getExpandEl(record);

        if(!this.areChildrenRendered(record)){

            this.renderChildrenOf(record);
        }
		el.addClass('ludo-tree-node-collapse');
		this.getCachedNode(record, 'children', 'child-container-').css('display', '');
	},

	collapse:function (record, el) {
		el = this.getExpandEl(record);
		el.removeClass('ludo-tree-node-collapse');
		this.getCachedNode(record, 'children', 'child-container-').css('display', 'none');
	},

	getExpandEl:function (record) {
		return this.getCachedNode(record, 'expand', 'expand-');
	},

	getChildContainer:function (record) {
		return this.getCachedNode(record, 'children', 'child-container-');
	},

	hideRecord:function (record) {
        if(this.isRecordRendered(record)){
            this.getCachedNode(record, 'node', '').css('display', 'none');
        }
	},

	showRecord:function (record) {
        if(!this.isRecordRendered(record)){
            this.showRecord(record.getParent());
            this.expand(record.getParent());
            this.showRecord(record.getParent());
        }
		this.getCachedNode(record, 'node', '').css('display', '');
	},

	getDomByRecord:function (record) {
		return record ? this.getCachedNode(record, 'node', '') : undefined;
	},

    isRecordRendered:function(record){
        return this.renderedRecords[record.getUID ? record.getUID() : record.uid] ? true : false;
    },

    areChildrenRendered:function(record){
		record =  record.getUID ? record.record : record;
        return record.children && record.children.length ? this.isRecordRendered(record.children[0]) : false;
    },

	getCachedNode:function (record, cacheKey, idPrefix) {
		if (this.nodeCache[cacheKey] === undefined)this.nodeCache[cacheKey] = {};
		var uid = record.getUID ? record.getUID() : record.uid;
		if (!this.nodeCache[cacheKey][uid]) {
			this.nodeCache[cacheKey][uid] = this.getBody().find("#" + idPrefix + uid);
		}
		return this.nodeCache[cacheKey][uid];
	},

	getRecordByDOM:function (el) {
		var b = this.getBody();
		while (el !== b && (!el.className || el.className.indexOf('ludo-tree-a-node') === -1)) {
			el = el.parentNode;
		}

		if (el)return this.getDataSource().getRecord(el.id);
		return undefined;
	},

	insertJSON:function () {

		this.nodeCache = {};
		this.renderedRecords = {};
		this.nodeContainer().html('');
		this.render();
	},

	render:function () {
		this.parent();
		var data = this.getDataSource().getData();

		this.nodeContainer().html(this.getHtmlForBranch(data));
	},

	getHtmlForBranch:function (branch) {
		var html = [];
		for (var i = 0; i < branch.length; i++) {
			html.push(this.getHtmlFor(branch[i], (i === branch.length - 1), true));
		}
		return html.join('');
	},

    renderChildrenOf:function(record){
        var p = this.getChildContainer(record);
        if(p){
			var c = record.getChildren();
            if(c)p.html(this.getHtmlForBranch(c));
        }
    },

	getHtmlFor:function (record, isLast, includeContainer) {
		var ret = [];

        this.renderedRecords[record.uid] = true;
		if (includeContainer) {
			ret.push('<div class="ludo-tree-a-node ludo-tree-node');
			if (isLast)ret.push(' ludo-tree-node-last-sibling');
			ret.push('" id="' + record.uid + '">');
		}
		ret.push('<div class="ludo-tree-node-plain">');

        ret.push(this.isSelectable(record) ? '<span class="ludo-tree-node-selectable">' : '<span>');
		ret.push(this.getNodeTextFor(record));
		ret.push('</span>');

		ret.push('<div class="ludo-tree-node-expand" id="expand-' + record.uid + '" style="position:absolute;display:' + (record.children && record.children.length ? '' : 'none') + '"></div>');
		ret.push('</div>');

		ret.push('<div class="ludo-tree-node-container" style="display:none" id="child-container-');
		ret.push(record.uid);
		ret.push('">');
		ret.push('</div>');

		if (includeContainer)ret.push('</div>');

        /**
         * Event fired when a node is created
         * @event createNode
         * @param {String} id of DOM node
         * @param {Object} record
         * @param {tree.Tree} tree
         */
        this.fireEvent('createNode', [record.uid, record, this]);
		return ret.join('');
	},

	isSelectable:function (record) {
		if(this.categoryConfig){
			record = record.getUID ? record.getData() : record;
			var config = this.categoryConfig[record[this.categoryKey]];
			return config && config.selectable !== undefined ? config.selectable : true
		}
		return true;
	},

	getNodeTextFor:function (record) {
		var tplFields = this.getTplFields(record);

		var ret = this.getTpl(record);

		for (var i = 0, count = tplFields.length; i < count; i++) {
			var field = tplFields[i];
			ret = ret.replace('{' + field + '}', record[field] ? record[field] : this.getDefaultValue(record, field));
		}

		ret = '<span class="ludo-tree-node-spacer"></span>' + ret;

		return ret;
	},

	getDefaultValue:function(record, field){
		if(this.defaults){
			var key = this.categoryKey;
			return record[key] && this.defaults && this.defaults[record[key]] ? this.defaults[record[key]][field] : '';
		}
		return "";

	},

	tpls:undefined,

	getTpl:function(record){
		return this.tpl['tplKey'] ? this.tpl[record[this.tplKey]] : this.tpl;
	},

	getTplFields:function (record) {
		if (!this.tplFields) {
			if(ludo.util.isString(this.tpl)){
				this.tplFields = this.getTplMatches(this.tpl);
			}else{
				this.tplFields = {};
				var tpl = Object.clone(this.tpl);
				this.tplKey = tpl.tplKey;
				for(var key in tpl){
					if(tpl.hasOwnProperty(key)){
						if(key != 'tplKey')this.tplFields[key] = this.getTplMatches(tpl[key]);
					}
				}
			}

		}
		return this.tplKey ? this.tplFields[record[this.tplKey]] : this.tplFields;
	},

	getTplMatches:function(tpl){
		var matches = tpl.match(/{([^}]+)}/g);
		for (var i = 0; i < matches.length; i++) {
			matches[i] = matches[i].replace(/[{}]/g, '');
		}
		return matches;
	},

	addRecord:function(record){
		this.addChild(record);
	},

	addChild:function (record, parentRecord) {
		var childContainer = parentRecord ? this.getChildContainer(parentRecord) : this.getBody();
		if (childContainer) {
			var node = this.getDomByRecord(record) || this.getNewNodeFor(record);
			childContainer.appendChild(node);
			this.cssBranch(parentRecord ? parentRecord.children : this.getDataSource().data);
			if(parentRecord)this.getExpandEl(parentRecord).style.display='';
		}
	},

	getNewNodeFor:function (record) {
		record = record.getUID ? record.record : record;
		if (!record.uid)this.getDataSource().indexRecord(record);
		return ludo.dom.create({
            cls : 'ludo-tree-a-node ludo-tree-node',
            html : this.getHtmlFor(record, false, false),
            id : record.uid
        });
	},

	cssBranch:function (nodes) {
		var count = nodes.length;
		for (var i = Math.max(0,count-2); i < count; i++) {
			var node = this.getDomByRecord(nodes[i]);
			if (node) {
				if (i < count - 1) {
					node.removeClass('ludo-tree-node-last-sibling');
				} else {
					node.addClass('ludo-tree-node-last-sibling');
				}
			}
		}
	},

	removeChild:function(record){
		var el = this.getDomByRecord(record);
		if(el){
			el.parentNode.removeChild(el);

            delete this.renderedRecords[this.getUID(record)];

			if(record.parentUid){
				var p = this.dataSource.findRecord(record.parentUid);
				if(p)this.cssBranch(p.children);
			}
		}
	},

    getUID:function(record){
        return record.getUID ? record.getUID() : record.uid;
    }
});