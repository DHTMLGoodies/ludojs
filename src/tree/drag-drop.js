ludo.tree.DragDrop = new Class({
    Extends : ludo.Movable,
    delay : 0.5,
    dropConfigs : {},
    dropPositionValidator : undefined,
    dropValidator : undefined,

    initialize : function(config) {
        this.parent(config);

        config = config || {};
        if(config.dropValidator !== undefined){
            this.dropValidator = config.dropValidator;
        }
        if(config.dropPositionValidator !== undefined){
            this.dropPositionValidator = config.dropPositionValidator;
        }

        ludo.dom.addClass(this.els.shim, 'ludo-tree-movable-shim');
        ludo.dom.addClass(this.els.insertionMarker, 'ludo-tree-insertion-marker');
        document.body.adopt(this.els.insertionMarker);

    },

    hideSourceAndShowShim : function() {
        this.parent();
        this.els.shim.set('html', this.dragProperties.el.get('html'));
        this.els.shim.set('html', this.getSourceRecord().title);
    },

    resizeShim : function(){

    },

    mouseOverTarget : function(e) {
        if(this.dragProperties.mode == 'move'){
            var el = this.getTargetElementFromEvent(e);
            var success = true;
            if(this.dropValidator !== undefined){
                success = this.dropValidator.call(this,this.getSourceRecord(), this.records[el.id]);
            }
            if(success){
                this.dragProperties.jsObjects.target.item = el;
            }else{
                this.dragProperties.jsObjects.target.item = undefined;
            }
        }
    },

    mouseMoveOnTarget : function(e){
        if(this.dragProperties.jsObjects.target.item){
            this.dragProperties.jsObjects.target.pos = this.getInjectionPos(e);
            this.placeInsertionMarker();
        }

    },

    getInjectionPos : function(e){
        if(!this.dragProperties.jsObjects.target.item){
            return undefined;
        }

        if(this.dropPositionValidator){
            var pos = this.dropPositionValidator.call(this, this.getSourceRecord(), this.getTargetRecord());
            if(pos){
                return pos;
            }
        }
        
        var dropConfig = this.getDropConfig();
        if(dropConfig.children !== undefined && !dropConfig.children){
            return 'sibling';
        }
        if(dropConfig.siblings !== undefined && !dropConfig.siblings){
            return 'child';
        }

        var elCoordinates = this.getDOMCoordinatesFromCache(this.dragProperties.jsObjects.target.item);
        if(e.page.x <= elCoordinates.left+20){
            return 'sibling';
        }
        return 'child';
    },

    setHeightOfInsertionMarker : function(){

    },

    startMove : function(e){
        this.parent(e);
        this.positionShimAtMouseCursor(e);
        return false;

    },

    mouseMove : function(e) {
        if(this.dragProperties.mode == 'move'){
            this.positionShimAtMouseCursor(e);
            return false;
        }
		return undefined;
    },

    positionShimAtMouseCursor : function(e){
        this.els.shim.setStyles({
            left : e.page.x,
            top : e.page.y + 20
        });
    },

    addTarget : function(obj){
        this.parent(obj);
        if(obj.config){
            this.dropConfigs[obj.el.id] = obj.config;
        }
    },


    stopMove : function(e){
        if(this.dragProperties.mode){
            this.posCache = {};
            var sourceComponent = this.getSourceComponent();
            var targetView = this.getTargetView();

            if(sourceComponent && targetView){
                            
                var sourceRecord = this.getSourceRecord();
                sourceRecord = Object.clone(sourceRecord);

                sourceComponent.fireEvent('remove', this.getSourceRecord());
                var eventObj = {
                    record : sourceRecord,
                    targetRecord : this.getTargetRecord(),
                    pos : this.getTargetPosition()
                };
                targetView.fireEvent('add', eventObj  );
            }

        }
        this.parent(e);
    },

    placeInsertionMarker : function() {
        if(this.dragProperties.mode && this.dragProperties.jsObjects.target.item){
            if(this.dragProperties.jsObjects.target.pos == 'sibling'){
                ludo.dom.addClass(this.els.insertionMarker, 'ludo-tree-insertion-marker-sibling');
            }else{
                this.els.insertionMarker.removeClass('ludo-tree-insertion-marker-sibling');
            }

            var coords = this.getDOMCoordinatesFromCache(this.dragProperties.jsObjects.target.item);
            this.els.insertionMarker.setStyles({
                left : coords.left,
                top : coords.top + coords.height,
                display : ''
            });
        }
    },

    createInsertionMarker : function() {
        var el = this.els.insertionMarker = $('<div>');
        el.setStyle('display','none');
        document.body.adopt(el);
    },


    posCache : {},
    getDOMCoordinatesFromCache : function(el){
        if(!this.posCache[el.id]){
            this.posCache[el.id] = el.getFirst().getCoordinates();
        }
        return this.posCache[el.id];
    },
    
    getDropConfig : function() {
        var config = this.dropConfigs[this.dragProperties.jsObjects.target.item.id];
        return config ? config : {};

    }
});