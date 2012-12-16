ludo.Movable = new Class({
    Extends : Events,
    sources : {},
    targets : {},
    records : {},
    components : {},
    els : {
        shim : null,
        insertionMarker : null
    },
    dragProperties : {
        el : null,
        waiting : null,
        countSources : 0,
        mouseOverCol : null,
        originalMousePos : {
            x : null,
            y : null
        },
        originalElPos : {
            x : null,
            y : null
        },
        jsObjects : {
            source : {
                item : null,
                column : null
            },
            target : {
                item : null,
                column : null,
                pos : null
            }
        }
    },
    id : null,
    delay : 1,
    
    initialize : function() {
        this.createElements();
        this.id = String.uniqueID();

        document.body.addEvent('mouseup', this.stopMove.bind(this));
        document.body.addEvent('mousemove', this.mouseMove.bind(this));
    },



    addSource : function(obj) {
        var handle = obj.handle || null;
        var record = obj.record || null;
        var component = obj.component || null;
        var el = obj.el || component.getEl();

        if(el.hasClass('ludo-movable')){
            return;
        }
        if(!el.id){
            el.id = 'ludo-movable-' + String.uniqueID();
        }
        if(this.sources[el.id]){
            console.log(el.id);
            console.log('Error: ' + el.id + ' has duplicates');
        }
        
        if(record){
            this.records[el.id] = record;
        }
        if(component){
            this.components[el.id] = component;
        }
        this.sources[el.id] = obj.el || obj.component;
        ludo.dom.addClass(el, 'ludo-movable');
        if(handle){
            var handleObj = el.getElements(handle)[0];
            try{
                handleObj.addEvent('mousedown', this.startMove.bind(this));
            }catch(e){
                console.log(obj);
            }
            ludo.dom.addClass(handleObj, 'ludo-movable-handle');
            handleObj.setStyle('cursor','move');
        }else{
            el.addEvent('mousedown', this.startMove.bind(this));
        }

    },

    addTarget : function(obj){

        var record = obj.record || null;
        var component = obj.component || null;
        var el = obj.el || component.getEl();

        if(!el.id){
            el.id = 'ludo-movable-target-' + String.uniqueID();
        }
        this.targets[el.id] = obj.el || obj.component;
        if(record){
            this.records[el.id] = record;
        }
        if(component){
            this.components[el.id] = component;
        }
        el.addEvent('mousemove', this.mouseMoveOnTarget.bind(this));
        el.addEvent('mouseover', this.mouseOverTarget.bind(this));
        ludo.dom.addClass(el, 'ludo-movable-target');
    },

    mouseOverTarget : function() {

    },

    mouseMoveOnTarget : function() {

    },
    setWidthOfShimAndInsertionPoint : function(width) {
        this.els.shim.setStyle('width', width);
        this.els.insertionMarker.setStyles({
            width : width,
            display : ''
        });
    },
    getTargetElementFromEvent : function(e){
        var el = e.target;
        if(!el.hasClass('ludo-movable-target')){
            el = el.getParent('.ludo-movable-target');
        }
        return el;
    },

    placeInsertionMarker : function() {

    },

    createElements : function() {
        this.createShim();
        this.createInsertionMarker();
    },

    createShim : function() {
        var el = this.els.shim = new Element('div');
        ludo.dom.addClass(el, 'ludo-rich-view-shim');
        el.setStyle('display','none');
        document.body.adopt(el);
    },

    createInsertionMarker : function() {
        var el = this.els.insertionMarker = new Element('div');
        el.setStyle('display','none');
        document.body.adopt(el);
    },

    stopMove : function() {
        if(this.dragProperties.waiting || this.dragProperties.mode){
            this.fireEvent('stop');
        }
        if(this.dragProperties.waiting){
            clearTimeout(this.dragProperties.waiting);
        }
        if(this.dragProperties.mode){
            this.dragProperties.mode = null;
            this.dragProperties.el.setStyle('display', '');
            this.els.shim.setStyle('display','none');
            this.els.insertionMarker.setStyle('display','none');
            this.fireEvent('drop', [this, this.getSourceItem(), this.getTargetItem()]);
        }
    },

    startMove : function(e) {

        this.fireEvent('start');
        this.dragProperties.el = e.target;
        if(!this.dragProperties.el.hasClass('ludo-movable')){
            this.dragProperties.el = this.dragProperties.el.getParent('.ludo-movable');
        }
        var coordinates = this.dragProperties.el.getCoordinates();
        this.els.shim.setStyle('display','none');
        this.resizeShim(coordinates);

        this.dragProperties.mouseOverCol = null;
        this.dragProperties.jsObjects.target = {
            column : null,
            item : null
        };

        this.setHeightOfInsertionMarker();


        this.dragProperties.jsObjects.source = {
            item : this.sources[this.dragProperties.el.id],
            column : this.sources[this.dragProperties.el.id].getParent ? this.sources[this.dragProperties.el.id].getParent() : null
        };

        this.dragProperties.originalElPos = {
            x : coordinates.left,
            y : coordinates.top
        };
        this.dragProperties.originalMousePos = {
            x : e.page.x,
            y : e.page.y
        };
        if(this.hasDelay()){
            this.dragProperties.waiting = this.startMoveAfterDelay.delay(this.delay * 1000, this);
        }else{
            this.hideSourceAndShowShim();
        }
        return false;
    },

    setHeightOfInsertionMarker : function(){
        var size = this.dragProperties.el.getSize();
        this.els.insertionMarker.setStyle('height', size.y);
    },

    resizeShim : function(coordinates){
        this.els.shim.setStyles({
            left : coordinates.left,
            top : coordinates.top + 30,
            width : coordinates.width,
            height : coordinates.height
        });
    },

    hasDelay : function() {
        return this.delay > 0;
    },

    showShim : function() {
        this.els.shim.setStyle('display', '');
    },

    startMoveAfterDelay : function() {
        if(this.dragProperties.waiting){
            this.hideSourceAndShowShim();
        }
    },

    hideSourceAndShowShim : function() {
        this.dragProperties.el.setStyle('display', 'none');
        this.dragProperties.mode = 'move';
        this.showShim();
        this.setInitialInsertionPoint();
        this.placeInsertionMarker();
    },

    mouseMove : function(e) {
        if(this.dragProperties.mode == 'move'){
            this.els.shim.setStyles({
                left : this.dragProperties.originalElPos.x + e.page.x - this.dragProperties.originalMousePos.x,
                top : this.dragProperties.originalElPos.y + e.page.y - this.dragProperties.originalMousePos.y + 30
            });
            return false;
        }
        return undefined;
    },

    setInitialInsertionPoint : function() {
        
    },
    isActive : function() {
        return this.dragProperties.mode ? true : false;
    },

    getSourceColumn : function() {
        return this.dragProperties.jsObjects.source.column;
    },
    getSourceItem : function() {
        return this.dragProperties.jsObjects.source.item;
    },
    getTargetColumn : function() {
        return this.dragProperties.jsObjects.target.column;
    },
    getTargetItem : function() {
        return this.dragProperties.jsObjects.target.item;
    },
    getTargetPosition : function() {
        return this.dragProperties.jsObjects.target.pos;
    },

    getSourceRecord : function(){
        return this.records[this.dragProperties.jsObjects.source.item.id];
    },
    getTargetRecord : function(){
        if(!this.dragProperties.jsObjects.target.item){
            return null;
        }
        return this.records[this.dragProperties.jsObjects.target.item.id];
    },

    getSourceComponent : function(){
        return this.components[this.dragProperties.jsObjects.source.item.id];
    },

    getTargetView : function(){
        if(!this.dragProperties.jsObjects.target.item){
            return null;
        }
        return this.components[this.dragProperties.jsObjects.target.item.id];
    }
});