/**
 * Created by alfmagne1 on 28/12/2016.
 */
ludo.chart.LineUtil = {

    minTickSize: 120,


    _ticks: undefined,

    values:function(min,max,availSize, caller, minTickSize){
        var ticks = this.ticks(0,(max - min) / availSize * (minTickSize || this.minTickSize));

        var tick = ticks.pop();
        var ret = [];

        var val = min + (min % tick);

        while(val <= max){
            ret.push(val);
            val+=tick;
        }

        return ret;

    },

    ticks:function(min,max){
        if(this._ticks == undefined){
            this.createTicks();
        }

        var ret = [];
        var i = 0;

        while(this._ticks[i] <= max && i < this._ticks.length){
            var val = this._ticks[i];

            if(val >= min && val <= max){
                ret.push(val);
            }
            i++;
        }

        return ret;

    },

    createTicks:function(){
        this._ticks = [];
        var mult = 1/100;

        for(var i=0;i< 10; i++){
            this._ticks.push(-mult);
            this._ticks.push(-2 * mult);
            this._ticks.push(-5 * mult);
            mult*=10;
        }

        mult = 0.1;

        this._ticks.push(0);

        for(i=0;i< 10; i++){
            this._ticks.push(mult);
            this._ticks.push(2 * mult);
            this._ticks.push(5 * mult);
            mult*=10;

        }
    }
    
};