TestCase("TreeTest", {

    "test should be able to get DOM by record":function () {
        // given
        var tree = this.getTree();

        // when
        var record = tree.getDataSource().getRecord(1);
        var domNode = tree.getDomByRecord(record);

        // then
        assertEquals(domNode.id, record.record.uid);
    },

    "test should be able to get Record by DOM":function () {
        // given
        var tree = this.getTree();

        // when
        var expectedRecord = tree.getDataSource().getRecord(1);
        var domNode = tree.getDomByRecord(expectedRecord);
        var node = domNode.getElementsByTagName('div')[0];
        var record = tree.getRecordByDOM(node);

        // then
        assertEquals(expectedRecord, record);
    },

    "test should be able to lazy render child nodes": function(){
        // given
        var tree = this.getTree();

        // when
        var child = tree.getDataSource().getRecord(11);

        // then
        assertFalse(tree.areChildrenRendered(tree.getDataSource().getRecord(1)));
        assertFalse(tree.isRecordRendered(child));
    },

    "test should be able show unrendered records": function(){
        // given
        var tree = this.getTree();

        // when
        var child = tree.getDataSource().getRecord(11);
        tree.showRecord(child);

        // then
        assertTrue(tree.isRecordRendered(child));
    },

    "test should render record when selected in data source": function(){
        // given
        var tree = this.getTree();
        var record = tree.getDataSource().getRecord(121);
        // when
        record.select();

        // then
        assertTrue(tree.isRecordRendered(record));

    },

    "test should be able to show unrendered records deep down in the tree": function(){
        // given
        var tree = this.getTree();

        // when
        var child = tree.getDataSource().getRecord(121);
        tree.showRecord(child);

        // then
        assertTrue(tree.isRecordRendered(child));

    },

    "test should be able to expand ": function(){
        // given
        var tree = this.getTree();

        // when
        var child = tree.getDataSource().getRecord(11);
        assertFalse(tree.isRecordRendered(child));
        tree.expand(tree.getDataSource().getRecord(1));
        // then
        assertTrue(tree.isRecordRendered(child));

    },

    "test should be able to add new nodes":function () {
        // given
        var tree = this.getTree();
        var ds = tree.getDataSource();
        var record = ds.getRecord('no');

        // when
        record.addChild({
            id:'svg',
            city:'Stavanger'
        });

        // then
        assertEquals(1, record.getChildren().length);
        var newRec = ds.getRecord('svg');
        assertEquals('Stavanger', newRec.record.city);
        assertEquals(record.record.uid, newRec.record.parentUid);

        var node = tree.getDomByRecord(newRec);
        assertEquals('div', document.getElementById(newRec.record.uid).tagName.toLowerCase());
        assertEquals('div', node.tagName.toLowerCase());
    },

	"test should create data source automatically when not given in config": function(){
		// given
		var tree = new ludo.tree.Tree();

		// then
		assertNotUndefined(tree.dataSource);
		assertEquals('dataSource.TreeCollection', tree.getDataSource().type);

	},

	"test should be able to add nodes on top level": function(){
		// given
		var tree = new ludo.tree.Tree();

		// when
		tree.getDataSource().addRecord({
			id:'myId',
			title : 'My title'
		});
		var newRec = tree.getDataSource().getRecord('myId');

		// then
		assertNotUndefined(tree.getDomByRecord(newRec));
		assertNotNull(tree.getDomByRecord(newRec));
	},

	"test should be able to find lazy added nodes": function(){
		var tree = new ludo.tree.Tree();
		var rec = tree.getDataSource().addRecord({
			id:'myId',
			title : 'My title'
		});

		rec.addChild({
			id : 'subId',
			title : 'Sub item'
		});

		// when
		rec = tree.getDataSource().getRecord('subId');



		// then
		assertNotUndefined(tree.getDataSource().index['subId']);
		assertNotUndefined(rec);
	},

	"test should be able to find lazy added grand child nodes": function(){
		var tree = new ludo.tree.Tree();
		var rec = tree.getDataSource().addRecord({
			id:'myId',
			title : 'My title'
		});

		rec.addChild({
			id : 'subId',
			title : 'Sub item'
		});

		var p = tree.getDataSource().getRecord('subId');
		p.addChild({
			id : 'grandChild',
			title : 'Grand child'
		});

		// when
		rec = tree.getDataSource().getRecord('grandChild');



		// then
		assertNotUndefined(tree.getDataSource().index['grandChild']);
		assertNotUndefined(rec);
		assertNotUndefined(tree.getDomByRecord(rec));

		assertEquals('div', tree.getDomByRecord(rec).tagName.toLowerCase());


	},

	"test should show expand icon when adding first child node": function(){
		// given
		var tree = new ludo.tree.Tree();
		var rec = tree.getDataSource().addRecord({
			id:'myId',
			title : 'My title'
		});

		rec.addChild({
			id : 'subId',
			title : 'Sub item'
		});

		// when
		var expand = tree.getExpandEl(rec);

		// then
		assertNotUndefined(expand);
		assertEquals('', expand.style.display);

	},

	"test should be able to define tpl for nodes": function(){
		// given
		var tree = this.getTree({


		});
	},

    getTree:function (config) {
		config = config || {};
		config.dataSource = this.getCollection();
		config.renderTo = document.body;
        return new ludo.tree.Tree(config);
    },

    getCollection:function (config) {
        if (ludo.MyDataSource3 === undefined) {
            var d = this.getData();
            ludo.MyDataSource3 = new Class({
                Extends:ludo.dataSource.TreeCollection,
                autoload:true,
                load:function () {
                    var data = Object.clone(d);
                    this.loadComplete(data.data, data);
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
                { id:12, city:'Kyoto', children:[
                    { id:121, city: 'sub node' },
                    { id:122, city: 'sub node' }
                ] },
                { id:13, city:'Sapporo'},
                { id:14, city:'Sendai'},
                { id:15, city:'Kawasaki'}
            ]},
            {id:2, "country":"South Korea", "capital":"Seoul", "population":"10,464,051", children:[
                { id:21, city:'Seoul' }

            ]},
            {id:3, "country":"Russia", "capital":"Moscow", "population":"10,126,424"},
            {id:'no', "country":"Norway", "capital":"Oslo", "population":"A few"}
        ]};
    }
});