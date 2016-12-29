TestCase("ChartLineUtilTest", {


    "test should return basic 0 to 1 values": function(){
        // when
        var values = ludo.chart.LineUtil.values(0,1, 800);

        // then
        assertEquals([0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1], values);

    },
    "test should return basic 0 to 10 values": function(){
        // when
        var values = ludo.chart.LineUtil.values(0,10, 800);

        // then
        assertEquals([0,1,2,3,4,5,6,7,8,9,10], values);

    },
    "test should return basic 10 to 20 values": function(){
        // when
        var values = ludo.chart.LineUtil.values(10,20, 800);

        // then
        assertEquals([10,11,12,13,14,15,16,17,18,19,20], values);

    },
    "test should return basic 10 to 20 values when smaller": function(){
        // when
        var values = ludo.chart.LineUtil.values(10,20, 400);

        // then
        assertEquals([10,12,14,16,18,20], values);

    },

    "test should return values 1": function(){
        // when
        var values = ludo.chart.LineUtil.values(0,50, 1183);

        // then
        assertEquals([0,5,10,15,20,25,30,35,40,45,50], values);

    },


    "test should get ticks": function(){

        var ticks = ludo.chart.LineUtil.ticks(0,10);
        assertEquals([0,0.1,0.2,0.5,1, 2,5,10], ticks);
    }

});