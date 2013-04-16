/**
 Documentation of available options for the Relative layout.
 @namespace layout
 @class RelativeSpec
 @constructor
 @param {Object} config
 @example
 	new ludo.View({
 		renderTo:document.body,
 		width:1000,height:1000,
 		layout:{
 			type:'relative'
 		},
 		children:[{
 			name : 'a', html : 'View A', layout: { width: 'matchParent', height:100, alignParentBottom:true }
 		},{
 			name : 'b', html : 'View B', layout: { height:200, above:'a' }
 		}]

 	});
 */
ludo.layout.RelativeSpec = new Class({
	/**
	Width of child inside a relative layout
	@config width
	@type {String|Number}
	@example
	 	width:200
	 	width:'matchParent'
	 	width:'wrap'
	 	width:'40%'
	 */
	width: undefined,
	/**
	height of child inside a relative layout
	@config height
	@type {String|Number}
	@example
	 	height:200
	 	height:'matchParent'
	 	height:'wrap'
	 	height:'40%'
	 */
	height: undefined,

	/**
	Render above this sibling View. Reference can be name, id of a view reference.
	@config {String|View} above
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: 'matchParent', height:100, alignParentBottom:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, above:'a' }
		}]
	 */
	above:undefined,
	/**
	Render below this sibling View. Reference can be name, id of a view reference.
	@config {String|View} below
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: 'matchParent', height:100, alignParentTop:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, below:'a' }
		}]
	 */
	below:undefined,
	/**
	Render left of this sibling View. Reference can be name, id of a view reference.
	@config {String|View} leftOf
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentRight:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, leftOf:'a' }
		}]
	 */
	leftOf:undefined,

	/**
	Render right of this sibling View. Reference can be name, id of a view reference.
    left edge of this view will match right edge of referenced view.
	@config {String|View} above
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, rightOf:'a' }
		}]
	 */
	rightOf:undefined,

	/**
	 * Top align inside parent view, i.e. css "top" set to "0px"
	 * @config {Boolean} alignParentTop
	 * @default undefined
	 */
	alignParentTop:undefined,
	/**
	 * Left align inside parent view, i.e. css "left" set to "0px"
	 * @config {Boolean} alignParentLeft
	 * @default undefined
	 */
	alignParentLeft:undefined,
	/**
	 * Right align inside parent view, i.e. css "right" set to "0px"
	 * @config {Boolean} alignParentRight
	 * @default false
	 */
	alignParentRight:false,
	/**
	 * Bottom align inside parent view, i.e. css "bottom" set to "0px"
	 * @config {Boolean} alignParentTop
	 * @default false
	 */
	alignParentBottom:false,

	/**
	 * Center horizontally and vertically inside parent view
	 * @config {Boolean} centerInParent
	 * @default false
	 */
	centerInParent:false,
	/**
	 * Center horizontally  inside parent view
	 * @config {Boolean} centerHorizontal
	 * @default false
	 */
	centerHorizontal:false,

	/**
	 * Center vertically  inside parent view
	 * @config {Boolean} centerVertical
	 * @default false
	 */
	centerVertical:false,
	/**
	 Fill left inside parent view.
	 @config {Boolean} fillLeft
	 @default false
	 @example
	 	layout:{
	 		right:300,
	 		fillLeft:true
	 	}
	 will position view at right:300 and set width to parent width - 300.
	 */
	fillLeft:false,
	/**
	 Fill upwards inside parent view (i.e. "top" attribute set to 0).
	 @config {Boolean} fillUp
	 @default false
	 @example
	 	layout:{
	 		above:'nameOfOtherView',
	 		fillUp:true
	 	}
	 will set bottom edge of view to top edge of "nameOfOtherView" and set height to parent height - bottom edge.
	 */
	fillUp:false,
	/**
	 Fill right inside parent view.
	 @config {Boolean} fillRight
	 @default false
	 @example
	 	layout:{
	 		rightOf:'nameOfOtherView',
	 		fillRight:true
	 	}
	 will set left edge of view to right edge of "nameOfOtherView" and set width to parent width - left edge.
	 */
	fillRight:undefined,
	/**
	 Fill down inside parent view.
	 @config {Boolean} fillDown
	 @default false
	 @example
	 	layout:{
	 		below:'nameOfOtherView',
	 		fillDown:true
	 	}
	 will set top edge of view to bottom edge of "nameOfOtherView" and set height to parent height - top edge.
	 */
	fillDown:undefined,

	/**
	Align left edge of this View with left edge of references View.
	@config {String|View} alignLeft
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentRight:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:150, alignLeft:'a', below:'a' }
		}]
	 will set left edge of "b" to left edge of "a"
	 */
	alignLeft:undefined,
	/**
	Align right edge of this View with right edge of references View.
	@config {String|View} alignRight
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:100, alignRight:'a', below:'a' }
		}]
	 will set right edge of "b" to right edge of "a"
	 */
	alignRight:undefined,
	/**
	Align top edge of this View with top edge of references View.
	@config {String|View} alignTop
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:300, alignParentBottom:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:100, alignTop:'a', rightOf:'a' }
		}]
	 will set top edge of "b" to top edge of "a"
	 */
	alignTop:undefined,
	/**
	Align bottom edge of this View with bottom edge of references View.
	@config {String|View} alignBottom
	@example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:300, alignParentTop:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:100, alignBottom:'a', rightOf:'a' }
		}]
	 will set bottom edge of "b" to bottom edge of "a"
	 */
	alignBottom:undefined,

	/**
	 * Layout type for child views
	 * @config type
	 * @type {String}
	 */
	type:undefined,

	/**
	  Add resize handles for resize in these directions, possible values: 'up','down','left','right'.
	  @config resize
	  @type {String|Array}
	 @example
	 	layout:{
			 height:200,
			 width:150,
			 alignParentLeft:true,
			 resize:['below','right'],
			 maxHeight:300
		 }
	 */
	resize:undefined

});