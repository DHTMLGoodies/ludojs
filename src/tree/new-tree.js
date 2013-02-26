// TODO define child custom child key
// TODO should not have to have an "id" property
ludo.tree.Tree = new Class({
	Extends:ludo.View,
    type:'tree.Tree',
	nodeCache:{},
    renderedRecords: {},

	ludoConfig:function (config) {
		this.parent(config);
		if (this.dataSource && !this.dataSource.type)this.dataSource.type = 'dataSource.TreeCollection';
	},

	ludoEvents:function () {
		this.parent();
		if (this.dataSource) {
			var ds = this.getDataSource();
			ds.addEvent('select', this.selectRecord.bind(this));
			ds.addEvent('deselect', this.deSelectRecord.bind(this));
			ds.addEvent('addChild', this.addChild.bind(this));
			ds.addEvent('dispose', this.removeChild.bind(this));
			ds.addEvent('removeChild', this.removeChild.bind(this));
			ds.addEvent('show', this.showRecord.bind(this));
			ds.addEvent('hide', this.hideRecord.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.getBody().style.overflowY = 'auto';
		this.getBody().addEvent('click', this.onClick.bind(this));
		this.getBody().addEvent('dblclick', this.onDblClick.bind(this));
	},

	onClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			if (ludo.dom.hasClass(e.target, 'ludo-tree-node-expand')) {
				this.expandOrCollapse(record, e.target);
			} else if(this.isSelectable(record)) {
				this.getDataSource().selectRecord(record);
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
        if(!this.isRecordRendered(record))this.showRecord(record);
		var el = this.getDomElement(record, '.ludo-tree-node-plain');
		if (el)ludo.dom.addClass(el, 'ludo-tree-selected-node');
	},

	deSelectRecord:function (record) {
		var el = this.getDomElement(record, '.ludo-tree-node-plain');
		if (el)ludo.dom.removeClass(el, 'ludo-tree-selected-node');
	},

	getDomElement:function (record, cls) {
		var el = this.getDomByRecord(record);
		if (el)return document.id(el).getFirst(cls);
		return undefined;
	},

	expandOrCollapse:function (record, el) {
		if (ludo.dom.hasClass(el, 'ludo-tree-node-collapse')) {
			this.collapse(record, el);
		} else {
			this.expand(record, el);
		}
	},

	expand:function (record, el) {
		el = el || this.getExpandEl(record);
        if(!this.areChildrenRendered(record)){
            this.renderChildrenOf(record);
        }
		ludo.dom.addClass(el, 'ludo-tree-node-collapse');
		this.getCachedNode(record, 'children', 'child-container-').style.display = '';
	},

	collapse:function (record, el) {
		el = el || this.getExpandEl();
		ludo.dom.removeClass(el, 'ludo-tree-node-collapse');
		this.getCachedNode(record, 'children', 'child-container-').style.display = 'none';
	},

	getExpandEl:function (record) {
		return this.getCachedNode(record, 'expand', 'expand-');
	},

	getChildContainer:function (record) {
		return this.getCachedNode(record, 'children', 'child-container-');
	},

	hideRecord:function (record) {
        if(this.isRecordRendered(record)){
            this.getCachedNode(record, 'node', '').style.display = 'none';
        }
	},

	showRecord:function (record) {
        if(!this.isRecordRendered(record)){
            this.showRecord(record.getParent());
            this.expand(record.getParent());
            this.showRecord(record.getParent());
        }
		this.getCachedNode(record, 'node', '').style.display = '';
	},

	getDomByRecord:function (record) {
		return record ? this.getCachedNode(record, 'node', '') : undefined;
	},

    isRecordRendered:function(record){
        return this.renderedRecords[record.getUID !== undefined ? record.getUID() : record.uid] ? true : false;
    },

    areChildrenRendered:function(record){
        return record.children && record.children.length ? this.isRecordRendered(record.children[0]) : false;
    },

	getCachedNode:function (record, cacheKey, idPrefix) {
		if (this.nodeCache[cacheKey] === undefined)this.nodeCache[cacheKey] = {};
		var uid = record.getUID !== undefined ? record.getUID() : record.uid;
		if (!this.nodeCache[cacheKey][uid]) {
			this.nodeCache[cacheKey][uid] = this.getBody().getElementById(idPrefix + uid)
		}
		return this.nodeCache[cacheKey][uid];
	},

	getRecordByDOM:function (el) {
		var b = this.getBody();
		while (el !== b && (!el.className || el.className.indexOf('ludo-tree-a-node')) === -1) {
			el = el.parentNode;
		}
		if (el)return this.getDataSource().getRecord(el.id);
		return undefined;
	},

	insertJSON:function () {
		this.nodeCache = {};
		this.renderedRecords = {};
		this.getBody().set('html', '');
		this.render(this.getDataSource().getData());
	},

	render:function (data) {
		var d = new Date().getTime();
		this.getBody().innerHTML = this.getHtmlForBranch(data);
		console.log(new Date().getTime() - d);
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
            p.innerHTML = this.getHtmlForBranch(record.getChildren());
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
		ret.push('<span');
		if (this.isSelectable(record)) {
			ret.push(' class="ludo-tree-node-selectable"');
		}
		ret.push('>');
		ret.push(this.getNodeTextFor(record));
		ret.push('</span>');

		ret.push('<div class="ludo-tree-node-expand" id="expand-' + record.uid + '" style="position:absolute;display:' + (record.children && record.children.length ? '' : 'none') + '"></div>');
		ret.push('</div>');

		ret.push('<div class="ludo-tree-node-container" style="display:none" id="child-container-');
		ret.push(record.uid);
		ret.push('">');
		ret.push('</div>');

		if (includeContainer)ret.push('</div>');
		return ret.join('');
	},

	isSelectable:function (record) {
		return true;
	},

	getNodeTextFor:function (record) {
		return ['<span class="ludo-tree-node-spacer"></span>', record.title].join('');
	},

	addChild:function (record, parentRecord) {
		var childContainer = this.getChildContainer(parentRecord);
		if (childContainer) {
			var node = this.getDomByRecord(record) || this.getNewNodeFor(record);
			childContainer.appendChild(node);
			this.cssBranch(parentRecord);
		}
	},

	getNewNodeFor:function (record) {
		record = record.getUID !== undefined ? record.record : record;
		if (!record.uid)this.indexRecord(record);
		var el = document.createElement('div');
		el.className = 'ludo-tree-a-node ludo-tree-node';
		el.id = record.uid;
		el.innerHTML = this.getHtmlFor(record, false, false);
		return el;
	},

	cssBranch:function (parentRecord) {
		var count = parentRecord.children.length;
		for (var i = Math.max(0,count-2); i < count; i++) {
			var node = this.getDomByRecord(parentRecord.children[i]);
			if (node) {
				if (i < count - 1) {
					ludo.dom.removeClass(node, 'ludo-tree-node-last-sibling');
				} else {
					ludo.dom.addClass(node, 'ludo-tree-node-last-sibling');
				}
			}
		}
	},

	removeChild:function(record){
		var el = this.getDomByRecord(record);
		if(el){
			el.parentNode.removeChild(el);
            this.renderedRecords.splice(this.renderedRecords.indexOf(record.getUID()), 1);
			if(record.parentUid){
				var p = this.dataSource.findRecord(record.parentUid);
				if(p)this.cssBranch(p);
			}
		}
	}
});