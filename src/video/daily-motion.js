/**
 DailyMotion video player component
 @namespace video
 @class DailyMotion
 @extends video.Video
 */
ludo.video.DailyMotion = new Class({
	Extends:ludo.video.Video,
	type:'video.DailyMotion',

	getVideoUrl:function () {
		return 'http://www.dailymotion.com/swf/' + this.movieId;
	}
});