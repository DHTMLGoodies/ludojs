/**
 Goggle Video player component
 @namespace video
 @class GoogleVideo
 @augments video.Video
 */
ludo.video.GoogleVideo = new Class({
    Extends : ludo.video.Video,
    type : 'video.GoogleVideo',

    getVideoUrl:function(){
        return 'http://video.google.com/googleplayer.swf?docid=' + this.movieId;
    }

});