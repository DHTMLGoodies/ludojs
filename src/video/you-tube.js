/**
 YouTube video player component
 @namespace video
 @class YouTube
 @augments video.Video
 @constructor
 @param {Object} config
 @example
	 var win = new ludo.Window({
		 left:100, top:50,
		 hideBodyOnMove:true,
		 title:'YouTube Video',
		 aspectRatio:1.6,
		 preserveAspectRatio:true,
		 width:600,
		 layout:'rows',
		 children:[
			 { name:'youtubevideo', weight:1, type:'video.YouTube',movieId:'fPTLa3ylmuw' }
		 ]
	 });
 Shows a YouTube video inside a window.
 */
ludo.video.YouTube = new Class({
	Extends:ludo.video.Video,
	type:'video.YouTube',

	getVideoUrl:function () {
		return 'http://www.youtube.com/v/' + this.movieId;
	}

});