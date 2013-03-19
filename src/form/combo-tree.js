/**
 * @namespace form
 * @class ComboTree
 * @description A "combo" where you select value from a tree. id of clicked tree node will be set as
 * value.
 * @extends form.Element
 */
ludo.form.ComboTree = new Class({
    Extends:ludo.form.Element,
    type:'form.ComboTree',
    cssSignature:'form-combo',
    /**
     * Configuration for tree panel. It can be a new config for ludo.tree.Tree or
     * a simple reference to your own pre-configured tree, example:
     * { width: 500, height: 500, type: 'myApp.tree.Folders'
     * 'myApp.tree.Folders' will here be  class named ludo.myApp.tree.Folders
     * This is an example of a custom made ludo.tree.Tree:<br>
     * ludo.chess.view.folder.Tree = new Class({<br>
     Extends:ludo.tree.Tree,<br>
     module:'folder.tree',<br>
     remote:{<br>
     url:window.ludo.chess.URL,<br>
     data:{<br>
     getFolders:1<br>
     }<br>
     },<br>
     nodeTpl:'<img src="' + window.ludo.chess.ROOT + 'images/{icon}"><span>{title}</span>',<br><br>

     recordConfig:{<br>
     'folder':{<br>
     selectable:false,<br>
     defaults:{<br>
     icon:'folder.png'<br>
     }<br>
     },<br>
     'database':{<br>
     selectable:true,<br>
     defaults:{<br>
     icon:'database.png'<br>
     }<br>
     }<br>
     },<br><br>

     treeConfig:{<br>
     defaultValues:{<br>
     icon:'folder.png'<br>
     }<br>
     },<br>
     <br>
     ludoEvents:function () {<br>
     this.parent();<br>
     this.addEvent('selectrecord', this.selectDatabase.bind(this));<br>
     },<br>
     <br>
     selectDatabase:function (record) {<br>
     this.fireEvent('selectdatabase', record);<br>
     }<br>
     });
     * @attribute treeConfig
	 * @type Object
     * @default undefined
     */
    treeConfig:undefined,

    /**
     * Text to display in combo when no value is selected
     * @attribute emptyText
	 * @type String
     * @default '' (empty string);
     */
    emptyText:'',

    width:400,
    height:26,
    /**
     *
     * @attribute Object inputConfig
     *
     */
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

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['searchable','inputConfig','treeConfig','emptyText']);

        if (this.treeConfig.type === undefined)this.treeConfig.type = 'tree.Tree';
        this.inputConfig.type = 'form.Text';
        this.inputConfig.stretchField = true;
    },

    ludoEvents:function () {
        this.parent();
        document.body.addEvent('mousedown', this.autoHide.bind(this));
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

        this.treePanel.children[0].addEvent('selectrecord', this.receiveSelectedRecord.bind(this));

        this.parent();

        this.getEl().addClass('ludo-filter-tree');

        this.resize.delay(100, this);

        this.resizeChildren();
    },

    ludoRendered:function () {
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

        var val = this.input.getValue();
        if (val == this.currentSearchValue) {
            return;
        }
        var d = new Date();
        this.timeStamp = d.getTime();

        this.filterAfterDelay(this.input.getValue());
        this.currentSearchValue = val;
    },

    filterAfterDelay:function (val) {
        var d = new Date();
        if (d.getTime() - this.timeStamp < 200) {
            this.filterAfterDelay.delay(100, this, val);
            return;
        }
        this.timeStamp = d.getTime();
        if (val == this.input.getValue()) {
            this.treePanel.children[0].filter(this.input.getValue());
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
        this.input.setValue(value);
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
        this.setValue(record.id);
        this.setViewValue(record.title);
        this.fireEvent('selectrecord', [this, record]);
        this.hideTree.delay(100, this);
    },

    /**
     * Return id of selected record
     * @method getValue
     * @return {String} id (tree.selectedRecord.id);
     */
    getValue:function () {
        return this.value;
    },

    /**
     * Return selected record
     * @method getSelectedRecord
     * @return object record
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
        this.getBody().addEvent('click', this.clickEvent.bind(this));
    },

    clickEvent:function () {
        this.fireEvent('click');
    },

    setViewValue:function (value) {
        this.els.valueField.set('html', value);
    },

    ludoDOM:function () {
        this.parent();
        var el = new Element('div');
        ludo.dom.addClass(el, 'ludo-Filter-Tree-Field-Arrow');
        this.getBody().adopt(el);

        var left = new Element('div');
        ludo.dom.addClass(left, 'ludo-Filter-Tree-Bg-Left');
        this.getBody().adopt(left);
        var right = new Element('div');
        ludo.dom.addClass(right, 'ludo-Filter-Tree-Bg-Right');
        this.getBody().adopt(right);

        var valueField = this.els.valueField = new Element('div');
        ludo.dom.addClass(valueField, 'ludo-Filter-Tree-Combo-Value');
        this.getBody().adopt(valueField);
    }
});