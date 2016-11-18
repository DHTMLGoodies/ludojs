/**
 * Spec of config options for tab layout

 */
ludo.layout.TabSpec = {
	/**
	 type attribute of parent must be set to "tab" to get tab layout
	 config {String} type
	 example
	 	new ludo.View({
	 		layout:{
	 			type:'tab'
			}
		});
	 */
	type : 'tab',

	/**
	 * Where to render tab strip, left,right,top or bottom
	 * config {String} tabs
	 * default 'top'
	 */
	tabs:'top',

	/**
	 * True to make child closable by adding close button to tab
	 * config {Boolean} closable
	 * default false
	 */
	closable:false,

	/**
	 * Path to icon to show left of title.
	 * config {String} icon
	 * default undefined
	 */
	icon:undefined,

	/**
	 * Alternative title to use in tab. By default view.getTitle() will be used
	 * config {String} title
	 * default undefined
	 */
	title:undefined
};