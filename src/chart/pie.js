ludo.chart.Pie = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.PieSlice',
    rendered:false,

    render:function(){
        this.animate();
        this.rendered = true;
    },

    getRadius:function(){
        return this.parent() * .85;
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