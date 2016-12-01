// TODO try mp3 files
ludo.audio.Audio = new Class({
    soundElCreated:false,
    html5:false,
    bgSound:undefined,

    initialize:function () {
        this.html5 = this.supportsHTML5Audio();
    },

    createBgSound:function () {
        var el;
        if (this.html5) {
            el = this.bgSound = document.createElement('audio');
            document.body.append(el);
        } else {
            el = this.bgSound = new Element('bgsound');
            document.body.append(el);
            el.setProperty('loop', '1');
            el.setProperty('autostart', 'true');

        }
        el.src = '#';
    },

    supportsHTML5Audio:function () {
        var a = document.createElement('audio');
        return a.canPlayType !== undefined;
        /*
         console.log(a.canPlayType3);
         return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')); */
    },

    play:function (file) {
        if (!this.soundElCreated) {
            this.createBgSound();
        }
        this.bgSound.src = file;
        this.bgSound.pause();
        this.bgSound.play();
        this.bgSound.currentTime -= 30.0;
    }
});

ludo.audio.sounds = {};


ludo.audio.playSound = function (soundName) {
    if (ludo.audio.audioObject === undefined) {
        ludo.audio.audioObject = new ludo.audio.Audio();
    }
    ludo.audio.audioObject.play(ludo.audio.getSound(soundName));
};

ludo.audio.addSound = function (name, file) {
    ludo.audio.sounds[name] = file;
};

ludo.audio.getSound = function (name) {
    return ludo.audio.sounds[name];
};

/*
 <bgsound src="#" id="soundeffect" loop=1 autostart="true" />

 <script type="text/javascript">


 var soundfile="sidebar.wav" //path to audio file, or pass in filename directly into playsound()

 function playsound(soundfile){
 if (document.all && document.getElementById){
 document.getElementById("soundeffect").src="" //reset first in case of problems
 document.getElementById("soundeffect").src=soundfile
 }
 }

 function bindsound(tag, soundfile, masterElement){
 if (!window.event) return
 var source=event.srcElement
 while (source!=masterElement && source.tagName!="HTML"){
 if (source.tagName==tag.toUpperCase()){
 playsound(soundfile)
 break
 }
 source=source.parentElement
 }
 }

 */