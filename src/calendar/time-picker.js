/**
 * Time Picker module
 * @module timeanddat
 * @namespace ludo.calendar
 * @class ludo.calendar.TimePicker
 * @param {object} config Config object
 * @param {number} config.hours Initial hours
 * @param {number} config.minutes Initial minutes
 * @param {String} config.clockBackground Background color of "Watch face"
 * @param {String} config.hourColor Color of hours text, default: #555555
 * @param {String} config.minuteColor Color for the minute text, default: #555555
 * @param {String} config.handColor Color of Arrow Hand indicating selected hours and minutes. default: #669900
 * @param {String} config.handTextColor Color of hour and minute text on the hour/minute hand. default: #FFFFFFF
 * @param {String} config.minuteDotColor Color of small dot inside the hour/minute hand., default: #FFFFFF
 * @fires ludo.calendar.TimePicker#mode Fired when switching from hours to minutes. Argument: {String} "hours" or "minutes"
 * @fires ludo.calendar.TimePicker#time Fired when either hours or minutes have been changed.
 * Example:<code>
 * var t = new ludo.calendar.TimePicker({
 *      layout:{width:500,height:500},
 *      renderTo:document.body,
 *      listeners:{
 *          // Listener for the "time" event
 *          'time' : function(hour, minutes, timeAsString){
 *              // timeString in format HH:MM, example: 11:48
 *              console.log(timeAsString);
 *          }
 *
 * });
 *</code>
 */
