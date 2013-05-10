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
            data : [
                { label : 'First label', value: 150 },
                { label : 'Second label', value : 100 }
            ]
        });

        // then
        assertNotUndefined(c.getFragments());
        assertEquals(2, c.getFragments().length);


    },

    "test every chart fragment should be assigned to a record": function(){

    },



    getComponent:function(){

    }


});