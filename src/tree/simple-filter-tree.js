ludo.tree.SimpleFilterTree = new Class({
    Extends: ludo.View,
    type : 'tree.SimpleFilterTree',
    treeConfig : undefined,

    inputConfig : {},
    selectedRecord : undefined,
    layout : {
        type : 'rows'
    },
    tree : undefined,

    input : undefined,
    timeStamp:0,
    currentSearchValue:'',

    __construct : function(config){
        this.parent(config);

        if(config.treeConfig){
            config.tree = config.treeConfig;
        }
        if(config.inputConfig){
            config.input = config.inputConfig;
        }
        if(config.input !== undefined)this.inputConfig = config.input;
        this.inputConfig.cls = 'ludo-input-simple-filter-tree';

        this.inputConfig.labelWidth = this.inputConfig.labelWidth || 50;
        this.inputConfig.fieldWidth = config.width - this.inputConfig.labelWidth;
        this.inputConfig.type= 'form.Text';
        this.inputConfig.label = 'Search';
        this.inputConfig.stretchField = true;
        this.inputConfig.height = 30;

        this.treeConfig = config.tree;
        this.treeConfig.type = 'tree.Tree';
		this.treeConfig.layout = this.treeConfig.layout || {};
        this.treeConfig.layout.weight=1;


        this.treeConfig.search = true;
    },

    __rendered : function() {
        this.parent();
        this.input = this.addChild(this.inputConfig);

        this.input.addEvent('blur', this.blurInput.bind(this));
        this.input.addEvent('key_up', this.filter.bind(this));

        this.tree = this.addChild(this.treeConfig);

        this.tree.addEvent('click', this.selectRecord.bind(this));
        this.resize.delay(100, this);
    },

    blurInput : function(){
        this.input.getFormEl().removeClass('ludo-filter-tree-input-active');
    },

    filter : function() {
        var val = this.input.getValue();
        if(val == this.currentSearchValue){
            return;
        }
        var d = new Date();
        this.timeStamp = d.getTime();

        this.filterAfterDelay(this.input.getValue());
        this.currentSearchValue = val;
    },

    filterAfterDelay:function(val){
        var d = new Date();
        if(d.getTime() - this.timeStamp < 200){
            this.filterAfterDelay.delay(100, this, val);
            return;
        }
        this.timeStamp = d.getTime();
        if(val == this.input.getValue()){
            this.tree.filter(this.input.getValue());
        }
    },

    setValue : function(value){
        this.input.setValue(value);
    },

    selectRecord : function(record){
        this.selectedRecord = record;
        this.fireEvent('selectrecord', [this, this.getSelectedRecord()]);
    },

    getSelectedRecord : function(){
        return this.selectedRecord;
    },

    getParentRecord : function(record){
        return this.tree.children[0].getParentRecord(record);
    }

});