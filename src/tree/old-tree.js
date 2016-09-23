/**
 * Displays a tree
 * This class will soon be replaced by a new Tree widget.
 * @namespace tree
 * @class Tree
 * @extends View
 * @deprecated
 */
ludo.tree.Tree = new Class({
    Extends:ludo.View,
    type:'tree.Tree',
    /**
     * Keys to use as primary key for records. If you show different types of nodes, example continent, country, city
     * you may have records with the same "id". primaryKey let you specify keys to use as a combined primary key
     * example: ["id","type"]. If no keys are set, "id" will be used.
     * @attribute {Array} primaryKey
     * @default []
     */
    primaryKey:[],

    treeConfig:{
        defaultValues:{}
    },

    rootRecord:{
        id:'ludo-tree-root-node-' + String.uniqueID(),
        title:'Root',
        type:'root',
        hidden:true
    },

    recordConfig:{
        'root':{
            dd:{
                drag:false,
                drop:true,
                siblings:false,
                children:true,
                newChild:'top'
            }
        }
    },
    selectedRecord:undefined,

    modificationStorage:[],

    dd:{},
    searchConfig:null,
    filterObj:null,
    /**
     * Initial records, example
     * [ {id:1, title: 'Document', type: 'document' , children: [{ id:2, title: 'Chapter 1', type: 'chapter'},{ id:3, title: 'Chapter 2', type: 'chapter'}] }
     * In most cases, you will want to pull this from the server. Response from server should be { success: true, data : [ { tree nodes structure above } ]}
     * @attribute {Array} data
     */
    data:[],

    recordMap:{},

    nodeTpl:'<span>{title}</span>',


    search:false,


    tplFields:{},
    /**
     * Show lines between nodes
     * @attribute {Boolean} showLines
     * @default true
     *
     */
    showLines:true,


    /**
     * Initially expand tree to this depth
     * @attribute {Number} expandDepth
     */
    expandDepth:0,


    /**
     * Auto scroll node into view when calling the selectRecord method
     * @attribute {Boolean} autoScrollNode
     * @default true
     */
    autoScrollNode:false,
    /**
     * Auto expand tree to selected node when calling selectRecord method
     * @attribute {Boolean} autoExpand
     * @default true
     */
    autoExpand:true,
    selectedNode:null,
    hiddenNodes:{},
    /**
     * Object of class ludo.tree.Modifications. Store modified, updated and removed records
     * @property object modificationManager
     */
    modificationManager:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['data','nodeTpl','recordConfig','showLines','autoScrollNode','expandDepth',
            'search','dd','primaryKey']);

        config.treeConfig = config.treeConfig || {};

        if (config.rootRecord !== undefined) {
            this.rootRecord = config.rootRecord;
            this.rootRecord.id = this.rootRecord.id || 'ludo-tree-root-node-' + String.uniqueID();
            this.rootRecord.type = this.rootRecord.type || 'root';
        }
        if (config.treeConfig.defaultValues !== undefined)this.treeConfig.defaultValues = config.treeConfig.defaultValues;

        this.dd = config.dd || this.dd;

        if (this.search) {
            this.searchConfig = config.searchConfig;
            this.filterObj = new ludo.tree.Filter({
                data:this.data,
                component:this
            });
        }
    },

    ludoRendered:function () {
        if (this.data.length) {
            this.insertJSON(this.data);
        }
        if (!this.showLines) {
            this.getEl().addClass('ludo-tree-no-lines');
        }
    },

    ludoDOM:function () {
        this.parent();
        this.els.nodes = [];
        this.els.expand = [];
        this.els.childContainers = [];
    },

    ludoEvents:function () {
        this.parent();

        if ((this.dd.drag || this.dd.drop) && !this.dd.obj) {
            this.dd.obj = new ludo.tree.DragDrop();
        }

        this.addEvent('remove', this.removeRecord.bind(this));
        this.addEvent('add', this.addRecord.bind(this));

        var b = this.getBody();
        b.addEvent('click', this.recordClick.bind(this));
        b.addEvent('dblclick', this.recordDblClick.bind(this));
        b.addEvent('click', this.expandByDom.bind(this));
        b.addEvent('click', this.toggleExpandCollapse.bind(this));
        if (Browser['ie']) {
            b.addEvent('selectstart', this.cancelSelection.bind(this));
        }
    },

    load:function () {
        this.clearView();
        this.parent();
    },

    clearView:function () {
        this.els.nodes = [];
        this.getBody().set('html', '');
        this.getModificationManager().clearDirtyStorage();
    },

    filter:function (searchString) {
        this.filterObj.filter(searchString);
    },

    removeRecord:function (record) {
        if (this.dd['removeDragged'] === false) {
            return;
        }
        this.removeDomForRecord(record);
        var parentRecord = this.getParentRecord(record);
        this.getModificationManager().storeRemovedRecord(record, parentRecord);
        parentRecord.children.erase(record);
        this.showHideExpandElement(parentRecord);
        this.updateSearchIndex();

        this.setNewCssForDomNodes(record);
    },

    removeDomForRecord:function (record) {
        this.setChildDomNodesToUndefined(record);
        var id = this.getUniqueRecordId(record);
        var node = this.getDomNode(record);
        if (node) {
            this.getDomNode(record).dispose();
            this.els.childContainers[id].dispose();
            this.els.nodes[id] = undefined;
            this.els.childContainers[id] = undefined;
        }
    },

    setChildDomNodesToUndefined:function (record) {
        if (record.children && record.children.length) {
            for (var i = 0; i < record.children.length; i++) {
                this.els.nodes[this.getUniqueRecordId(record.children[i])] = undefined;
                this.setChildDomNodesToUndefined(record.children[i]);
            }
        }
    },
    /**
     * Method called by ludo.tree.
	 * @method addRecord
     * @param {Object} obj
     */
    addRecord:function (obj) {
        obj.record.unique = undefined;
        if (obj.pos == 'sibling') {
            this.addSibling(obj.record, obj.targetRecord);
        } else {
            this.addChild(obj.record, obj.targetRecord);
        }
    },

    updateSearchIndex:function () {
        if (this.search) {
            this.filterObj.setData(this.data.children ? this.data.children : this.data);
        }
    },

    isRecordChildOf:function (record, parentRecord) {
        var primaryKey = this.getPrimaryKey(record);
        for (var i = 0; i < parentRecord.children.length; i++) {
            var child = parentRecord.children[i];
            if (this.getPrimaryKey(child) == primaryKey) {
                return true;
            }
        }
        return false;
    },

    addSibling:function (record, sibling) {
        var id = this.getUniqueRecordId(sibling);
        var parentRecord = this.recordMap[id].parent;

        if (this.isRecordChildOf(record, parentRecord)) {
            return;
        }

        var index = parentRecord.children.indexOf(sibling) + 1;

        var count = parentRecord.children.length;
        for (var i = count; i > index; i--) {
            parentRecord.children[i] = parentRecord.children[i - 1];
        }
        parentRecord.children[index] = record;

        var node = this.createNode(record, parentRecord);
        node.setStyle('display', '');

        node.inject(this.els.nodes[id], 'after');

        this.getModificationManager().storeAddedRecord(record, sibling, 'sibling');

        this.setNewCssForDomNodes(record);
        this.updateSearchIndex();
    },

    addChild:function (record, parentRecord) {
        if (this.isRecordChildOf(record, parentRecord)) {
            return;
        }
        this.renderChildNodes(parentRecord);
        parentRecord.children = parentRecord.children || [];

        if (!this.shouldDropChildOnTop(parentRecord)) {
            this.addSibling(record, parentRecord.children[parentRecord.children.length - 1]);
            return;
        }

        record.children = record.children || [];
        var count = parentRecord.children.length;
        for (var i = count; i > 0; i--) {
            parentRecord.children[i] = parentRecord.children[i - 1];
        }

        var sibling;
        if (parentRecord.children.length > 0) {
            sibling = parentRecord.children[0];
        }

        parentRecord.children[0] = record;

        var node = this.createNode(record, parentRecord);
        node.setStyle('display', '');

        if (sibling) {
            var id = this.getUniqueRecordId(sibling);
            node.inject(this.els.nodes[id], 'before');
        } else {
            this.renderChildNodes(parentRecord);
        }

        this.setNewCssForDomNodes(record);
        this.showHideExpandElement(parentRecord);
        this.getModificationManager().storeAddedRecord(record, parentRecord, 'child');
        this.expandNode(parentRecord);
        this.updateSearchIndex();
    },

    getModifiedRecords:function () {
        return this.getModificationManager().getModifications();
    },

    getModificationManager:function () {
        if (!this.modificationManager) {
            this.modificationManager = new ludo.tree.Modifications({ tree:this });
        }
        return this.modificationManager;
    },

    insertJSON:function (remoteData) {
        var data = remoteData;
        this.clearView();
        if (data.length > 0 && data[0]['rootNode']) {
            this.rootRecord = data[0];
            data = data[0].children;
        }
        this.data = this.rootRecord;
        this.data.children = data;
        this.updateSearchIndex();
        this.render();

        if (this.expandDepth) {
            this.expandSome(null, this.expandDepth);
        }
    },

    render:function () {
        this.createNode(this.rootRecord);
        if (this.rootRecord.hidden || !this.rootRecord.title) {
            var id = this.getUniqueRecordId(this.rootRecord);
            this.els.nodes[id].getElements('.ludo-tree-node-plain').setStyle('display', 'none');

        }
        this.renderChildNodes(this.data);
        this.fireEvent('render', this);
    },

    renderChildNodes:function (record) {
        var records = record.children;
        var lastChildIndex = records.length - 1;
        for (var i = 0; i < records.length; i++) {
            this.createNode(records[i], record, (i == lastChildIndex));
        }
    },

    createNode:function (record, parentRecord, isLastChild) {
        var id = this.getUniqueRecordId(record);
        this.recordMap[id] = {
            record:record,
            parent:parentRecord || undefined
        };

        if (!this.els.nodes[id]) {
            var el = this.els.nodes[id] = $('<div>');
            el.className = 'ludo-tree-node';

            var nodeText = [];
            nodeText.push('<div class="ludo-tree-node-plain" id="' + id + '">');
            nodeText.push('<span');
            if (this.isSelectable(record)) {
                nodeText.push(' class="ludo-tree-node-selectable"');
            }
            nodeText.push(' id="' + id + '"');
            nodeText.push('>');
            nodeText.push(this.getNodeText(record));
            nodeText.push('</span>');

            nodeText.push('<div style="position:absolute" class="ludo-tree-node-expand" id="' + id + '"></div>');

            el.innerHTML = nodeText.join('');
			if(!this.els.expand)this.els.expand = {};
			if(!this.els.childContainers)this.els.childContainers = {};
            this.els.expand[id] = el.getElement('.ludo-tree-node-expand');
            this.els.childContainers[id] = el.getElement('.ludo-tree-node-container');

            if (parentRecord) {
                this.els.childContainers[this.getUniqueRecordId(parentRecord)].appendChild(el);
            } else {
                this.getBody().appendChild(el);
                el.addClass('ludo-tree-node-root');
            }

            if (isLastChild) {
                el.addClass('ludo-tree-node-last-sibling');
            }

            if (record['leaf'] || !record.children || record.children.length == 0) {
                this.els.expand[id].css('display', 'none');
            }

            var container = this.els.childContainers[id] = $('<div>');
            container.className = 'ludo-tree-node-container';
            el.appendChild(container);

            if (this.isRecordDragable(record)) {
                this.dd.obj.addSource({ el:el.getElement('.ludo-tree-node-plain'), record:record, component:this });
            }

            if (this.isRecordDropTarget(record)) {
                this.dd.obj.addTarget({ el:el.getElement('span'), record:record, component:this, config:this.getDragDropConfigFor(record) });
            }
        }
        return this.els.nodes[id];
    },

    cancelSelection:function () {
        return false;
    },

    isSelectable:function (record) {
        var ret = this.getRecordConfig(record, 'selectable');
        if (ret === undefined) {
            ret = true;
        }
        return ret;
    },

    selectRecord:function (record) {
        record = this.findRecord(record);
        if (record) {
            this.selectedRecord = record;
            if (!this.isRendered(record)) {
                var path = this.getPathToRecord(record);
                for (var i = 0; i < path.length; i++) {
                    this.renderChildNodes(path[i]);
                    this.expandNode(path[i]);
                }
            }
            var domNode = this.getDomNode(record);
            this.setSelectedNode(domNode);
            if (this.autoScrollNode) {
                ludo.dom.scrollIntoView(domNode, this);
            }
            if (this.autoExpand) {
                this.expandToRecord(record);
            }
            this.fireEvent('selectrecord', record);
            return record;
        }
        return undefined;
    },
    getSelectedRecord:function () {
        return this.selectedRecord;
    },
    getPathToRecord:function (record) {
        var id = this.getUniqueRecordId(record);
        if (!this.recordMap[id]) {
            this.buildRecordMap();
        }
        var ret = [];
        while (record = this.getParentRecord(record)) {
            ret.push(record);
        }
        return ret.reverse();
    },

    buildRecordMap:function (parentRecord, children) {
        children = children || this.data.children;
        for (var i = 0; i < children.length; i++) {
            var record = children[i];
            var id = this.getUniqueRecordId(record);
            this.recordMap[id] = {
                record:record,
                parent:parentRecord || undefined
            };
            if (record.children && record.children.length) {
                this.buildRecordMap(record, record.children);
            }
        }
    },

    findRecord:function (search, children) {
        if (!children && this.isRootNode(search)) {
            return this.rootRecord;
        }
        var rec = null;
        children = children || this.data.children;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                var record = children[i];
                if (this.recordMatchesSearch(record, search)) {
                    return record;
                }
                if (record.children && record.children.length > 0) {
                    rec = this.findRecord(search, record.children);
                    if (rec) {
                        return rec;
                    }
                }
            }
        }
        return rec;
    },

    recordMatchesSearch:function (record, search) {
        if (record.unique && search.unique) {
            return record.unique == search.unique;
        }
        for (var type in search) {
            if (search.hasOwnProperty(type)) {
                if (!record[type] || record[type] != search[type]) {
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * Update CSS of branch after moving or removing a record from the tree(Drag and Drop)
     * @method setNewCssForDomNodes
     * @param {Object} record
     * @private
     */
    setNewCssForDomNodes:function (record) {
        var parentRecord = this.getParentRecord(record);
        var domNode;
        if (parentRecord && parentRecord.children && parentRecord.children.length > 0) {
            for (var i = 0; i < parentRecord.children.length - 1; i++) {
                domNode = this.getDomNode(parentRecord.children[i]);
                if (domNode) {
                    domNode.removeClass('ludo-tree-node-last-sibling')
                }
            }
            domNode = this.getDomNode(this.getLastChildRecord(parentRecord));
            if (domNode) {
                domNode.addClass('ludo-tree-node-last-sibling')
            }
        }
    },

    getDomNode:function (record) {
        var domId = this.getUniqueRecordId(record);
        return this.els.nodes[domId] ? this.els.nodes[domId] : undefined;
    },

    getLastChildRecord:function (record) {
        if (record.children && record.children.length) {
            return record.children[record.children.length - 1];
        }
        return undefined;
    },

    setRecordProperty:function (record, property, newValue) {
        record = this.findRecord(record);
        if (record) {
            record[property] = newValue;
        }
        this.updateDOMOfRecord(record);
        this.getModificationManager().storeUpdatedRecord(record);
    },

    updateDOMOfRecord:function (record) {
        var id = this.getUniqueRecordId(record);
        if (this.els.nodes[id]) {
            var textEl = this.els.nodes[id].getElements('span')[0];
            textEl.set('html', this.getNodeText(record));
        }
    },

    recordDblClick:function (e) {
        var el = this.getSelectableDomNode(e.target);
        if (!el)return;
        this.fireEvent('dblclick', [this.recordMap[el.getProperty('id')].record, e]);
    },
    recordClick:function (e) {
        var el = this.getSelectableDomNode(e.target);
        if (!el)return undefined;
        this.setSelectedNode(el);
        this.selectedRecord = this.recordMap[el.getProperty('id')].record;
        this.fireEvent('click', [this.recordMap[el.getProperty('id')].record, e]);
        this.fireEvent('selectrecord', [this.recordMap[el.getProperty('id')].record, e]);

        return e.target && e.target.tagName.toLowerCase() === 'input' ? undefined : false;
    },

    getSelectableDomNode:function (el) {
        if (el.hasClass('ludo-tree-node-expand')) {
            return null;
        }
        if (!el.hasClass('ludo-tree-node-plain')) {
            el = el.getParent('.ludo-tree-node-plain');
        }
        if (!el || !el.getElement('.ludo-tree-node-selectable'))return null;
        return el;
    },

    setSelectedNode:function (node) {
        if (!node.hasClass('ludo-tree-node-plain')) {
            node = node.getFirst('.ludo-tree-node-plain');
        }
        if (this.selectedNode && this.selectedNode.tagName) {
            this.selectedNode.removeClass('ludo-tree-selected-node');
        }
        node.addClass('ludo-tree-selected-node');
        this.selectedNode = node;
    },

    getNodeText:function (record) {
        var tplFields = this.getTplFields(record);
        var ret = this.getNodeTemplate(record);
        for (var i = 0, count = tplFields.length; i < count; i++) {
            var field = tplFields[i];
            ret = ret.replace('{' + field + '}', record[field] ? record[field] : this.getDefaultValue(record, field));
        }
        if (!this.isRootNode(record)) {
            ret = '<span class="ludo-tree-node-spacer"></span>' + ret;
        }
        return ret;
    },
	/**
	Return record fields/columns for the node template, example ['title','description'] from {title} {description}
	@method getTplFields
	@param {Object} record
	@return array
	@private
	*/
    getTplFields:function (record) {
        if (!this.tplFields[record.type]) {
            var tpl = this.getNodeTemplate(record);
            var matches = tpl.match(/{([^}]+)}/g);
            for (var i = 0; i < matches.length; i++) {
                matches[i] = matches[i].replace(/[{}]/g, '');
            }
            this.tplFields[record.type] = matches;
        }
        return this.tplFields[record.type];
    },

    getNodeTemplate:function (record) {
        if (this.recordConfig[record.type] && this.recordConfig[record.type].nodeTpl) {
            return this.recordConfig[record.type].nodeTpl;
        }
        return this.nodeTpl;
    },

    getDefaultValue:function (record, field) {
        var values = this.getRecordConfig(record, 'defaults');
        if (!values || !values[field]) {
            return this.treeConfig.defaultValues[field] ? this.treeConfig.defaultValues[field] : '';
        }
        return values[field];
    },

    isRecordDragable:function (record) {
        return this.isDragDropFeatureEnabled(record, 'drag');
    },

    isRecordDropTarget:function (record) {
        return this.isDragDropFeatureEnabled(record, 'drop');
    },

    shouldDropChildOnTop:function (record) {
        var dd = this.getDragDropConfigFor(record);
        if (!dd || !dd['newChild'])return true;
        return dd['newChild'] == 'top';
    },

    isDragDropFeatureEnabled:function (record, feature) {
        if (!this.dd[feature]) {
            return false;
        }
        if (!record.type) {
            return true;
        }
        var dd = this.getDragDropConfigFor(record);
        if (!dd)return false;
        if (dd[feature] !== undefined) {
            return dd[feature];
        }
        return true;
    },

    getDragDropConfigFor:function (record) {
        return this.getRecordConfig(record, 'dd');
    },

    getRemoteConfigFor:function (record) {
        var ret = this.getRecordConfig(record, 'remote');
        if (ret && !ret.url) {
            ret.url = this.getUrl();
        }
        return ret;
    },

    getRecordConfig:function (record, key) {
        if (!record.type || !this.recordConfig[record.type] || this.recordConfig[record.type][key] === undefined) {
            return undefined;
        }
        return this.recordConfig[record.type][key];
    },

    getNewExpandDOMElement:function (record, id) {
        id = id || this.getUniqueRecordId(record);
        var el = this.els.expand[id] = $('<div>');
        el.css('position', 'absolute');
        el.className = 'ludo-tree-node-expand';
        el.setProperty('record', id);
        return el;
    },

    toggleExpandCollapse:function (e) {
        if (!e.target.hasClass('ludo-tree-node-expand')) {
            return;
        }
        var dom = this.getExpandElAndChildByDomNode(e.target);
        var el = dom.expand, child = dom.child;
        if (el.hasClass('ludo-tree-node-collapse')) {
            el.removeClass('ludo-tree-node-collapse');
            child.setStyle('display', 'none');
        } else {
            var record = this.recordMap[el.getProperty('id')].record;
            this.expandNode(record);
        }
    },

    expandByDom:function (e) {
        if (e.target.tagName.toLowerCase() !== 'span')return;
        var dom = this.getExpandElAndChildByDomNode(e.target);
        if (!dom.expand.hasClass('ludo-tree-node-collapse')) {
            var record = this.recordMap[dom.expand.getProperty('id')].record;
            this.expandNode(record);
        }
    },

    getExpandElAndChildByDomNode:function (domNode) {
        if (!domNode.hasClass('ludo-tree-node-expand')) {
            domNode = domNode.getParent('.ludo-tree-node').getElement('.ludo-tree-node-expand');
        }
        var child = domNode.getParent('.ludo-tree-node').getFirst('.ludo-tree-node-container');
        return {
            expand:domNode,
            child:child
        };
    },

    expandButNotLoad:function (record) {
        this.expandNode(record, true);
    },

    expandToRecord:function (record) {
        var parent = this.getParentRecord(record);
        while (parent) {
            this.expandNode(parent, true);
            parent = this.getParentRecord(parent);
        }
    },
    /**
     * @method expandAll
     * @description expand entire tree or branch from parentRecord
     * @param {Object} parentRecord (optional)
     */
    expandAll:function (parentRecord) {
        this.expandSome(parentRecord, 100);
    },

    /**
     * Expand a record
     * @method expandSome
     * @param {Object} parentRecord (optional - if not set, tree will be expanded from root)
     * @param {Number} depth How deep to expand, 1 will only expand direct children
     */
    expandSome:function (parentRecord, depth, currentDepth) {
        parentRecord = parentRecord || this.data;
        if (!parentRecord || !parentRecord.children) {
            return;
        }

        currentDepth = currentDepth || 0;
        currentDepth++;

        for (var i = 0; i < parentRecord.children.length; i++) {
            var record = parentRecord.children[i];
            this.expandNode(record);
            if (record.children && record.children.length > 0 && currentDepth < depth) {
                this.expandSome(record, depth, currentDepth + 1);
            }
        }
    },

    expandNode:function (record, skipRemote) {
        var id = this.getUniqueRecordId(record);
        if(!this.els.expand[id])return;
        this.els.expand[id].addClass('ludo-tree-node-collapse');
        this.els.childContainers[id].style.display = '';

        if (!skipRemote && this.shouldLoadChildrenRemotely(record)) {
            this.loadChildNodes(record);
        } else if (record.children && record.children.length && !this.isRendered(record.children[0])) {
            this.renderChildNodes(record);
        }
    },

    loadChildNodes:function (record) {
        var remoteConfig = this.getRemoteConfigFor(record);

		var req = ludo.remote.JSON({
			url: remoteConfig.url,
			data : Object.merge(remoteConfig.data, { record:record }),
			listeners:{
				"success": function(request){
					record.children = request.getResponseData();
					this.renderChildNodes(record);
					this.remoteLoadedNodes[this.getUniqueRecordId(record)] = true;
					this.showHideExpandElement(record);
				}.bind(this)
			}
		});
        req.send();
    },

    isRendered:function (record) {
        var id = record.unique || this.getUniqueRecordId(record);
        return this.els.nodes[id] && this.els.nodes[id].tagName ? true : false;
    },

    showHideExpandElement:function (record, id) {
        id = id || this.getUniqueRecordId(record);
        if (this.isRootNode(record)) {
            this.els.expand[id].css('display', 'none');
            return;
        }
        if (this.shouldLoadChildrenRemotely(record)) {
            this.els.expand[id].style.display = '';
        }
        else if (record['leaf'] || !record.children || record.children.length == 0) {
            this.els.expand[id].css('display', 'none');
        } else {
            this.els.expand[id].style.display = '';
        }
    },

    isRootNode:function (record) {
        if (this.rootRecord) {
            return record.id == this.rootRecord.id;
        }
        return false;
    },

    remoteLoadedNodes:{},
    shouldLoadChildrenRemotely:function (record) {
        if (record['leaf']) {
            return false;
        }
        var id = this.getUniqueRecordId(record);

        if (this.remoteLoadedNodes[id] || (record.children && record.children.length > 0)) {
            return false;
        }

        return this.getRemoteConfigFor(record) ? true : false;
    },

    uniqueCache:{},
    uniqueCounter:0,
    getUniqueRecordId:function (record) {
        if (!record.unique) {
            this.uniqueCounter++;
            record.unique = ['U', this.id, '-', this.uniqueCounter].join('');
        }
        return record.unique;
    },

    getPrimaryKey:function (record) {
        if (!this.primaryKey.length) {
            return record.id;
        }
        var ret = '';
        for (var i = 0; i < this.primaryKey.length; i++) {
            var field = this.primaryKey[i];
            ret += record[field] ? record[field] : '';
        }
        return ret;
    },

    getParentRecord:function (record) {
        var id = this.getUniqueRecordId(record);
        if (!this.recordMap[id]) {
            this.buildRecordMap();
        }
        return this.recordMap[id].parent;
    },

    showNode:function (record) {
        var id = record.unique || this.getUniqueRecordId(record);
        if (!this.hiddenNodes[id]) {
            return;
        }
        var node = this.els.nodes[id];
        if (node) {
            node.style.display = '';
            this.hiddenNodes[id] = false;
        }
    },

    hideNode:function (record) {
        var id = record.unique || this.getUniqueRecordId(record);
        if (this.hiddenNodes[id])return;
        this.els.nodes[id].css('display', 'none');
        this.hiddenNodes[id] = true;
    },

    showChildren:function (record) {
        if (record.children && record.children.length) {
            for (var i = 0; i < record.children.length; i++) {
                this.showNode(record.children[i]);
            }
        }
    },

    showBranch:function (record) {
        if (record.children && record.children.length) {
            for (var i = 0; i < record.children.length; i++) {
                this.showNode(record.children[i]);
                this.showBranch(record.children[i]);
            }
        }
    }
});