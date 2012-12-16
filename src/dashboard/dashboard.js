/**
 * @namespace dashboard
 * @class Dashboard
 * @extends View
 */
ludo.dashboard.Dashboard = new Class({
    Extends : ludo.View,

    type : 'dashboard.Dashboard',
    cType : 'dashboard.Column',

    els : {
        'parent' : null,
        'el' : null,
        'resizeHandles' : []
    },
    /**
     * Children of dashboard.Dashboard should be of type
     * ludo.dashboard.DashboardColumn
     * @method ludoConfig
     * @param config
     */
    ludoConfig : function(config){
        this.parent(config);
        
        config = config || {};
        config.els = config.els || {};
    },

    parseInitialColumnConfig : function(){

        var countColumns = this.children.length;
        var widthOfView = this.getWidthOfView();

        for(var i=0;i<countColumns;i++){
            var width = this.children[i].getWidth();
            if(!width){
                width = (100 / countColumns) + '%';
                this.children[i].setWidth(width);
            }

            if(!isNaN(width)){
                widthOfView -= width;
            }

        }

        var ret = [];

        for(var i=0;i<countColumns;i++){
            var width = this.children[i].getWidth();
            if(isNaN(width)){
                width = width.replace(/[^0-9]/g,'') / 1;
                width = Math.round(widthOfView * width / 100);
                this.children[i].setWidth(width);
                ret.push(width);
            }
        }
    },


    resizeDOM : function(){
        this.getEl().setStyle('height', '100%');

        this.getBody().setStyles({
            'height' : '100%',
            'overflow-y' : 'auto'
        });
    },

    ludoDOM : function() {
        this.parent();
        this.getEl().addClass('ludo-dashboard');
    },
    ludoEvents : function() {
        document.body.addEvent('mousemove', this.moveColResizeHandle.bind(this));
        document.body.addEvent('mouseup', this.stopColResize.bind(this));
    },

    ludoRendered : function() {
        this.applyStylesToParentElement();
        this.parseInitialColumnConfig();
        this.createElements();
        this.createColumns();
        this.resize();
    },

    getColumnWidths : function() {
        var ret = [];
        for(var i=0;i<this.children.length;i++){
            ret.push(this.children[i].getWidth());
        }
        return ret;
    },
    createColumns : function() {
        var columnWidths = this.getColumnWidthsInPixels();
        
        for(var i=0;i<this.children.length;i++){
            this.children[i].addEvent('resize', this.children[i].resize );
        }
    },

    setNewSizeOfColumns : function() {
        if(this.children.length == 0){
            return;
        }
        var colConfigWidth = this.getTotalWidthFromColumnConfig();

        var widthOfNotResizable = this.getTotalWidthOfFixedColumns();
        var widthOfView = this.getWidthOfView();

        var ratio = (widthOfView - widthOfNotResizable) / ( colConfigWidth - widthOfNotResizable);
        var restWidth = widthOfView;
 
        for(var i=0;i<this.children.length-1;i++){
            if(!this.hasColumnFixedSize(i)){
                this.children[i].setWidth( this.children[i].getWidth() * ratio );
            }
            restWidth -= this.children[i].getWidth();
        }
        this.children[this.children.length-1].setWidth(restWidth);

    },

    getTotalWidthOfFixedColumns : function() {
        var ret = 0;
        for(var i=0;i<this.children.length;i++){
            if(this.hasColumnFixedSize(i)){
                ret += this.children[i].getWidth();
            }
        }
        return ret;
    },

    getTotalWidthFromColumnConfig : function() {
        var ret = 0;
        for(var i=0;i<this.children.length;i++){
            ret += this.children[i].getWidth();
        }
        return ret;
    },

    isColumnResizable : function(columnIndex){
        if(columnIndex >= this.children.length){
            return true;
        }
        if(this.children[columnIndex].isResizable()){
            return true;
        }
        return false;
    },

    stopColResize : function(e) {

        if(this.resizeProperties.active){
            this.resizeProperties.active = false;
            this.resizeProperties.el.removeClass('ludo-resize-handle-active');

            var change = this.resizeProperties.currentX - this.resizeProperties.elX;
            this.children[this.resizeProperties.index].increaseWidth(change);
            this.children[this.resizeProperties.index+1].increaseLeft(change);
            this.children[this.resizeProperties.index+1].increaseWidth(change *-1);

            this.resizeChildren();

            this.fireEvent('resize');
 
        }

    },

    getColumnWidthsInPixels : function() {
        var ret = [];
        for(var i=0;i<this.children.length;i++){
            ret.push(Math.round(this.children[i].getWidth()));
        }
        return ret;
    },



    resize : function() {
        if(!this.els.parent){
            return;
        }
        this.setNewSizeOfColumns();
        this.parent({
            'width' : this.getWidth(),
            'height' : this.getHeight()
        });
    },

    isVisible : function() {
        return this.getEl().getCoordinates().width === 0 ? false : true;
    },
    applyStylesToParentElement : function() {
        if(!this.els.parent){
            return;
        }
        var position = this.els.parent.getStyle('position');
        if(position!='absolute'){
            this.els.parent.setStyle('position', 'relative');
        }
    },

    createElements : function() {
        var el = this.els.body;
        el.setStyles({
            'position' : 'relative'
        });
        ludo.dom.addClass(el, 'ludo-dashboard-content');

        this.createColResizeHandles();
    },

    createColResizeHandles : function() {

        for(var i=0;i<this.children.length-1;i++){
            var el = this.createAColResizeHandle(i);
        }
    },

    getMinPosOfResizeHandle : function(handleIndex) {
        var sizes = this.getColumnWidthsInPixels();

        var ret = 0;
        var width = 0;
        for(var i=0;i<=handleIndex;i++){
            ret+= width;
            width+=sizes[i];
        }
        ret+= Math.max(0, this.children[handleIndex].getMinWidth());
        return ret;
    },

    getMaxPosOfResizeHandle : function(handleIndex) {
        var sizes = this.getColumnWidthsInPixels();

        var ret = 0;

        for(var i=0;i<=handleIndex+1;i++){
            ret+= sizes[i];
        }
        ret-=this.children[handleIndex+1].getMinWidth();
        
        ret = Math.min(ret, this.getWidthOfView() - this.children[this.children.length-1].getMinWidth() );
        return ret;
    },

    getWidthOfView : function() {
        if(!this.els.parent){
            return 1000;
        }
        if(this.getParent() && this.getParent().getBody){
            return this.getWidthOfEl(this.getParent().getBody());
        }else{
            return this.getWidthOfEl(this.els.parent);
        }
    },

    getWidthOfEl : function(el) {
        var ret = el.getStyle('width').replace(/[^0-9\.]/g,'');
        ret = ret ? ret : el.getSize().x;
        if(el.getStyle('overflow-y') == 'auto'){
            ret-=20;
        }
        if(ret <= 0 && el.getParent('.ludo-component-content')){
            return this.getWidthOfEl(el.getParent('.ludo-component-content'));
        }
        if(ret == 0){
            ret = 1000;
        }

        return Math.round(ret);
    },



    resizeChildren : function(){
        var left = 0;
        var sizes = this.getColumnWidthsInPixels();
        var heightOfView = this.getInnerHeight(this.getEl());
 
        var resizeHandleOffset = this.getLeftOffsetOfColResizeHandle();
        
        for(var i=0;i<this.children.length;i++){
            this.children[i].resize({ 'left' : left, 'width' :  sizes[i] });
            left+=sizes[i];
            if(i< this.children.length-1){
                this.els.resizeHandles[i].setStyles({
                    'left' : left - resizeHandleOffset,
                    'height' : heightOfView
                });
            }
        }
    },



    getColumn : function(columnIndex){
        return this.children[columnIndex];
    },

    getColumns : function(){
        return this.children;
    },

    getItemById : function(id) {
        for(var i=0;i<this.children.length;i++){
            var children = this.children[i].getChildren();
            for(var j=0;j<children.length;j++){
                if(children[j].getId() == id){
                    return children[j];
                }
            }
        }
        return null;
    },

    getIndexOfColumnWithLeastItems : function() {
        var children = this.getChildren();
        var max = 10000;
        var ret = null;
        for(var i=0;i<children.length;i++){
            if(children[i].length < max){
                max = children[i].length;
                ret = i;
            }
        }
        return ret;
    }

});


