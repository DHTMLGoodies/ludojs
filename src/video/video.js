/**
 Base class for Video Player components
 @namespace video
 @class Video
 @extends View
 */
ludo.video.Video = new Class({
	Extends:ludo.View,
	type:'video.Video',
	/**
	 * ID of movie, to show, example an YouTube id
	 * @attribute movieId
	 * @type String
	 * @default undefined
	 */
	movieId:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.movieId) {
			this.movieId = config.movieId;
		}
	},

	setContent:function () {
		var el = this.els.body;

		var obj = new Element('object');
		obj.setProperties({
			'width':'100%',
			'height':'100%'
		});
		el.adopt(obj);

		var param = new Element('param');
		param.setProperties({
			'name':'movie',
			'value':this.getUrl()
		});
		obj.adopt(param);

		var param2 = new Element('param');
		param2.setProperties({
			'name':'wmode',
			'value':'transparent'
		});
		obj.adopt(param2);

		var embed = this.els.embed = new Element('embed');
		embed.setProperties({
			'src':this.getVideoUrl(),
			'type':'application/x-shockwave-flash',
			'wmode':'transparent',
			'width':'100%',
			'height':'100%'
		});
		obj.adopt(embed);
		el.setStyle('overflow', 'hidden');
		return el;
	},
	/**
	 * Load a new movie
	 * @method loadMovie
	 * @param {String} movieId
	 * @return undefined
	 */
	loadMovie:function (movieId) {
		this.movieId = movieId;
		this.els.embed.setProperty('src', this.getVideoUrl());
	}
});