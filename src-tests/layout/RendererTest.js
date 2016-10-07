TestCase("Renderer", {

	setUp:function(){
		document.body.style.margin = 0;
		document.body.style.padding = 0;
		document.documentElement.style.margin = 0;
		document.documentElement.style.padding = 0;
	},

	"test should be able to define renderer for a view":function () {
		// given
		var v = new ludo.View({
			layout:{
				width:'matchParent',
				height:'matchParent'
			}
		});

		// then
		assertNotUndefined(v.getLayout().renderer);
		assertEquals(v, v.getLayout().renderer.view);
	},

	"test should set default layout properties when not set":function () {
		var v = new ludo.View({
			renderTo:document.body
		});
		// when
		var renderer = v.getLayout().getRenderer();

		// then
		assertEquals('matchParent', renderer.view.layout.width);

	},

	"test should preserve left and top attributes":function () {
		var w = new ludo.Window({
			title:'Tree demo - Random countries and cities',
			layout:{
				type:'rows',
				width:500, height:370,
				left:250, top:50
			}
		});

		// then
		assertEquals(250, w.layout.left);
		assertEquals(50, w.layout.top);
	},

	"test should be able to specify leftOrRightOf":function () {
		// given
		new ludo.View({
			renderTo:document.body,
			layout:{
				type:'relative'
			},
			children:[
				{
					html:'View a',
					id:'a',
					layout:{
						alignParentLeft:true,
						width:300
					},
					containerCss:{
						margin:0,padding:0,border:0
					}
				}
			]
		});

		var v2 = new ludo.View({
			renderTo:document.body,
			layout:{
				leftOrRightOf:ludo.get('a')
			}
		});

		// then
		assertEquals('300px', v2.getEl().css('left'));

	},

	"test should be able to fit inside viewport": function(){


	},

	"test should be able to set viewport":function () {
		// given
		var v = this.getViewInParent();
		// then
		assertEquals(500, v.getLayout().renderer.viewport.width);
		assertEquals(600, v.getLayout().renderer.viewport.height);
	},

	"test should be able to match parent size":function () {
		// given
		var el = document.createElement('div');
		el.style.width = '500px';
		el.style.height = '600px';
		document.body.appendChild(el);

		// when
		var v = new ludo.View({
			layout:{
				width:'matchParent',
				height:'matchParent'
			},
			renderTo:el
		});

		assertNotUndefined(v.getEl().parent());
		assertNotUndefined(v.getEl().parent().prop("tagName"));

		// then
		assertEquals('500', v.getLayout().renderer.coordinates.width);
		assertEquals('600', v.getLayout().renderer.coordinates.height);
		assertEquals(500, v.getEl().width());
		assertEquals(600, v.getEl().height());

	},

	"test should be able to center":function () {
		var el = document.createElement('div');
		el.style.width = '500px';
		el.style.top = '0';
		el.style.left = '0';
		el.style.position = 'absolute';
		el.style.height = '600px';
		document.body.appendChild(el);

		var v = new ludo.View({
			renderTo:document.body,
			layout:{
				width:200,
				height:100,
				centerIn:el
			}
		});

		// then
		assertEquals(250, v.getEl().offset().top);
		assertEquals(150, v.getEl().offset().left);
	},

	getViewInParent:function () {
		var el = document.createElement('div');
		el.style.width = '500px';
		el.style.height = '600px';
		$(document.body).append(el);

		// when
		return new ludo.View({
			layout:{
				width:'matchParent',
				height:'matchParent'
			},
			renderTo:el
		});
	}

});