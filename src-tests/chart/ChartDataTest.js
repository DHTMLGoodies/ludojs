TestCase("ChartDataTest", {



    "test should get value": function(){
        // given
        var d = this.getDataSource();

        // then
        
    },



    getDataSource:function(){

        return new ludo.chart.DataSource({

            textOf:function(key, record, caller){
                return record.name;
            },

            valueOf:function(key, record, caller){
                return record.value;
            },

            data:[
                {
                    id:1,
                    "name": "John",
                    value: 100

                },
                {
                    id:2,
                    name:"Jane",
                    value:200
                }
            ]
        });

    }


});