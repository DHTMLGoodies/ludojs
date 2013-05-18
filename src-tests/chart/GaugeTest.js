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
        // maxValue = 220, minValue: 20
        var gauge = this.getGauge({
            startOffset:20,
            endOffset:20
        });


        var rec = gauge.fragments[0].getRecord();
        rec.setValue(120);

        // when
        var angle = gauge.fragments[0].getAngle();

        // then
        assertEquals(((360 - 40) / 2) + 20, angle);

    },

    "test should get correct degrees": function(){

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
        data = data || { label : 'CPU', value: 150 };
        config.type = 'chart.Gauge';
        config.min = 20;
        config.max = 220;
        var c = new ludo.chart.Chart({
            renderTo:document.body,
            data : [
                data
            ],
            children:[config ]
        });
        c.children[0].create();
        return c.children[0];
    }
});