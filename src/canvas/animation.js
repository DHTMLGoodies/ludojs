ludo.canvas.Animation = new Class({
	Extends: Events,
	fps:33,
	el:undefined,

	initialize:function(el){
		this.el = el;
	},

	animate:function(properties, duration, fps){
		duration = duration || 1;
		fps = fps || 33;
		this.execute(this.getAnimationSteps(properties,duration,fps), 0);

	},

	execute:function(steps, current){
		var step = steps.values[current];

		if(current < steps.values.length - 1){
			this.execute.delay(steps.fps, this, [steps, current+1]);
		}

		for(var i=0;i<step.length;i++){
			if(step[i].key === 'width' || step[i].key === 'height' && step[i].value < 0){
				step[i].value = 0;
			}
			this.el.set(step[i].key, step[i].value);
		}

		if(current === steps.values.length -1 ){
			this.fireEvent('finish', this);
		}

	},
    // TODO this should be available not only to canvas
	getAnimationSteps:function(properties, duration, fps){

		var count = duration * fps;
		var ret = [];
		var inc = this.getIncrements(properties, duration, fps);

		var currentValues = {};

		for(var key in properties){
			if(properties.hasOwnProperty(key)){
				for(var i=0;i<=count;i++){
					if(!ret[i])ret[i] = [];
					if(!currentValues[key]){
						currentValues[key] = properties[key].from;
					}

					var value = currentValues[key];
					if(properties[key].units)value += properties[key].units;

					ret[i].push({
						key:key, value: value
					});

					currentValues[key] += inc[key];
				}
			}
		}

		return {
			values : ret,
			fps : fps
		};
	},

	getIncrements:function(properties, duration, fps){
		var count = duration * fps;
		var ret = {};
		for(var key in properties){
			if(properties.hasOwnProperty(key)){
				ret[key] = (properties[key].to - properties[key].from) / count;
			}
		}
		return ret;
	}
});