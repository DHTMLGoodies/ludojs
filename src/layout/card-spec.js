ludo.layout.CardSpec = {
	/**
	 Type attribute should be set to "card" for parent
	 @config {String} type
	 @example
	 	var w = new ludo.Window({
	 		width:500,height:500,
	 		layout:{
	 			type:'card',
	 			animate:true,
	 			animationDuration:.3,
	 			animateX:false
			},
			children:[
				{ html:'Child A' },
				{ html:'Child B' },
				{ html:'Child C', layout:{ visible: true } },
				{ html:'Child D' },
			]
		});

	 */
	type:'card',
	/**
	 * Option for children inside card layout.
	 * Children inside a "card" layout are by default hidden. Set visible to
	 * true to set initial shown card/child view. If not set, first card will
	 * be shown.
	 * @config {Boolean} visible
	 * @default false
	 */
	visible:false,
	/**
	 * True to enable animation effects. This option should be set for the parent.
	 * @config {Boolean} animate
	 * @default false
	 */
	animate:false,

	/**
	 * Time for animation in seconds. This option should be set for the parent.
	 * @config {Number} animationDuration
	 * @default 0.25
	 */
	animationDuration:.25,

	/**
	 * True to animate in x-direction(left-right). false to animate in y-direction, (up and down)
	 * @config {Boolean} animateX
	 * @default: true
	 */
	animateX:true
};