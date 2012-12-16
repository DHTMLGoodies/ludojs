ludo.layout.LinearSpec = new Class({

	/**
	 * vertical to arrange children in rows, horizontal to arrange in columns
	 * @config orientation
	 * @type {String}
	 * @default vertical
	 */
	orientation:'vertical',

	width:undefined,

	height:undefined,
	/**
	 * When set to a numeric value, the view will have dynamic width when it's a child of a component
	 * with "rows" or "cols" layout. Example: You have a component with a total width of
	 * 700 pixels and layout set to "cols". The component has 3 children. Child A has a width of
	 * 100 pixels, child B has weight set to 2. Child C has weight set to 1.
	 * After assigning 100 pixels to child A, there is 600 pixels left. Child B will use 2/3 of this space,
	 * i.e. 400 pixels. Child C will use 1/3 of 600, i.e. 200 pixels.
	 * When parent view is resized, the width of A will remain fixed, while the width of child B and C
	 * will change dynamically based on their weight.
	 * @config {Boolean} weight
	 * @default undefined
	 */
	weight:undefined

});