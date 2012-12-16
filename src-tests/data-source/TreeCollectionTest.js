TestCase("TreeCollection", {



	"test should be able to get children":function () {
		// given
		var c = this.getCollection();
		// when
		var children = c.getChildren(1);

		//then
		assertEquals(5, children.length);
	},

	"test should be able to get a child by id": function(){
		// given
		var c = this.getCollection();

		// when
		var child = c.getById(11);

		// then
		assertEquals('Kobe', child.city);
	},

	"test should be able to add children":function () {
		// given
		var c = this.getCollection();

		// when
		c.getRecord(1).addChild({ city:'Osaka', 'id' : 1000});

		// then
		assertEquals(6, c.getChildren(1).length);
	},

	"test should be able to get parent record": function(){
		// given
		var c = this.getCollection();

		// when
		var record = c.getRecord(11);
		var parent = record.getParent();

		// then
		assertEquals(1, parent.record.id);
		assertEquals('Japan', parent.record.country);
	},

	"test should be able to move child from one parent to another": function(){
		// given
		var c = this.getCollection();
		var rec = c.getRecord(11);
		c.getRecord(2).addChild(rec);

		// then
		assertEquals(4, c.getRecord(1).getChildren().length);
		assertEquals(2, c.getRecord(2).getChildren().length);
		assertEquals(12, c.getRecord(1).getChildren()[0].id);
		assertEquals(11, c.getRecord(2).getChildren()[1].id);
	},

	"test should be able to insert a child before another": function(){
		// given
		var c = this.getCollection();

		// when
		var parent = c.getRecord(1);
		var kobe = c.getRecord(11);
		var kyoto = c.getRecord(12);

		parent.insertBefore(kyoto, kobe);

		var children = parent.getChildren();

		// then
		assertEquals(5, children.length);
		assertEquals('Kyoto', children[0].city);
		assertEquals('Kobe', children[1].city);
	},

	"test should be able to insert a child after another": function(){
		// given
		var c = this.getCollection();

		// when
		var parent = c.getRecord(1);
		var sapporo = c.getRecord(13);
		var kawasaki = c.getRecord(15);

		parent.insertAfter(sapporo, kawasaki);

		var children = parent.getChildren();

		// then
		assertEquals(5, children.length);
		assertEquals('Kawasaki', children[3].city);
		assertEquals('Sapporo', children[4].city);
	},

	"test should be able to inject child from a parent after a sibling of other parent": function(){
		// given
		var c = this.getCollection();

		// when
		var parent = c.getRecord(2);
		var sapporo = c.getRecord(13);
		var seoul = c.getRecord(21);

		parent.insertAfter(sapporo,seoul);

		// then
		assertEquals(4, c.getRecord(1).getChildren().length);
		assertEquals(2, c.getRecord(2).getChildren().length);
	},

	"test should be able to get child record by uid": function(){
		// given
		var c = this.getCollection();

		// when
		var sapporo = c.getRecord(13);
		var uid = sapporo.record.uid;

		assertNotUndefined(uid);
		assertNotUndefined(c.index[uid]);

		assertEquals(sapporo, c.getRecord(uid));
	},

	"test should be able to delete record": function(){
		// given
		var c = this.getCollection();
		var parent = c.getRecord(1);
		assertEquals(5, parent.getChildren().length);
		// when
		var sapporo = c.getRecord(13);
		sapporo.dispose();

		// then
		assertEquals(4, parent.getChildren().length);

	},

	getCollection:function (config) {
		if (ludo.MyDataSource3 === undefined) {
			var d = this.getData();
			ludo.MyDataSource3 = new Class({
				Extends:ludo.dataSource.TreeCollection,
				autoload:true,
				load:function () {
					this.loadComplete(Object.clone(d));
				}
			});
		}
		config = config || {};
		return new ludo.MyDataSource3(config);
	},
	getData:function () {
		return {"data":[
			{ id:1, "country":"Japan", "capital":"Tokyo", "population":"13,185,502", children:[
				{ id:11, city:'Kobe' },
				{ id:12, city:'Kyoto' },
				{ id:13, city: 'Sapporo'},
				{ id:14, city: 'Sendai'},
				{ id:15, city: 'Kawasaki'}
			]},
			{id:2, "country":"South Korea", "capital":"Seoul", "population":"10,464,051",children:[
				{ id:21, city: 'Seoul' }

			]},
			{id:3, "country":"Russia", "capital":"Moscow", "population":"10,126,424"},
			{id:'no', "country":"Norway", "capital":"Oslo", "population":"A few"}
		]};
	}
});