/**
 Base class for Video Player components

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

	__construct:function (config) {
		this.parent(config);
		if (config.movieId)this.movieId = config.movieId;
	},

	setContent:function () {
		var el = this.els.body;
		var obj = $('<object>');
		obj.attr({
			'width':'100%',
			'height':'100%'
		});
		el.append(obj);

		var param = $('<param>');
		param.attr({
			'name':'movie',
			'value':this.getUrl()
		});
		obj.append(param);

		var param2 = $('<param>');
		param2.attr({
			'name':'wmode',
			'value':'transparent'
		});
		obj.append(param2);

		var embed = this.els.embed = $('<embed>');
		embed.attr({
			'src':this.getVideoUrl(),
			'type':'application/x-shockwave-flash',
			'wmode':'transparent',
			'width':'100%',
			'height':'100%'
		});
		obj.append(embed);
		el.css('overflow', 'hidden');
		return el;
	},
	/**
	 * Load a new movie
	 * @function loadMovie
	 * @param {String} movieId
	 * @return undefined
	 */
	loadMovie:function (movieId) {
		this.movieId = movieId;
		this.els.embed.attr('src', this.getVideoUrl());
	}
});