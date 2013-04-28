ludo.canvas.Effect = new Class({

    fps:33,

    fly:function(el, x, y, duration){
        var start = this.getTranslate(el);
        this.execute('translate', el, [start.x, start.y],[start.y + x, start.y + y], duration);
    },

    /**
     * Animates back to translate(0,0)
     * @method flyBack
     * @param el
     * @param duration
     */
    flyBack:function(el, duration){
        var start = this.getTranslate(el);
        this.execute('translate', el, [start.x, start.y],[0,0], duration);
    },

    getTranslate:function(el){
        var ret = ludo.canvasEngine.getTransformation(el, 'translate');
        if(!ret)ret = {
            x:0,y:0
        };
        return ret;
    },

    execute:function(property, el, start, end, duration){
        duration = duration || .25;
        var ef = this.getEffectConfig(start, end, duration);
        this.executeStep(property, el, start, ef.steps, ef.count, 0 );
    },

    executeStep:function(property, el, current, increments, countSteps, stepIndex){
        for(var i = 0;i<increments.length;i++){
            current[i] += increments[i];
        }

        ludo.canvasEngine.setTransformation(el, property, current.join(' '));
        stepIndex ++;
        if(stepIndex < countSteps){
            this.executeStep.delay(this.fps, this, [
                property, el, current, increments, countSteps, stepIndex
            ]);
        }
    },

    getEffectConfig:function(start, end, duration){
        var countSteps = Math.round(duration * this.fps);
        var steps = [];
        for(var i=0;i<start.length;i++){
            steps.push((end[i] - start[i]) / countSteps);
        }

        return {
            steps: steps,
            count : countSteps
        }

    }
});