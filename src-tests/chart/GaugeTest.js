TestCase("GaugeTest", {

    "test should be able to define ticks": function(){

    },

    "test should be able to define colors": function(){

    },

    "test should be able to define start and end angle": function(){
        // given
        var gauge = this.getGauge({
            startOffset:20,
            endOffset:20
        });

        // then
        assertEquals(20, gauge.startOffset);
        assertEquals(20, gauge.endOffset);


    },

    "test should be able to define min and max": function(){
        // given


    },

    "test should rotate needle correctly": function(){

    },

    "test should be able to add background picture": function(){

    },

    "test should be able to define border styles": function(){


    },

    "test should be able to define path for needle": function(){

    },

    "test should be able to specify center point of needle": function(){

    },

    getGauge:function(config, data){
        config = config || {};
        data = data || { label : 'CPU', value: 150, min:0, max:200 };
        config.type = 'chart.Gauge';
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                data
            ],
            children:[config ]
        });

        return c.children[0];
    }
});