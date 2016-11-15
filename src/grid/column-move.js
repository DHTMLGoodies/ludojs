/**
 * Class responsible for moving columns using drag and drop.
 * An instance of this class is automatically created by the grid. It is
 * rarely nescessary to create your own instances of this class
 */
ludo.grid.ColumnMove = new Class({
	Extends:ludo.effect.DragDrop,
	gridHeader:undefined,
	columnManager:undefined,

	shimCls:['ludo-grid-movable-shim'],
	insertionMarker:undefined,

	arrowHeight:undefined,

	__construct:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['gridHeader','columnManager']);
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('createShim', this.setZIndex.bind(this));
	},

	setZIndex:function(shim){
		$(shim).css('zIndex', 50000);
	},

	getMarker:function () {
		if (this.insertionMarker === undefined) {
            this.insertionMarker = ludo.dom.create({
                cls : 'ludo-grid-movable-insertion-marker',
                css : { display: 'none' },
                renderTo : document.body
            });
            ludo.dom.create({ cls : 'ludo-grid-movable-insertion-marker-bottom', renderTo : this.insertionMarker});
		}
		return this.insertionMarker;
	},

	hideMarker:function(){
		this.getMarker().css('display', 'none');
	},

	showMarkerAt:function(cell, pos){
		var coordinates = cell.offset();
		coordinates.width= cell.outerWidth();
		coordinates.height = cell.outerHeight();

		this.getMarker().css({
			display:'',
			left: (coordinates.left + (pos=='after' ? coordinates.width : 0)),
			top: (coordinates.top - this.getArrowHeight()),
			height: coordinates.height

		});
	},

	setMarkerHeight:function(height){
		this.getMarker().css('height', (height + (this.getArrowHeight() * 2)));
	},

	getArrowHeight:function(){
		if(!this.arrowHeight){
			this.arrowHeight = this.getMarker().find('.ludo-grid-movable-insertion-marker-bottom').first().outerHeight();
		}
		return this.arrowHeight;
	}
});