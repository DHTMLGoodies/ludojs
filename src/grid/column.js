ludo.grid.Column = new Class({
	/**
	 * Heading to diplay
	 * config {String} heading
 	 */
	heading : '',

	/**
	 * True to make column removable
	 * config {Boolean} removable
	 * default false
 	 */
	removable : false,
	/**
	 * True to make column movable
	 * config {Boolean} movable
	 * default false
 	 */
	movable : false,

	/**
	 * Initial width of column
	 * config {Number} width
	 */
	width:undefined,

	/**
	 * True to make column sortable
	 * config {Boolean} sortable
	 * default false
 	 */
	sortable : false,

	/**
	 * Minimium width of column
	 * config {Number} minWidth
	 * default 50
	 */
	minWidth:50,

	/**
	 * Maximum width of column
	 * config {Number} maxWidth
	 * default 500
	 */
	maxWidth:500,

	/**
	 * True to make column initial hidden
	 * config {Boolean} hidden
	 * default false
	 */
	hidden:false,

	/**
	 * True to make column resizable
	 * config {Boolean} resizable
	 * default true
	 */
	resizable:true,


	/**
	 * Alignment of text(left|right)
	 * config {String} align
	 * default 'left'
	 */
	align:'left',

	/**
	 * Alignment of header
	 * config {String} headerAlign
	 * default 'left'
	 */
	headerAlign:'left',

	/**
	 Custom renderer for text in column. This is a function. Two parameters
	 are sent to this function. The first one is the record value of this cell,
	 the second one is the record it's self. The function should return a string which
	 will be the value rendered in the cells of this column.
	 config {Function} renderer
	 default undefined
	 example
	 	renderer:function(value){
	 		if(value >= 0){
				return '<span style="color:blue">' + val + '</span>';
			}else{
				return '<span style="color:red">' + val + '</span>';
			}
	 	}
	 */
	renderer:undefined,


	/**
	 * Attribute used for grouping
	 * config {Array} columns
	 * default undefined
	 */
	columns:undefined
});