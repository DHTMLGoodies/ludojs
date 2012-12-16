ludo.DashboardMovable = new Class({
    Extends : ludo.Movable,

    delay : 0,

    initialize : function() {
        this.parent();
    },

    mouseOverTarget : function(e) {
        if(this.dragProperties.mode == 'move'){
            var el = e.target;
            if(!el.hasClass('ludo-movable-target')){
                el = el.getParent('.ludo-movable-target');
            }
            this.setWidthOfShimAndInsertionPoint(el.getStyle('width'));

            if(!this.hasMovedToANewColumn(el)){
                return false;
            }

            this.dragProperties.jsObjects.target.column = this.targets[el.id];
            this.dragProperties.jsObjects.target.item = null
            
            this.placeInsertionMarker(e);
            this.dragProperties.countSources = el.getElements('.ludo-movable').length;
        }
    },

    createInsertionMarker : function(){
        this.parent();
        ludo.dom.addClass(this.els.insertionMarker, 'ludo-dashboard-insertion-marker');
    },

    hasMovedToANewColumn : function(el) {
        if(el.id == this.dragProperties.mouseOverCol){
            return false;
        }
        this.dragProperties.mouseOverCol = el.id;
        return true;
    },

    mouseMoveOnTarget : function(e) {
        if(this.dragProperties.mode == 'move'){
            if(e.target.hasClass('ludo-dashboard-insertion-marker')){
                return;
            }
            
            var el = this.getTargetElementFromEvent(e);

            if(e.target.hasClass('ludo-movable') || e.target.getParent('.ludo-movable')){
                var el = e.target;
                if(!el.hasClass('ludo-movable')){
                    el = el.getParent('.ludo-movable');
                }
                this.dragProperties.jsObjects.target.item = this.sources[el.id];

                if(this.isMouseOverDragHandle(e.target)){
                    this.dragProperties.jsObjects.target.pos = 'before';
                }else{
                    this.dragProperties.jsObjects.target.pos = 'after';
                }
            }else{
                if(this.dragProperties.countSources == 0){
                    this.dragProperties.jsObjects.target.item = null;
                }
            }
            this.placeInsertionMarker();
        }
    },
    
    isMouseOverDragHandle : function(el) {
        if(el.hasClass('ludo-movable-handle') || el.getParent('.ludo-movable-handle')){
            return true;
        }
        return false;
    },

    placeInsertionMarker : function() {
        if(this.getTargetItem()) {
            this.els.insertionMarker.inject(this.getTargetItem().getEl(), this.getTargetPosition());

        }else{
            if(this.getTargetColumn()){
                this.getTargetColumn().getBody().adopt(this.els.insertionMarker);
            }
        }
        this.resizeInsertionMarker();
    },

    resizeInsertionMarker : function() {
        var obj = this.dragProperties.jsObjects.source.item;
        if(obj.isMinimized()){
            return;
        }

        if(obj.shouldPreserveAspectRatio()) {
            var ratio = obj.getAspectRatio();
            var height = this.els.insertionMarker.getStyle('width').replace('px','') / ratio;

            this.els.insertionMarker.setStyle('height', height);
            this.els.shim.setStyle('height', height);
        }
    },

    startMove : function(e) {
        this.parent(e);
        return false;
    },

    setInitialInsertionPoint : function() {
        var position = null;
        var item = null;
        var next = this.dragProperties.jsObjects.source.item.getEl().getNext('.ludo-movable');
        if(next){
            item = this.sources[next.id];
            position = 'before'
        }

        this.dragProperties.mouseOverCol = this.dragProperties.jsObjects.source.column.getEl().id;
        this.dragProperties.jsObjects.target = {
            column : this.dragProperties.jsObjects.source.column,
            item : item,
            pos : position
        };
    }




});