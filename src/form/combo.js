/**
 * @namespace form
 * @class Combo
 * @extends form.Element
 */
ludo.form.Combo = new Class({
    Extends:ludo.form.Element,
    type:'form.Combo',
    direction:'horizontal',
    height:25,
    labelWidth:0,
    comboMenu:undefined,
    menuItems:null,
    showOnClick:true,
    records : [],
    selectedRecord:undefined,
    remote : {
        isJSON: true
    },

    /**
     * Records for the drop down,<br>
     * example: [{ id: 1, title: 'Record One', id: 2, title: 'Record two' }]<br>
     * The combo can also be populated remotely by specifying remote properties, example:<br>
     * remote:{<br>
     *    url:'my-url.php',<br>
     *    data:{<br>
     *        getRecords:1<br>
     *    }<br>
     *}<br>
     *<br>
     *The response should return structure like this:<br>
     *{ success : true, data: [{ id: 1, title: 'Record One', id: 2, title: 'Record two' }] }
     * @attribute {Array} data
     * @default undefined
     */
    data : undefined,

    getMenuDirection:function () {
        return 'vertical'
    },

    ludoDOM:function () {
        this.parent();
        var el = this.els.arrow = new Element('div');
        ludo.dom.addClass(el, 'ludo-combo-arrow');
        this.getEl().adopt(el);

        el = this.getEl();
        this.getBody().style.cursor = 'pointer';

        el.style.position = 'relative';
        el.style.overflow = 'visible';
        ludo.dom.addClass(el, 'ludo-combo');

    },
    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.toggleMenu.bind(this));
        this.getEventEl().addEvent('resize', this.positionMenu.bind(this));
        this.getEventEl().addEvent('click', this.autoHide.bind(this));
    },
    ludoRendered:function () {
        this.parent();
        var el = this.getEl();
        this.getBody().style.lineHeight = (this.getHeight() - ludo.dom.getPH(el) - ludo.dom.getBH(el)) + 'px';
    },

    autoHide : function(e){
        if(!e.target.hasClass('ludo-combo') && !e.target.getParent('.ludo-combo')){
            this.menu.hide.delay(100, this.menu);
        }
    },
    insertJSON:function (data) {
        this.records = data;
        this.data = data;

        this.menuItemsToRecords(this.records);
        this.addListenersToMenuItems(this.records);
        this.createMenu();

        this.selectRecord(this.records[0]);
    },

    menuItemsToRecords:function (records) {
        this.menuItems = [];
        for (var i = 0; i < records.length; i++) {
            this.menuItems.push({
                label:records[i].title,
                record:records[i]
            });
        }
    },
    addListenersToMenuItems:function () {
        for (var i = 0; i < this.menuItems.length; i++) {
            var el = this.menuItems[i];
            if (el !== '|') {
                if (!el.listeners) {
                    el.listeners = {};
                }
                el.listeners.click = this.menuClick.bind(this);
            }
        }
    },
    /**
     * Return value, i.e. id of selected record
     * @method getValue
     * @return string value
     */
    getValue:function () {
        if (this.selectedRecord) {
            return this.selectedRecord.id;
        }
        return null;
    },
    /**
     * Return selected record
     * @method getSelectedRecord
     * @return {Object} selected record
     */
    getSelectedRecord:function () {
        return this.selectedRecord;
    },

    menuClick:function (obj) {
        this.selectRecord(obj.getRecord());
        this.menu.hide();
        /**
         * @event change
         * @param {Object} selected record
         * @param Component this
         */
        this.fireEvent('change', [ this.selectedRecord, this ]);
    },

    selectRecord:function (record) {
        this.selectedRecord = record;
        this.setHtml(this.selectedRecord.title);
        this.menu.selectRecord(record);
    },

    setValue : function(value){
        for(var i=0;i<this.records.length;i++){
            if(this.records[i].id && this.records[i].id === value){
                this.selectRecord(this.records[i]);
            }
        }
    },

    toggleMenu:function () {
        if (this.menu.isVisible()) {
            this.menu.hide();
        } else {
            this.menu.show();
            this.positionMenu();
        }
    },

    positionMenu:function () {
        var el = this.menu.getEl();
        var coordinates = this.getEl().getCoordinates();
        el.style.top = (coordinates.top + coordinates.height) + 'px';
        el.style.left = coordinates.left + 'px';
    },

    createMenu:function () {
        this.menu = new ludo.Menu({
            cls:'ludo-combo-menu',
            renderTo:document.body,
            direction:'vertical',
            width:this.getWidth(),
            children:this.menuItems

        });
        this.menu.getEl().setStyles({
            position:'absolute',
            width:200
        });
        this.menu.hide();
    }

});
