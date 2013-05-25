TestCase("ChartTest", {

    setUp:function(){
        if(!ludo.chart.CustomAddOn){
            ludo.chart.CustomAddOn = new Class({
                Extends: ludo.chart.AddOn,
                type : 'chart.CustomAddOn'

            });
        }
    },

    "test should always create data provider": function(){
        // given
        var c = new ludo.chart.Chart({
            data : [{ label : '1', value: '1'}]
        });

        // then
        assertNotUndefined(c.dataProvider);
        assertEquals('chart.DataProvider', c.dataProvider.type);
    },

    "test should create chart fragment for each record": function(){
        // given
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ],
            children:[{
                type : 'chart.Base'
            }]
        });

        // then
        assertTrue(c.dataProvider.hasRecords());
        c.children[0].create();
        assertNotUndefined(c.children[0].getFragments());
        assertEquals(2, c.children[0].getFragments().length);
    },

    "test every chart fragment should be assigned to a record": function(){
        // given
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ],
            children:[{
                type : 'chart.Base'
            }]
        });

        c.children[0].create();

        // when
        var fragments = c.children[0].getFragments();

        // then
        assertEquals(c.getDataProvider().getRecords()[0], fragments[0].record);
        assertEquals(c.getDataProvider().getRecords()[1], fragments[1].record);
    },

    "test should get reference to parent component": function(){
        // given
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ],
            children:[{
                type:'chart.Base'
            }]
        });

        // when
        var f = c.children[0];

        // then
        assertEquals(c, f.getParent());
    },

    "test should be able to get reference to canvas from fragment": function(){
        // given
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ],
            children:[{
                type:'chart.Base'
            }]
        });
        c.children[0].create();
        // when
        var f = c.children[0].getFragments()[0];

        // then
        assertEquals(c.getCanvas(), f.getCanvas());

    },

    "test should be able to apply add ons": function(){
        // given
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ],
            children:[{
                type:'chart.Base',
                addOns:[
                    {
                        type : 'chart.CustomAddOn'
                    }
                ]
            }]
        });

        // when
        var addOns = c.children[0].addOns;

        // then
        assertNotUndefined(addOns);
        assertEquals(1, addOns.length);
        assertEquals('chart.CustomAddOn', addOns[0].type);
        assertEquals(c.children[0], addOns[0].getParent());

    },

    "test should be able to get fragment for a record": function(){
        // given
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ],
            children:[{
                type:'chart.Base'
            }]
        });

        // when
        var record0 = c.getDataProvider().records[1];
        var record1 = c.getDataProvider().records[1];

        var f0 = c.children[0].getFragmentFor(record0);
        var f1 = c.children[0].getFragmentFor(record1);

        // then
        assertEquals(c.children[0].fragments[1], f0);
        assertEquals(c.children[0].fragments[1], f1);
    }
});