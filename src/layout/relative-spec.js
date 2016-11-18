/*
 Documentation of available options for the Relative layout. The relative layout is a very flexible layout model.
 It offers you the possibility of positioning and sizing children relative to each other and relative to the parent
 View. If also offers the possibility of resizing views as in the linear layout.
 namespace layout
 class RelativeSpec
 @private
 
 param {Object} config
 example
 	new ludo.View({
 		renderTo:document.body,
 		width:1000,height:1000,
 		layout:{
 			type:'relative' // children will be positioned relatively
 		},
 		children:[{
 			name : 'a', html : 'View A', layout: { width: 'matchParent', height:100, alignParentBottom:true }
 		},{
 			name : 'b', html : 'View B', layout: { height:200, above:'a' } // reference to child with name "a"
 		}]

 	});
 */
ludo.layout.RelativeSpec = new Class({
	/*
	Width of child inside a relative layout. The value can be a pixel, percentage value of parent width or
     the one of the keywords "wrap" or "matchParent". "wrap" will render the child with the width required for
     it's content. "matchParent" is equivalent to height:"100%"
	config width
	type {String|Number}
	example
	 	width:200
	 	width:'matchParent'
	 	width:'wrap'
	 	width:'40%'
	 */
	width: undefined,
	/*
	height of child inside a relative layout in pixel value, percent, "wrap" or "matchParent".
     "wrap" will render the view in the height needed for it's content. "matchParent" is equivalent to
     height: "100%".
	config height
	type {String|Number}
	example
	 	height:200
	 	height:'matchParent'
	 	height:'wrap'
	 	height:'40%'
	 */
	height: undefined,

	/*
	Render above this sibling View. Reference can be name, id of a view reference.
	config {String|View} above
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: 'matchParent', height:100, alignParentBottom:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, above:'a' }
		}]
	 */
	above:undefined,
	/*
	Render below this sibling View. Reference to sibling can be done using name, id or a direct reference
     to the View.
	config {String|View} below
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: 'matchParent', height:100, alignParentTop:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, below:'a' }
		}]
	 */
	below:undefined,
	/*
	Render left of this sibling View. Reference can be name, id of a view reference.
	config {String|View} leftOf
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentRight:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, leftOf:'a' }
		}]
	 */
	leftOf:undefined,

	/*
	Render right of this sibling View. Reference can be name, id of a view reference.
    left edge of this view will match right edge of referenced view.
	config {String|View} above
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, rightOf:'a' }
		}]
	 */
	rightOf:undefined,

	/*
	 * Top align inside parent view, i.e. css "top" set to "0px"
	 * config {Boolean} alignParentTop
	 * default undefined
	 */
	alignParentTop:undefined,
	/*
	 * Left align inside parent view, i.e. css "left" set to "0px"
	 * config {Boolean} alignParentLeft
	 * default undefined
	 */
	alignParentLeft:undefined,
	/*
	 * Right align inside parent view, i.e. css "right" set to "0px"
	 * config {Boolean} alignParentRight
	 * default false
	 */
	alignParentRight:false,
	/*
	 * Bottom align inside parent view, i.e. css "bottom" set to "0px"
	 * config {Boolean} alignParentTop
	 * default false
	 */
	alignParentBottom:false,

	/*
	 * Center horizontally and vertically inside parent view
	 * config {Boolean} centerInParent
	 * default false
	 */
	centerInParent:false,
	/*
	 Center horizontally  inside parent view
	 config {Boolean} centerHorizontal
	 default false
     example
         new ludo.Window({
            left:600, top:100, height:300, width:300,
            title:'Sign In',
            layout:{
                type:'relative'
            },
            css:{
                'background-color':'#FFF'
            },
            children:[
                {
                    layout:{
                        type:'linear',
                        orientation:'vertical',
                        centerInParent:true,
                        width:200,
                        height:130
                    },
                    css:{
                        border:'1px solid #C0C0C0',
                        'background-color':'#f5f5f5',
                        padding:3
                    },
                    children:[
                        {
                            height:25, html:'Box centered in parent'
                        },
                        {
                            type:'form.Text', label:'Username', name:'username'
                        },
                        {
                            type:'form.Password', label:'Password', name:'password'
                        },
                        {
                            type:'form.Button', value:'Sign In'
                        }
                    ]

                }
            ]
        });
	 */
	centerHorizontal:false,

	/*
	 * Center vertically  inside parent view
	 * config {Boolean} centerVertical
	 * default false
	 */
	centerVertical:false,
	/*
	 Fill left inside parent view.
	 config {Boolean} fillLeft
	 default false
	 example
	 	layout:{
	 		leftOf:'a',
	 		sameHeightAs:'a',
	 		fillLeft:true
	 	}
	 will render the child left of sibling "a" and it will fill up all remaining
	 */
	fillLeft:false,
	/*
	 Fill upwards inside parent view (i.e. "top" attribute set to 0).
	 config {Boolean} fillUp
	 default false
	 example
	 	layout:{
	 		above:'nameOfOtherView',
	 		fillUp:true
	 	}
	 will set bottom edge of view to top edge of "nameOfOtherView" and set height to parent height - bottom edge.
	 */
	fillUp:false,
	/*
	 Fill right inside parent view.
	 config {Boolean} fillRight
	 default false
	 example
	 	layout:{
	 		rightOf:'nameOfOtherView',
	 		fillRight:true
	 	}
	 will set left edge of view to right edge of "nameOfOtherView" and set width to parent width - left edge.
	 */
	fillRight:undefined,
	/*
	 Fill down inside parent view.
	 config {Boolean} fillDown
	 default false
	 example
	 	layout:{
	 		below:'nameOfOtherView',
	 		fillDown:true
	 	}
	 will set top edge of view to bottom edge of "nameOfOtherView" and set height to parent height - top edge.
	 */
	fillDown:undefined,

	/*
	Align left edge of this View with left edge of references View.
	config {String|View} alignLeft
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentRight:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:150, alignLeft:'a', below:'a' }
		}]
	 will set left edge of "b" to left edge of "a"
	 */
	alignLeft:undefined,
	/*
	Align right edge of this View with right edge of references View.
	config {String|View} alignRight
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:100, alignParentTop:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:100, alignRight:'a', below:'a' }
		}]
	 will set right edge of "b" to right edge of "a"
	 */
	alignRight:undefined,
	/*
	Align top edge of this View with top edge of references View.
	config {String|View} alignTop
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:300, alignParentBottom:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:100, alignTop:'a', rightOf:'a' }
		}]
	 will set top edge of "b" to top edge of "a"
	 */
	alignTop:undefined,
	/*
	Align bottom edge of this View with bottom edge of references View.
	config {String|View} alignBottom
	example
	 	children:[{
			name : 'a', html : 'View A', layout: { width: '200', height:300, alignParentTop:true, alignParentLeft:true }
		},{
			name : 'b', html : 'View B', layout: { height:200, width:100, alignBottom:'a', rightOf:'a' }
		}]
	 will set bottom edge of "b" to bottom edge of "a"
	 */
	alignBottom:undefined,

	/*
	 If the child has it's own children, the type attribute specifies the layout model for these children.
	 config type
	 type {String}
     example
        children:[{
            name:'a', layout:{ type:'menu', orientation:'vertical' }
        }]
	 */
	type:undefined,

	/*
	 Add resize handles for resize in these directions, possible values: 'up','down','left','right'.
	 config resize
	 type {String|Array}
	 example
	 	layout:{
			 height:200,
			 width:150,
			 alignParentLeft:true,
			 resize:['below','right'],
			 maxHeight:300
		 }
	 */
	resize:undefined,

    /*
     Render with the same height as this sibling
     config {String|View} sameHeightAs
     example
     children:[{
			name : 'a', html : 'View A', layout: { width: 200, alignParentRight:true, alignParentBottom:true }
		},{
			name : 'b', html : 'View B', layout: { leftOf:'a', sameHeightAs:'a', fillLeft:true }
		}]
     will render "b" left of "a". It will use all space to the left edge and the height will be the same as for "a"
     */
    sameHeightAs:undefined,

    /*
     Render with the same width as this sibling
     config {String|View} sameWidthAs
     example
        children:[{
			name : 'a', html : 'View A', layout: { width: 200, alignParentRight:true, alignParentTop:true }
		},{
			name : 'b', html : 'View B', layout: { below:'a', sameWidthAs:'a', fillDown:true }
		}]
     will render "b" left of "a". It will use all space to the left edge and the height will be the same as for "a"
     */
    sameWidthAs:undefined,

    /*
     Render at this x position inside parent
     config {Number} left
     default undefined,
     example
        children:[
            {
                name : 'a', layout:{ width:200,height:20, left:20, top : 20 }
            }

        ]
     */

    left:undefined,

    /*
     Render at this y position inside parent
     config {Number} top
     default undefined,
     example
        children:[
            {
                name : 'a', layout:{ width:200,height:20, left:20, top : 20 }
            }

        ]
     */
    top:undefined,

    /*
     Offset left position with this number of pixels.
     config {Number} offsetX
     default undefined,
     example
         children:[
             {
                 name : 'a', layout:{ alignParentLeft:true, width:200, height:200, top: 0 }
             },{
                 name : 'b', layout: { rightOf:'a', alignParentTop:true, offsetX:20, height:200,width:200 }
             }
         ]
     will render child "b" 20 pixels to the right of child "a"
     */
    offsetX:undefined,

    /*
     Offset top position with this number of pixels.
     config {Number} offsetY
     default undefined,
     example
         children:[
             {
                 name : 'a', layout:{ alignParentLeft:true, width:200, height:200, top: 0 }
             },{
                 name : 'b', layout: { below:'a', alignParentLeft:true, offsetY:20, height:200,width:200 }
             }
         ]
     will render child "b" 20 pixels below child "a"
     */
    offsetY:undefined
});