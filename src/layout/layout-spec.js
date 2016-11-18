/*
 Documentation of available layout options for Views without parent view.
 When a view is rendered directly on an HTML page without being child of another view,
 you can use these options to configure position and size. If not specified, defaults
 will be set to height:"matchParent",width:"matchParent".
 namespace layout
 class LayoutSpec
 
 param {Object} config
 example
 	new ludo.View({
 		renderTo:document.body,
 		layout:{
 			above:'idOfOtherView',
 			sameWidthAs:'idOfOtherView',
 			height:100
 		}

 	});
 */
ludo.layout.LayoutSpec = new Class({
	/*
	 Width of view in number(pixels), percent, "matchParent" or "wrap"
	 config width
	 type {String|Number}
	 default "matchParent"
	 example
		 width:200
		 width:'matchParent', // Same width as parent
		 width:'wrap', // wrap children
		 width:'40%'
	 */
	width:undefined,
	/*
	 Height of view in number(pixels), percent, "matchParent" or "wrap"
	 config width
	 type {String|Number}
	 example
		 height:200
		 height:'matchParent' // Same height as parent
		 height:'wrap', // wrap children
		 height:'40%'
	 */
	height:undefined,

	/*
	 Align left edge of this view with right edge of referenced view or DOM element
	 config rightOf
	 type {String|View|HTMLElement}
	 default undefined
	 example
	 	rightOf:'idOfDiv' // id of <div> tag
	 	rightOf:myView // Reference to view
	 	rightOf:'myView' // id of View

	 */
	rightOf:undefined,

	/*
	 Align right edge of this view with left edge of referenced view or DOM element
	 config leftOf
	 type {String|View|HTMLElement}
	 default undefined
	 */
	leftOf:undefined,


	/*
	 Align bottom edge of this view with top edge of referenced view or DOM element.
	 Reference can be Javascript reference to a view, id of view, "parent" for parent view, Javascript reference
	 to DOM node or id of DOM node.
	 config above
	 type {String|View|HTMLElement}
	 default undefined
	 */
	above:undefined,
	/*
	 Align top edge of this view with bottom edge of referenced view or DOM element.
	 config below
	 type {String|View|HTMLElement}
	 default undefined
	 */
	below:undefined,
	/*
	 Align left edge of this view with left edge of referenced view or DOM element
	 config alignLeft
	 type {String|View|HTMLElement}
	 default undefined
	 */
	alignLeft:undefined,
	/*
	 Align top edge of this view with top edge of referenced view or DOM element
	 config alignTop
	 type {String|View|HTMLElement}
	 default undefined
	 */
	alignTop:undefined,
	/*
	 Align right edge of this view with right edge of referenced view or DOM element
	 config alignRight
	 type {String|View|HTMLElement}
	 default undefined
	 */
	alignRight:undefined,
	/*
	 Align bottom edge of this view with bottom edge of referenced view or DOM element
	 config alignBottom
	 type {String|View|HTMLElement}
	 default undefined
	 */
	alignBottom:undefined,
	/*
	 Set same height of this view as height of referenced view or DOM element
	 config sameHeightAs
	 type {String|View|HTMLElement}
	 default undefined
	 */
	sameHeightAs:undefined,
	/*
	 Set same width of this view as width of referenced view or DOM element
	 config sameWidthAs
	 type {String|View|HTMLElement}
	 default undefined
	 */
	sameWidthAs:undefined,
	/*
	 When other alignments has been made, offset x coordinate with this value.
	 config offsetX
	 type {Number}
	 default undefined
	 */
	offsetX:undefined,
	/*
	 When other alignments has been made, offset y coordinate with this value.
	 config offsetY
	 type {Number}
	 default undefined
	 */
	offsetY:undefined,
	/*
	 Increase width with this number of pixels
	 config offsetWidth
	 type {Number}
	 default undefined
	 */
	offsetWidth:undefined,
	/*
	 Increase height with this number of pixels
	 config offsetWidth
	 type {Number}
	 default undefined
	 */
	offsetHeight:undefined,


	/*
	 Set left position of view to this exact value
	 config left
	 type {Number}
	 default undefined
	 */
	left:undefined,
	/*
	 Set top position of view to this exact value
	 config top
	 type {Number}
	 default undefined
	 */
	top:undefined,
	/*
	 Center vertically and horizontally inside this DOM element or View
	 config centerIn
	 type {String|View|HTMLElement}
	 default undefined
	 */
	centerIn:undefined,
	/*
	 Center vertically inside this DOM element or View
	 config centerVerticalIn
	 type {String|View|HTMLElement}
	 default undefined
	 */
	centerVerticalIn:undefined,
	/*
	 Center horizontally inside this DOM element or View
	 config centerHorizontalIn
	 type {String|View|HTMLElement}
	 default undefined
	 */
	centerHorizontalIn:undefined
});