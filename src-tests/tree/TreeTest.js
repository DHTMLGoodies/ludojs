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
        assertNotUndefined(newRec);
        assertEquals('Stavanger', newRec.record.city);
        assertEquals(record.record.uid, newRec.record.parentUid);

        var node = tree.getDomByRecord(newRec);
        assertEquals('div', document.getElementById(newRec.record.uid).tagName.toLowerCase());
        assertEquals('div', node.tagName.toLowerCase());
    },

    getTree:function () {
        return new ludo.tree.Tree({
            dataSource:this.getCollection(),
            renderTo:document.body
        });
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
                { id:12, city:'Kyoto' },
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