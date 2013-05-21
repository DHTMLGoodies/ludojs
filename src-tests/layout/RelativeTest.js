TestCase("RelativeTest", {

	"test should arrange children":function () {
		// given
		var view = this.getView([
			{ name:'a' },
			{ name:'e', layout:{ below:'b' }},
			{ name:'b', layout:{ above:'c', leftOf:'d' }},
			{ name:'c', layout:{ centerHorizontal:true} },
			{ name:'d' }
		]);

		// when
		var children = view.getLayout().getChildren();

		// then
		assertEquals(5, children.length);
		assertEquals('a', children[0].name);
		assertEquals('c', children[1].name);
		assertEquals('d', children[2].name);
		assertEquals('b', children[3].name);
		assertEquals('e', children[4].name);
	},

	"test should arrange correctly when nested dependencies":function () {
		// given

		var view = this.getView([
			{ name:'c', layout:{ leftOf:'b', width:50 }},
			{ name:'b', layout:{ leftOf:'a', width:50 }},
			{ name:'d', layout:{ leftOf:'c', width:50 }},
			{ name:'a', layout:{width:50, alignParentRight:true } }
		]);
		// when
		var children = view.getLayout().getChildren();

		// then
		assertEquals(4, children.length);
		assertEquals('a', children[0].name);
		assertEquals('b', children[1].name);
		assertEquals('c', children[2].name);
		assertEquals('d', children[3].name);

        // d,c,b,a
		assertEquals(1000 , this.asNum(view, 'a', 'left') + this.asNum(view,'a','width'));
		assertEquals(900 , this.asNum(view, 'b', 'left'));
		assertEquals(850 , this.asNum(view, 'c', 'left'));
		assertEquals(800 , this.asNum(view, 'd', 'left'));
	},

    asNum:function(view, name, style){
        return parseInt(view.child[name].getEl().style[style]);
    },

	"test should figure out when a child position is depending on a sibling":function () {
		// given
		var view = this.getView([
			{ name:'a' },
			{ name:'b', layout:{ above:'c', leftOf:'d' }},
			{ name:'c', layout:{ centerHorizontal:true} },
			{ name:'d' }
		]);

		// when
		var lm = view.getLayout();

		// then
		assertEquals(2, lm.getDependencies(view.child['b']).length);
	},

	"test should store all coordinates after a resize":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ alignParentBottom:true, width:250, alignParentRight:true, height:500 } },
			{ name:'b', layout:{ above:'a', width:100, height:100, leftOf:'a' }}
		]);

		// when
		var c = view.getLayout().lastChildCoordinates[view.child['b'].id];

		// then
		assertEquals(1000, view.getLayout().viewport.width);
		assertEquals(1100, view.getLayout().viewport.height);
		assertNotUndefined(c.left);
		assertNotUndefined(c.top);
		assertNotUndefined(c.width);
		assertNotUndefined(c.height);
		assertNotUndefined(c.right);
		assertNotUndefined(c.bottom);

		assertEquals(1000 - 250 - 100, c.left);
		assertEquals(250, c.right);
		assertEquals(1100 - 500 - 100, c.bottom);
	},

	"test should position children PARENT BOTTOM correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ alignParentBottom:true, height:500 } },
			{ name:'b', layout:{ above:'a' }}
		]);

		// when
		var childA = view.child['a'].getEl();

		// then
		assertEquals('600px', childA.style.top);
	},

	"test should position children PARENT TOP correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ alignParentTop:true, height:500 } }
		]);

		// when
		var childA = view.child['a'].getEl();

		// then
		assertEquals('0px', childA.style.top);
	},

	"test should position children PARENT LEFT correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ alignParentLeft:true, height:500 } }
		]);

		// when
		var childA = view.child['a'].getEl();

		// then
		assertEquals('0px', childA.style.left);
	},

	"test should position children PARENT RIGHT correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ alignParentRight:true, height:500 } }
		]);

		// when
		var childA = view.child['a'].getEl();

		// then
		assertEquals('0px', childA.style.right);
	},

	"test should set width and height of child correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500 } }
		]);

		// then
		assertEquals('500px', view.child['a'].getEl().style.height);

	},

	"test should align child RIGHT OF correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:0, alignParentLeft:0, width:300 } },
			{ name:'b', layout:{ width:100, height:100, rightOf:'a' }}
		]);

		// then
		assertEquals('300px', view.child['b'].getEl().style.left);

	},

	"test should align child LEFT OF correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentRight:true, width:300 } },
			{ name:'b', layout:{ width:100, height:100, leftOf:'a' }}
		]);

		// then
		assertEquals('600px', view.child['b'].getEl().style.left);
	},
	"test should align child BELOW correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentRight:true, width:300 } },
			{ name:'b', layout:{ width:100, height:100, below:'a' }}
		]);

		// then
		assertEquals('500px', view.child['b'].getEl().style.top);
	},
	"test should align child ABOVE correctly":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentBottom:true, alignParentRight:true, width:300 } },
			{ name:'b', layout:{ width:100, height:100, above:'a' }}
		]);

		// then
		assertEquals('500px', view.child['b'].getEl().style.top);
	},

	"test should be able to CENTER IN PARENT":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:600, width:400, centerInParent:true } }
		]);

		// when
		var childEl = view.child['a'].getEl();

		// then
		assertEquals('250px', childEl.style.top);
		assertEquals('300px', childEl.style.left);
	},

	"test should be able to CENTER HORIZONTAL IN PARENT":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, width:400, centerHorizontal:true } }
		]);

		// when
		var childEl = view.child['a'].getEl();

		// then
		assertEquals('300px', childEl.style.left);
	},

	"test should be able to CENTER VERTICAL IN PARENT":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:600, width:400, centerVertical:true } }
		]);

		// when
		var childEl = view.child['a'].getEl();

		// then
		assertEquals('250px', childEl.style.top);
	},

	"test should be able to have width set to match_parent":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, width:'matchParent', centerHorizontal:true } }
		]);

		// when
		var childEl = view.child['a'].getEl();

		// then
		assertEquals('1000px', childEl.style.width);
	},

	"test should be able to have percentage size":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, width:'40%', centerHorizontal:true } }
		]);

		// when
		var childEl = view.child['a'].getEl();

		// then
		assertEquals('400px', childEl.style.width);

	},

	"test should be able to have height set to match_parent":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ width:500, height:'matchParent'} }
		]);

		// when
		var childEl = view.child['a'].getEl();

		// then
		assertEquals('1100px', childEl.style.height);

	},

	"test should be able to fill left":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentRight:true, width:300 } },
			{ name:'b', layout:{ height:100, leftOf:'a', fillLeft:true }}
		]);

		// then
		assertEquals('700px', view.child['b'].getEl().style.width);

	},

	"test should be able to fill right":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b', layout:{ height:100, rightOf:'a', fillRight:true }}
		]);

		// then
		assertEquals('600px', view.child['b'].getEl().style.width);
	},

	"test should be able to fill up":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentBottom:true, alignParentLeft:true, width:400 } },
			{ name:'b', layout:{ width:100, above:'a', fillUp:true }}
		]);

		// then
		assertEquals('600px', view.child['b'].getEl().style.height);
	},

	"test should be able to fill down":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:600, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b', layout:{ width:100, below:'a', fillDown:true }}
		]);

		// then
		assertEquals('500px', view.child['b'].getEl().style.height);
	},

	"test should be able to ALIGN LEFT":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentRight:true, width:400 } },
			{ name:'b', layout:{ width:100, below:'a', alignLeft:'a' }}
		]);

		// then
		assertEquals('600px', view.child['b'].getEl().style.left);
	},

	"test should be able to ALIGN RIGHT":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b', layout:{ width:100, below:'a', alignRight:'a' }}
		]);

		// then
		assertEquals('300px', view.child['b'].getEl().style.left);
	},

	"test should be able to ALIGN TOP":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentBottom:true, alignParentLeft:true, width:400 } },
			{ name:'b', layout:{ width:100, below:'a', alignTop:'a' }}
		]);

		// then
		assertEquals('600px', view.child['b'].getEl().style.top);
	},
	"test should be able to ALIGN BOTTOM":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b', layout:{ width:100, height:300, below:'a', alignBottom:'a' }}
		]);

		// then
		assertEquals('200px', view.child['b'].getEl().style.top);
	},

	"test should be able to resize":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400, resize:['right'] } },
			{ name:'b', layout:{ width:100, height:300, below:'a', alignBottom:'a' }}
		]);

		// then
		assertTrue(view.getLayout().isChildResizable(view.child['a']));
		assertEquals(3, view.getLayout().children.length);

		assertEquals('a', view.getLayout().children[0].name);
		assertEquals('b', view.getLayout().children[2].name);
	},

	"test should re-assign references when resizable":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400, resize:['right'] } },
			{ name:'b', layout:{ width:100, height:300, rightOf:'a', alignBottom:'a' }}
		]);

		// when
		var l = view.getLayout();
		var child = l.children[2];

		// then
		assertEquals('b', child.name);
		assertEquals(l.children[1].name, l.children[2].layout.rightOf.name);
	},

	"test should assign correct layout properties to resizer":function () {
		// given
		var view = this.getView([
			{ name:'a', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400, resize:['right'] } },
			{ name:'b', layout:{ width:100, height:300, rightOf:'a', alignBottom:'a' }}
		]);

		// when
		var resizer = view.getLayout().children[1];

		// then
		assertEquals(view.child['a'], resizer.layout.sameHeightAs);
		assertEquals(view.child['a'], resizer.layout.rightOf);

	},

	"test should resize when view is hidden":function () {
		// given
		var view = this.getView([
			{ type:'FramedView', name:'a1', collapsible:'left', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b1', layout:{ width:100, height:300, rightOf:'a1', alignBottom:'a1', fillRight:true }}
		]);

		var a = view.child['a1'];
		var b = view.child['b1'];
		// when
		a.hide();

		// then
		assertEquals(0, a.layout.width);
		assertEquals('0px', b.getEl().style.left);
	},

	"test should update layout when child is shown":function () {
		// given
		var view = this.getView([
			{ type:'FramedView', name:'a1', collapsible:'left', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b1', layout:{ width:100, height:300, rightOf:'a1', alignBottom:'a1', fillRight:true }}
		]);

		var a = view.child['a1'];
		var b = view.child['b1'];
		// when
		a.hide();
		a.show();

		// then
		assertEquals(400, a.layout.width);
		assertEquals('400px', b.getEl().style.left);

	},

	"test should find correct position when a view is initial hidden":function () {
		// given
		var view = this.getView([
			{ type:'FramedView', hidden:true, name:'a1', collapsible:'left', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b1', layout:{ width:100, height:300, rightOf:'a1', alignBottom:'a1', fillRight:true }}
		]);

		var a = view.child['a1'];
		var b = view.child['b1'];
		// when

		// then
		assertEquals(0, a.layout.width);
		assertEquals('0px', b.getEl().style.left);

	},

	"test should render at top when below ref is hidden":function () {
		// given
		var view = this.getView([
			{ type:'FramedView', hidden:true, name:'a1', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b1', layout:{ width:100, height:300, below:'a1' }}
		]);

		// when
		var b1 = view.child['b1'];

		// then
		assertEquals('0px', b1.getEl().style.top);
	},

	"test should render at below when below ref initial hidden is shown":function () {
		// given
		var view = this.getView([
			{ type:'FramedView', hidden:true, name:'a1', layout:{ height:500, alignParentTop:true, alignParentLeft:true, width:400 } },
			{ name:'b1', layout:{ width:100, height:300, below:'a1' }}
		]);

		// when
		var b1 = view.child['b1'];
		view.child['a1'].show();

		// then
		assertEquals('500px', b1.getEl().style.top);
	},

	getView:function (children) {
		var view = new ludo.View({
			layout:'relative',
			width:1000,
			height:1100,
			renderTo:document.body,
			children:children
		});
		view.getBody().style.position = 'relative';
		return view;
	},


	getWindow:function () {
		return new ludo.Window({
			left:20, top:20,
			title:'Relative layout',
			width:600, height:600,
			layout:{
				type:'relative'
			},
			children:[
				{ name:'leftMenu', cls:'customView', html:"<strong>Layout:</strong><br>left menu<br>height:'matchParent', width:150, alignParentLeft:true", layout:{
					height:'matchParent', width:150, alignParentLeft:true
				}},
				{ name:'rightMenu', cls:'customView', html:"Item 1<br>Item 2<br>Item 3<br>Item 4<br>Item 5<br><br><strong>Layout:</strong><br>alignParentTop:true, alignParentRight:true, width:150, above:'bottomMenu', fillUp:true",
					layout:{ alignParentTop:true, alignParentRight:true, width:150, above:'bottomMenu', fillUp:true }},
				{ name:'bottomMenu', cls:'customView', html:"Bottom menu box<br><strong>Layout:</strong> height:50, alignParentBottom:true,rightOf:'leftMenu',fillRight:true", layout:{
					height:50, alignParentBottom:true, rightOf:'leftMenu', fillRight:true
				}},
				{
					name:'c', html:"Main view<br><br><strong>Layout:</strong><br>leftOf:'rightMenu',above:'bottomMenu',rightOf:'leftMenu', fillUp:true", cls:'customView',
					layout:{
						leftOf:'rightMenu', above:'bottomMenu', rightOf:'leftMenu', fillUp:true
					}
				}

			],
			buttonBar:{
				layout:{
					type:'relative'
				},
				children:[
					{ type:'form.Button', id:"okButton", value:'OK', width:100, height:25, name:'ok', layout:{ leftOf:'cancel'} },
					{ type:'form.Button', id:"cancelButton", value:'Cancel', name:'cancel', layout:{ 'alignParentRight':true} }
				]
			}
		});

	}
});