ludo.calendar.TimePicker = new Class({

    Extends: ludo.View,
    origo: undefined,

    hours: undefined,
    minutes: undefined,

    hourPrefixed: undefined,
    minutePrefixed: undefined,

    area: undefined,

    initialArea: undefined,

    hourGroupInner: undefined,
    hourGroup: undefined,

    frontGroup: undefined,

    hourElements: undefined,
    minuteEls: undefined,

    centerDot: undefined,
    needle: undefined,
    needleCircle: undefined,
    needleText: undefined,
    clipPath: undefined,
    mode: undefined,

    dragActive: false,

    drag: undefined,

    outerSize: 0.85,
    hourInnerSize: 0.65,

    handColor: '#669900',
    minuteDotColor:'#ffffff',
    clockBackground: '#DDDDDD',
    handTextColor: '#ffffff',
    hourColor:'#555555',
    minuteColor:'#555555',

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['hours', 'minutes','handColor', 'minuteDotColor', 'clockBackground','handTextColor',
        'hourColor', 'minuteColor']);

        var d = new Date();
        if (this.hours == undefined) {
            this.hours = d.getHours();
        }
        if (this.minutes == undefined) {
            this.minutes = d.getMinutes();
        }
        this.mode = 'hours';
    },


    __rendered: function () {
        this.parent();
        this.renderClock();
        this.notify();
    },

    setTime:function(hour, minutes){
        this.hours = hour;
        this.minutes = minutes;
        this.setPrefixed();
        this.restart();
        this.notify();
        this.updateNeedle();


    },

    /**
     * Show hours
     * @function restart
     * @memberof ludo.calendar.TimePicker.prototype
     */
    restart: function () {
        this.showHours();
    },


    setPrefixed:function(){
        this.hourPrefixed= this.hours < 10 ? "0" + this.hours : this.hours;
        this.minutePrefixed = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    },

    notify: function () {

        this.fireEvent('time', [this.hours, this.minutes, this.hourPrefixed + ":" + this.minutePrefixed]);
    },

    mouseDown: function (e) {
        this.dragActive = true;

        var offset = this.$b().offset();
        this.drag = {
            elX: offset.left + parseInt(this.$b().css("paddingLeft")) + parseInt(this.$b().css("border-left-width")),
            elY: offset.top + parseInt(this.$b().css("paddingLeft")) + parseInt(this.$b().css("border-top-width"))
        };
        this.updateTimeByEvent(e);
    },

    mouseMove: function (e) {
        if (!this.dragActive)return;
        this.updateTimeByEvent(e);
        return false;

    },

    mouseUp: function () {
        if (this.dragActive) {
            if (this.mode == 'hours') {
                this.showMinutes();
            }
        }
        this.dragActive = false;
    },

    updateTimeByEvent: function (e) {

        var p = ludo.util.pageXY(e);
        var posX = p.pageX - this.drag.elX;
        var posY = p.pageY - this.drag.elY;

        var angle = ludo.geometry.getAngleFrom(this.origo.x, this.origo.y, posX, posY);
        var distance = ludo.geometry.distanceBetweenPoints(this.origo.x, this.origo.y, posX, posY);

        var hour = this.hours;
        var minute = this.minutes;

        if (this.mode == "hours") {
            var inner = distance < (this.area.size / 2) * (this.hourInnerSize * 1.05);
            hour = angle / 360 * 12;
            if (inner)hour += 12;
            hour = Math.round(hour);
            if (!inner && hour == 0)hour = 12;
            if (inner && hour == 12)hour = 0;
            if (hour == 24) hour = 0;

        } else {
            minute = angle / 360 * 60;
            minute = Math.round(minute) % 60;
        }
        if (hour != this.hours || minute != this.minutes) {
            this.hours = hour;
            this.minutes = minute;
            this.setPrefixed();
            this.notify();
            this.updateNeedle();

        }
    },

    updateNeedle: function () {

        var pos, txt;
        if (this.mode == 'hours') {
            var angle = this.getHourAngle(this.hours);
            var length = this.getHourDistance(this.hours);

            pos = ludo.geometry.getPointDistanceFrom(this.origo.x, this.origo.y, angle, length);
            txt = this.hourPrefixed;

            this.needleText.text(txt);

            this.needleText.set('x', pos.x);
            this.needleText.set('y', pos.y);

        } else {

            var a = this.getMinuteAngle(this.minutes);
            var l = this.area.size * this.outerSize / 2;
            pos = ludo.geometry.getPointDistanceFrom(this.origo.x, this.origo.y, a, l);

            var minute = Math.round(this.minutes / 5) * 5;
            if (minute == 60)minute = 0;
            var m = minute < 10 ? "0" + minute : minute;
            var a2 = this.getMinuteAngle(minute);
            var pos2 = ludo.geometry.getPointDistanceFrom(this.origo.x, this.origo.y, a2, l);

            this.needleText.set('x', pos2.x);
            this.needleText.set('y', pos2.y);

            this.needleCircleInnerMinutes.set('cx', pos.x);
            this.needleCircleInnerMinutes.set('cy', pos.y);

            if(pos.x != pos2.x){
                this.needleCircleInnerMinutes.show();
            }else{
                this.needleCircleInnerMinutes.hide();
            }

            this.needleText.text(m);
        }


        this.clipCircle.set('cx', pos.x);
        this.clipCircle.set('cy', pos.y);

        this.needle.set('x2', pos.x);
        this.needle.set('y2', pos.y);

        this.needleCircle.set('cx', pos.x);
        this.needleCircle.set('cy', pos.y);


    },



    renderClock: function () {
        var canvas = this.svg();
        canvas.getNode().on(ludo.util.getDragStartEvent(), this.mouseDown.bind(this));
        jQuery(document.body).on(ludo.util.getDragMoveEvent(), this.mouseMove.bind(this));
        jQuery(document.body).on(ludo.util.getDragEndEvent(), this.mouseUp.bind(this));


        var size = Math.min(canvas.width, canvas.height);

        this.hourElements = [];
        this.minuteEls = [];

        this.origo = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        this.area = {
            x: (canvas.width - size) / 2,
            y: (canvas.height - size) / 2,
            size: size
        };

        this.initialArea = {
            x: this.area.x, y: this.area.y, size: this.area.size
        };

        this.clipPath = canvas.$('clipPath', {});
        canvas.append(this.clipPath);
        this.clipCircle = new canvas.$('circle', {
            cx: this.origo.x, cy: this.origo.y, r: 5
        });
        this.clipPath.append(this.clipCircle);


        this.clockBackground = canvas.$('circle', {
            cx: this.origo.x, cy: this.origo.y, r: this.area.size / 2,
            css: {
                'fill': this.clockBackground
            }
        });
        canvas.append(this.clockBackground);

        this.hourGroup = new ludo.svg.Group({
            css: {
                'fill': this.hourColor,
                'stroke-width': 0

            }
        });

        var styles = {
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        };

        canvas.append(this.hourGroup);

        this.hourGroupInner = new ludo.svg.Group({
            css: {
                'fill': this.hourColor,
                'stroke-width': 0
            }
        });
        canvas.append(this.hourGroupInner);

        var i;

        for (i = 1; i <= 12; i++) {
            var text = new ludo.svg.Text("" + i, {
                css: styles
            });

            text.set("text-anchor", "middle");
            text.set("alignment-baseline", "middle");

            this.hourGroup.append(text);
            this.hourElements.push({
                hour: i,
                el: text
            });
        }

        for (i = 13; i <= 24; i++) {
            var txt = i == 24 ? "00" : "" + i;
            text = new ludo.svg.Text(txt, {
                css: styles
            });
            text.set("text-anchor", "middle");
            text.set("alignment-baseline", "middle");
            this.hourElements.push({
                hour: i,
                el: text
            });
            this.hourGroupInner.append(text);
        }

        this.centerDot = canvas.$('circle', {
            cx: this.origo.x, cy: this.origo.y,
            r: 2,
            css: {
                'fill': this.handColor, 'stroke-width': 0
            }
        });

        this.needle = canvas.$('line',
            {
                x1: this.origo.x, y1: this.origo.y,
                x2: 100, y2: 100,
                css: {
                    'stroke-linecap': "round",
                    'stroke': this.handColor,
                    'stroke-width': 2
                }
            }
        );
        canvas.append(this.needle);


        this.minuteGroup = new ludo.svg.Group({
            css: {
                'fill': this.minuteColor,
                'stroke-width': 0
            }
        });
        canvas.append(this.minuteGroup);

        for (i = 0; i < 60; i += 5) {
            var m = "" + i;
            if (m.length == "1")m = "0" + m;
            text = new ludo.svg.Text(m, {
                css: styles
            });
            text.set("text-anchor", "middle");
            text.set("alignment-baseline", "middle");
            this.minuteEls.push({
                minute: i,
                el: text
            });
            this.minuteGroup.append(text);
        }

        this.needleCircle = canvas.$('circle', {
            cx: this.origo.x, cy: this.origo.y, r: 10,
            css: {
                'fill': this.handColor
            }
        });
        canvas.append(this.needleCircle);

        this.needleCircleInnerMinutes = canvas.$('circle', {
            cx: this.origo.x, cy: this.origo.y, r: 1,
            css: {
                fill: this.minuteDotColor
            }
        });
        canvas.append(this.needleCircleInnerMinutes);

        
        this.needleText = new ludo.svg.Text("", {
            'fill': this.handTextColor,
            css: styles

        });
        this.needleText.set("text-anchor", "middle");
        this.needleText.set("alignment-baseline", "middle");
        canvas.append(this.needleText);

        this.needleText.clip(this.clipPath);

        this.showHours();

        canvas.append(this.centerDot);

        this.resizeSVG();
    },

    positionHour: function (index) {
        var hour = this.hourElements[index].hour;
        var offset = this.getHourDistance(hour);
        var angle = this.getHourAngle(hour);
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        this.hourElements[index].el.set('x', (x * offset) + this.origo.x);
        this.hourElements[index].el.set('y', (y * offset) + this.origo.y);
    },

    getHourDistance: function (hour) {
        return hour <= 12 && hour > 0 ? this.area.size * this.outerSize / 2 : this.area.size * this.hourInnerSize / 2;
    },

    getHourAngle: function (hour) {
        hour = hour % 12;
        var degrees = 360 / 12 * hour;
        degrees -= (360 * 3 / 12);
        return ludo.geometry.toRadians(degrees);
    },

    getMinuteAngle: function (minute) {
        var degrees = 360 / 60 * minute;
        degrees -= 90;
        return ludo.geometry.toRadians(degrees);
    },

    positionMinute: function (index) {
        var offset = this.area.size * this.outerSize / 2;
        var angle = this.getMinuteAngle(this.minuteEls[index].minute);
        var x = Math.cos(angle);
        var y = Math.sin(angle);
        this.minuteEls[index].el.set('x', (x * offset) + this.origo.x);
        this.minuteEls[index].el.set('y', (y * offset) + this.origo.y);
    },

    resizeDOM: function () {
        this.parent();
        if (!this.hourGroup)return;
        this.resizeSVG();
    },

    resizeSVG: function () {
        var canvas = this.svg();
        canvas.fitParent();
        var size = Math.min(canvas.width, canvas.height);

        this.area = {
            x: (canvas.width - size) / 2,
            y: (canvas.height - size) / 2,
            size: size
        };

        this.hourGroup.css({
            'font-size': this.area.size / 20
        });
        this.hourGroupInner.css({
            'font-size': this.area.size / 25
        });

        this.needleCircle.set('r', this.area.size / 20);
        this.clipCircle.set('r', this.area.size / 20);

        this.origo = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        for (i = 0; i < this.hourElements.length; i++) {
            this.positionHour(i);
            var s = i < 12 ? this.area.size / 20 : this.area.size / 25;
            this.hourElements[i].el.css("font-size", s);
        }
        for (i = 0; i < this.minuteEls.length; i++) {
            this.positionMinute(i);
            this.minuteEls[i].el.css("font-size", this.area.size / 20);
        }

        this.clockBackground.set('cx', this.origo.x);
        this.clockBackground.set('cy', this.origo.y);
        this.clockBackground.set('r', this.area.size / 2);

        this.centerDot.set('cx', this.origo.x);
        this.centerDot.set('cy', this.origo.y);
        this.centerDot.set('r', this.area.size / 70);
        this.needleCircleInnerMinutes.set('r', this.area.size / 150);

        this.needle.set('x1', this.origo.x);
        this.needle.set('y1', this.origo.y);

        this.needleText.css("font-size", this.area.size / 20);

        this.updateNeedle();
    },


    showMinutes: function () {
        this.mode = 'minutes';
        this.hourGroup.hide();
        this.hourGroupInner.hide();
        this.minuteGroup.show();
        this.needleCircleInnerMinutes.show();
        this.updateNeedle();

        this.fireEvent('mode', 'minutes');
    },

    showHours: function () {
        this.mode = 'hours';
        this.hourGroup.show();
        this.hourGroupInner.show();
        this.minuteGroup.hide();
        this.needleCircleInnerMinutes.hide();
        this.updateNeedle();


        this.fireEvent('mode', 'hours');
    },

    getTimeString:function(){
        return this.hourPrefixed + ":" + this.minutePrefixed;
    },

    val:function(val){
        if(arguments.length > 0){
            var tokens = val.split(/:/g);
            this.setTime(parseInt(tokens[0]),parseInt(tokens[1]));
        }
        return this.hourPrefixed + ":" + this.minutePrefixed;
    }

});