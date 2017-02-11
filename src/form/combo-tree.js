/**
 * A "combo" where you select value from a tree. id of clicked tree node will be set as
 * value.
 * @class ludo.form.ComboTree
 * @param {Object} config
 */
ludo.form.ComboTree = new Class({
    Extends:ludo.form.Element,
    type:'form.ComboTree',
    cssSignature:'form-combo',
    /*
     * Configuration for tree panel. It can be a new config for ludo.tree.Tree or
     * a simple reference to your own pre-configured tree, example:
     * { width: 500, height: 500, type: 'myApp.tree.Folders'
     * 'myApp.tree.Folders' will here be  class named ludo.myApp.tree.Folders
     * This is an example of a custom made ludo.tree.Tree:
     * ludo.chess.view.folder.Tree = new Class({
     Extends:ludo.tree.Tree,
     module:'folder.tree',
     remote:{
     url:window.ludo.chess.URL,
     data:{
     getFolders:1
     }
     },
     nodeTpl:'<img src="' + window.ludo.chess.ROOT + 'images/{icon}"><span>{title}</span>',

     recordConfig:{
     'folder':{
     selectable:false,
     defaults:{
     icon:'folder.png'
     }
     },
     'database':{
     selectable:true,
     defaults:{
     icon:'database.png'
     }
     }
     },

     treeConfig:{
     defaultValues:{
     icon:'folder.png'
     }
     },
     
     ludoEvents:function () {
     this.parent();
     this.addEvent('selectrecord', this.selectDatabase.bind(this));
     },
     
     selectDatabase:function (record) {
     this.fireEvent('selectdatabase', record);
     }
     });
     * @attribute treeConfig
	 * @type Object
     * @default undefined
     */
    treeConfig:undefined,


    emptyText:'',

    width:400,
    height:26,

    inputConfig:{
        fieldWidth:440,
        labelWidth:1,
        width:350
    },
    selectedRecord:undefined,
    layout:{
        type:'cols'
    },
    treePanel:undefined,
    input:undefined,
    searchable:false,
    timeStamp:0,
    currentSearchValue:'',

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['searchable','inputConfig','treeConfig','emptyText']);

        if (this.treeConfig.type === undefined)this.treeConfig.type = 'tree.Tree';
        this.inputConfig.type = 'form.Text';
        this.inputConfig.stretchField = true;
    },

    ludoEvents:function () {
        this.parent();
        jQuery(document.body).on('mousedown', this.autoHide.bind(this));
    },

    ludoDOM:function () {
        if (this.label) {
            this.addChild({
                html:'<label>' + this.label + ':</label>',
                width:this.labelWidth
            });
        }

        this.viewField = this.addChild({
            type:'form.ComboField',
            weight:1
        });
        this.viewField.addEvent('click', this.showTree.bind(this));

        this.input = this.addChild(this.inputConfig);
        this.input.addEvent('focus', this.showTree.bind(this));
        this.input.addEvent('focus', this.selectInputText.bind(this));
        this.input.addEvent('blur', this.blurInput.bind(this));
        this.input.addEvent('key_up', this.filter.bind(this));
        this.input.addEvent('key_down', this.keyDown.bind(this));
        this.input.hide();

        this.treePanel = new ludo.Window({
            cls:'ludo-Filter-Tree-Window',
            width:this.treeConfig.width,
            alwaysInFront:true,
            resizeTop:false,
            resizeLeft:false,
            minWidth:this.fieldWidth,
            height:this.treeConfig.height,
            titleBar:false,
            renderTo:document.body,
            layout:'fill',
            children:[this.treeConfig]
        });
        this.treePanel.hide();
        this.treePanel.addEvent('beforeresize', this.setBusy.bind(this));
        this.treePanel.addEvent('afterresize', this.setNotBusy.bind(this));

        this.treePanel.children[0].getDataSource().addEvent('select', this.receiveSelectedRecord.bind(this));

        this.parent();

        this.getEl().addClass('ludo-filter-tree');

        this.resize.delay(100, this);

        this.resizeChildren();
    },

    __rendered:function () {
        this.parent();
        if (this.emptyText) {
            this.setViewValue(this.emptyText);
        }
    },

    busyWithResize:false,

    setBusy:function () {
        this.busyWithResize = true;
    },

    setNotBusy:function () {
        this.setNotBusyAfterDelay.delay(500, this);
    },

    setNotBusyAfterDelay:function () {
        this.busyWithResize = false;
    },

    arrowClick:function () {
        if (this.treePanel.isHidden()) {
            this.selectInputText();
            this.showTree();
        } else {
            this.hideTree();
        }
    },

    selectInputText:function () {
        this.input.getFormEl().select();
    },
    blurInput:function () {
        this.input.getFormEl().removeClass('ludo-filter-tree-input-active');
    },

    autoHide:function (e) {
        if (this.busyWithResize) {
            return;
        }
        if (!this.treePanel.isVisible()) {
            return;
        }
        var el = e.target;

        if (el.id == this.input.getFormEl().id || el.hasClass('ludo-shim-resize')) {
            return;
        }
        var viewField = this.viewField.getEl();
        if (el.id == viewField.id || el.getParent('#' + viewField.id)) {
            return;
        }
        if (el.getParent('.ludo-shim-resize')) {
            return;
        }
        if (!el.getParent('#' + this.input.getFormEl().id) && !el.getParent('#' + this.treePanel.id)) {
            this.hideTree();
        }
    },

    hideTree:function () {
        this.treePanel.hide();
        if (this.searchable) {
            this.input.hide();
            this.viewField.show();
        }
    },

    keyDown:function (key) {
        if (key === 'esc' || key == 'tab') {
            this.hideTree();
        }
    },

    filter:function (key) {
        if (key === 'esc') {
            return;
        }
        this.treePanel.show();

        var val = this.input._get();
        if (val == this.currentSearchValue) {
            return;
        }
        var d = new Date();
        this.timeStamp = d.getTime();

        this.filterAfterDelay(this.input._get());
        this.currentSearchValue = val;
    },

    filterAfterDelay:function (val) {
        var d = new Date();
        if (d.getTime() - this.timeStamp < 200) {
            this.filterAfterDelay.delay(100, this, val);
            return;
        }
        this.timeStamp = d.getTime();
        if (val == this.input._get()) {
            this.treePanel.children[0].filter(this.input.val());
        }
    },

    showTree:function () {

        if (this.searchable) {
            this.viewField.hide();
            this.input.show();
            this.input.getFormEl().addClass('ludo-filter-tree-input-active');
            this.input.getFormEl().focus();
        }

        this.treePanel.show();

        this.positionTree();
        this.resizeChildren();

        this.treePanel.increaseZIndex();
    },

    setViewValue:function (value) {
        this.input.val(value);
        this.viewField.setViewValue(value);
    },

    positionTree:function () {
        var el;
        if (this.searchable) {
            el = this.input.getEl();

        } else {
            el = this.viewField.getEl();
        }
        var pos = el.getCoordinates();
        this.treePanel.setPosition({
            left:pos.left,
            top:pos.top + el.getSize().y
        });
    },

    getFormEl:function () {
          return this.input.getFormEl();
    },

    selectRecord:function (record) {
        this.treePanel.children[0].selectRecord(record);
    },

    receiveSelectedRecord:function (record) {

        this.val(record.get('id'));
        this.setViewValue(record.get('title'));
        this.fireEvent('selectrecord', [this, record.getData()]);
        this.hideTree.delay(100, this);
    },

    /**
     * No arguments = Return id of selected record
     * @function getValue
     * @return {String} id (tree.selectedRecord.id);
     * @memberof ludo.form.ComboTree.prototype
     */
    val:function(value){
        if(arguments.length == 0){
            return this.value;
        }
        this.parent(value);
    },

    /**
     * Return id of selected record
     * @function getValue
     * @return {String} id (tree.selectedRecord.id);
     * @memberof ludo.form.ComboTree.prototype
     */
    getValue:function () {
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.value;
    },

    /**
     * Return selected record
     * @function getSelectedRecord
     * @return object record
     * @memberof ludo.form.ComboTree.prototype
     */
    getSelectedRecord:function () {
        return this.treePanel.children[0].getSelectedRecord();
    },

    getParentRecord:function (record) {
        return this.treePanel.children[0].getParentRecord(record);
    }
});

ludo.form.ComboField = new Class({
    Extends:ludo.View,
    cls:'ludo-Filter-Tree-Combo-Field',

    ludoEvents:function () {
        this.parent();
        this.$b().on('click', this.clickEvent.bind(this));
    },

    clickEvent:function () {
        this.fireEvent('click');
    },

    setViewValue:function (value) {
        this.els.valueField.html( value);
    },

    ludoDOM:function () {
        this.parent();
        var el = jQuery('<div>');
        el.addClass('ludo-Filter-Tree-Field-Arrow');
        this.$b().append(el);

        var left = jQuery('<div>');
        left.addClass('ludo-Filter-Tree-Bg-Left');
        this.$b().append(left);
        var right = jQuery('<div>');
        right.addClass('ludo-Filter-Tree-Bg-Right');
        this.$b().append(right);

        var valueField = this.els.valueField = jQuery('<div>');
        valueField.addClass('ludo-Filter-Tree-Combo-Value');
        this.$b().append(valueField);
    }
});