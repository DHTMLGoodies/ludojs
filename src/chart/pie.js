/**
 Class for pie charts.
 @namespace chart
 @class Pie
 @example
     // Create data source for the pie chart.
     var provider = new ludo.chart.DataProvider({
            data:[
                { label:'John', value:100 },
                { label:'Jane', value:245 },
                { label:'Martin', value:37 },
                { label:'Mary', value:99 },
                { label:'Johnny', value:127 },
                { label:'Catherine', value:55 },
                { label:'Tommy', value:18 }
            ]
        }
     );

     var w = new ludo.Window({
            title:'Pie chart',
            layout:{
                width:700,
                height:500,
                left:20,
                top:20,
                type:'tab'
            },
            css:{
                'background-color':'#fff',
                'border-top':0
            },
            children:[
                {
                    title:'Chart',
                    layout:{
                        type:'relative'
                    },
                    children:[
                        {
                            name : 'form',
                            layout:{
                                alignParentRight:true,
                                width:200,
                                fillDown:true,
                                type:'linear',
                                orientation:'vertical'
                            },
                            form:{
                                listeners:{
                                    'change': function(manager){
                                        var data = provider.getData();
                                        var values = manager.getValues();
                                        var i = 0;
                                        var records = provider.getRecords();

                                        for(var key in values){
                                            if(values.hasOwnProperty(key)){
                                                records[i].setValue(parseInt(values[key]));
                                            }
                                            i++;
                                        }
                                    }
                                }
                            },
                            children:[
                                { type:'form.Text', minValue:5, required:true, name:'item0', label:'John', value:100, color:'#000088' },
                                { type:'form.Text', minValue:5, required:true, label:'Jane', value:245 },
                                { type:'form.Text', minValue:5, required:true, label:'Martin', value:37 },
                                { type:'form.Text', minValue:5, required:true, label:'Mary', value:99 },
                                { type:'form.Text', minValue:5, required:true, label:'Johnny', value:127 },
                                { type:'form.Text', minValue:5, required:true, label:'Catherine', value:55 },
                                { type:'form.Text', minValue:5, required:true,  label:'Tommy', value:18 }
                            ]
                        },
                        {

                            layout:{
                                top:0,
                                fillLeft:true,
                                fillDown:true,
                                leftOf:'form'
                            },
                            css:{
                                'border-right' : '1px solid #d7d7d7'
                            },
                            type:'chart.Chart',
                            id:'chart',
                            dataProvider:provider,
                            children:[
                                {
                                    name : 'pie',
                                    type:'chart.Pie',
                                    id:'pie',
                                    animate:true,
                                    layout:{
                                        above:'labels',
                                        left:0,
                                        fillRight:true,
                                        fillUp:true
                                    },
                                    addOns:[
                                        {
                                            type:'chart.PieSliceHighlighted'
                                        }
                                    ]
                                },
                                {
                                    name:'labels',
                                    id:'labels',
                                    type:'chart.Labels',
                                    layout:{
                                        alignParentBottom:true,
                                        height:40,
                                        left:0,
                                        fillRight:true
                                    }
                                }
                            ]
                        }
                    ]
                }
                ,
                {
                    type:'SourceCodePreview'
                }
            ]
        });
 */
ludo.chart.Pie = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.PieSlice',
    rendered:false,

    /**
     Array of add-ons for the pie chart
     @config {Array} addOns
     @example
         addOns:[
             {
                 type:'chart.PieSliceHighlighted'
             }
         ]
     */
    addOns:[],

    render:function(){
        this.animate();
        this.rendered = true;
    },

    getRadius:function(){
        return this.parent() - 20;
    },

    animate:function(){
        var e = new ludo.canvas.Effect();
        var r = this.getRecords();

        var radius = e.getEffectConfig([0], [this.getRadius()], 1);
        var degrees = [];
        var currentDegrees = [];

        for(var i=0;i< r.length;i++){
            degrees.push(e.getEffectConfig([0], [r[i].getDegrees()], 1).steps[0]);
            currentDegrees.push(0);
        }

        this.executeAnimation({
            startAngle:this.dataProvider().startAngle,
            radius: radius.steps[0],
            currentRadius:0,
            degrees: degrees,
            currentDegrees:currentDegrees,
            count: radius.count
        }, 0);
    },

    executeAnimation:function(config, currentStep){
        config.currentRadius += config.radius;

        var angle = config.startAngle;
        for(var i=0;i<config.degrees.length;i++){
            config.currentDegrees[i] += config.degrees[i];
            this.fragments[i].set(config.currentRadius, angle, config.currentDegrees[i]);
            angle += config.currentDegrees[i];

        }
        if(currentStep < config.count - 1){
            this.executeAnimation.delay(33, this, [config, currentStep +1]);
        }
    },

    update:function(){
        if(!this.rendered){
            this.render();
        }
    },

    onResize:function(){
        if(!this.rendered){
            return;
        }
        var r = this.getRecords();
        var radius = this.getRadius();

        for(var i=0;i< r.length;i++){
            this.fragments[i].set(radius, r[i].getAngle(), r[i].getDegrees());
        }
    }
});