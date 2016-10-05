TestCase("AnimationTest", {

	"test should find number of steps": function(){
		// given
		var steps = this.getStepsForAnimation();

		// then
		assertEquals(25 + 1, steps.values.length);
	},

	"test should get correct increments": function(){
		// given
		var animation = new ludo.canvas.Animation(this.getRect());

		// when
		var inc = animation.getIncrements(
			{
				x : {
					from : 10, to: 110, units : '%'
				},
				y: {
					from : 20, to : 70, units : 'px'
				}
			},
			1,
			25
		);

		// then
		assertEquals(100/25, inc['x']);
		assertEquals(50/25, inc['y']);

	},

	"test should find start values": function(){
		// given
		var animation = new ludo.canvas.Animation(this.getRect());

		// when
		var steps = animation.getAnimationSteps(
			{
				x : {
					from : 10, to: 110, units : '%'
				},
				y: {
					from : 20, to : 70
				}
			},
			1,
			25
		);

		// then
		assertEquals(JSON.stringify(steps), '10%', steps.values[0][0].value);
		assertEquals(JSON.stringify(steps), 'x', steps.values[0][0].key);
		assertEquals(20, steps.values[0][1].value);
		assertEquals('y', steps.values[0][1].key);

	},

	"test should find end values": function(){
		// given
		var animation = new ludo.canvas.Animation(this.getRect());

		// when
		var steps = animation.getAnimationSteps(
			{
				x : {
					from : 10, to: 110, units : '%'
				},
				y: {
					from : 20, to : 70
				}
			},
			1,
			25
		);

		var i = steps.values.length-1;
		
		// then
		assertEquals(JSON.stringify(steps.values[i]), '110%', steps.values[i][0].value);
		assertEquals(JSON.stringify(steps.values[i]), 'x', steps.values[i][0].key);
		assertEquals(70, steps.values[i][1].value);
		assertEquals('y', steps.values[i][1].key);

	},

	getStepsForAnimation:function(){
		var animation = new ludo.canvas.Animation(this.getRect());
		return animation.getAnimationSteps(
			{
				x : {
					from : 0, to: 100, units : '%'
				}
			},
			1,
			25
		);
	},


	getRect:function(){
		var v = new ludo.View({
			layout:{ width: 500, height:500},
			renderTo:document.body
		});
		var rect = new ludo.canvas.Rect({ x:100,y:120, width:200,height:300, rx:5, ry:7 });
		v.getCanvas().append(rect);
		return rect;
	}

});