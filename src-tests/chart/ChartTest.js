TestCase("ChartTest", {

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
    }
});