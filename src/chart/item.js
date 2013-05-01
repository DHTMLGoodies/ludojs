/**
 * Base class for fragments/SVG elements used by charts, example slices in a Pie chart or bars in a bar chart.
 * @namespace chart
 * @class item
 */
ludo.chart.Item = new Class({
    Extends:ludo.canvas.NamedNode,
    tooltip:undefined,
    group:undefined,
    animationConfig:{},

    colors:{},

    initialize:function (config) {
        this.group = config.group;
        this.setColors(config.styles);

        this.parent({ "class":this.getStyleObj(config.styles)});
        config.group.adopt(this);

        this.addEvent('mouseenter', this.enter.bind(this));
        this.addEvent('mouseleave', this.leave.bind(this));


    },

    setColors:function (styles) {
        this.colors = {
            normal:{
                fill:styles.fill,
                stroke:styles.stroke
            },
            over:{
                fill:this.group.color().brighten(styles.fill, 4),
                stroke:this.group.color().darken(styles.stroke, 4)
            }
        };
    },

    getStyleObj:function (styles) {
        var p = new ludo.canvas.Paint(styles);
        this.group.getCanvas().adoptDef(p);
        return p;
    },

    createTooltip:function (e) {
        if (this.tooltip === undefined) {
            // TODO configurable Tooltip styles or stylesheet
            // TODO possible to turn tooltip on/off
            var p = new ludo.canvas.Paint(this.group.getTooltipStyles());
            this.group.getCanvas().adopt(p);
            this.tooltip = new ludo.chart.Tooltip(this, p);
            this.tooltip.showTooltip(e);
        }
    },

    enter:function () {
        this.setStyles(this.colors.over);
    },

    leave:function () {
        this.setStyles(this.colors.normal);
    },

    animate:function (animationConfig) {
        this.fireEvent('animate', this);
        this.animateStep(animationConfig, 0);
    },

    animateStep:function(animationConfig, currentStep){
        this.executeAnimation(animationConfig.step[currentStep], currentStep);
        currentStep++;
        if(currentStep < animationConfig.count){
            this.animateStep.delay(this.group.getAnimationSpec().fps, this, [animationConfig, currentStep ]);
        }else{
            this.fireEvent('animationComplete', this);
        }
    },

    executeAnimation:function(data){
        this.renderingData = data;
    },

    getAnimationConfig:function (values) {
        var animation = this.group.getAnimationSpec();
        var countSteps = animation.fps * animation.duration;
        this.animationConfig = {
            count:countSteps,
            step:this.getAnimationSteps(countSteps, values)
        };
        return this.animationConfig;

    },

    getAnimationSteps:function (steps, values) {
        var ret = [];
        var startValues = this.getAnimationStartValues();
        var increments = this.getAnimationIncrements(steps, values, startValues);

        var k = this.animationKeys;
        for (var i = 0; i < steps; i++) {
            var obj = {};
            for (var j = 0; j < k.length; j++) {
                startValues[k[j]] += increments[k[j]];
                obj[k[j]] = startValues[k[j]];
            }
            ret.push(obj);
        }
        return ret;
    },

    getAnimationStartValues:function () {
        var ret = {};
        var k = this.animationKeys;

        for (var i = 0; i < k.length; i++) {
            ret[k[i]] = (this.renderingData && this.renderingData[k[i]]) ? this.renderingData[k[i]] : 0
        }
        return ret;
    },

    getAnimationIncrements:function (steps, values, startValues) {
        var k = this.animationKeys;
        var ret = {};

        for (var i = 0; i < k.length; i++) {
            ret[k[i]] = (values[k[i]] - startValues[k[i]]) / steps;
        }
        return ret;
    },

    storeRenderingData:function (data) {
        this.renderingData = data;
    },

    getAnimationValues:function(index){
        return this.animationConfig.step[index];
    }
});