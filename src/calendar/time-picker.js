/**
 * Time Picker module
 * @namespace ludo.calendar
 * @extends ludo.View
 * @param {object} config Config object
 * @param {number} config.hours Initial hours
 * @param {number} config.minutes Initial minutes
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

    mode: undefined,

    dragActive: false,

    drag: undefined,

    outerSize: 0.85,
    hourInnerSize: 0.65,

    needleColor: '#669900',
    minuteDotColor:'#ffffff',
    clockBackground: '#DDDDDD',
    needleTextColor: '#ffffff',
    hourColor:'#555555',
    minuteColor:'#555555',

    ludoConfig: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['hours', 'minutes']);

        var d = new Date();
        if (this.hours == undefined) {
            this.hours = d.getHours();
        }
        if (this.minutes == undefined) {
            this.minutes = d.getMinutes();
        }
        this.mode = 'hours';
    },


    ludoRendered: function () {
        this.parent();
        this.renderClock();
        this.notify();
    },

    setTime:function(hour, minutes){
        this.hours = hour;
        this.minutes = minutes;
        this.restart();
        this.notify();
        this.updateNeedle();


    },

    restart: function () {
        this.showHours();
    },

    notify: function () {
        var h = this.hours < 10 ? "0" + this.hours : this.hours;
        var m = this.minutes < 10 ? "0" + this.minutes : this.minutes;

        this.hourPrefixed = h;
        this.minutePrefixed = m;

        this.fireEvent('time', [this.hours, this.minutes, h + ":" + m]);
    },

    mouseDown: function (e) {
        this.dragActive = true;

        var offset = this.getBody().offset();
        this.drag = {
            elX: offset.left + parseInt(this.getBody().css("paddingLeft")) + parseInt(this.getBody().css("border-left-width")),
            elY: offset.top + parseInt(this.getBody().css("paddingLeft")) + parseInt(this.getBody().css("border-top-width"))
        };
        this.updateTimeByEvent(e);
    },

    mouseMove: function (e) {
        if (!this.dragActive)return;
        this.updateTimeByEvent(e);

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


        var posX = e.pageX - this.drag.elX;
        var posY = e.pageY - this.drag.elY;

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

    clipPath: undefined,

    renderClock: function () {
        var canvas = this.getCanvas();
        canvas.getNode().on(ludo.util.getDragStartEvent(), this.mouseDown.bind(this));
        $(document.body).on(ludo.util.getDragMoveEvent(), this.mouseMove.bind(this));
        $(document.body).on(ludo.util.getDragEndEvent(), this.mouseUp.bind(this));


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

        this.clipPath = new ludo.canvas.Node('clipPath', {});
        canvas.append(this.clipPath);
        this.clipCircle = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: 5
        });
        this.clipPath.append(this.clipCircle);


        this.clockBackground = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: this.area.size / 2,
            css: {
                'fill': this.clockBackground
            }
        });
        canvas.append(this.clockBackground);

        this.hourGroup = new ludo.canvas.Group({
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

        this.hourGroupInner = new ludo.canvas.Group({
            css: {
                'fill': this.hourColor,
                'stroke-width': 0
            }
        });
        canvas.append(this.hourGroupInner);

        var i;

        for (i = 1; i <= 12; i++) {
            var text = new ludo.canvas.Text("" + i, {
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
            text = new ludo.canvas.Text(txt, {
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

        this.centerDot = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y,
            r: 2,
            css: {
                'fill': this.needleColor, 'stroke-width': 0
            }
        });

        this.needle = new ludo.canvas.Node('line',
            {
                x1: this.origo.x, y1: this.origo.y,
                x2: 100, y2: 100,
                css: {
                    'stroke-linecap': "round",
                    'stroke': this.needleColor,
                    'stroke-width': 2
                }
            }
        );
        canvas.append(this.needle);


        this.minuteGroup = new ludo.canvas.Group({
            css: {
                'fill': this.minuteColor,
                'stroke-width': 0
            }
        });
        canvas.append(this.minuteGroup);

        for (i = 0; i < 60; i += 5) {
            var m = "" + i;
            if (m.length == "1")m = "0" + m;
            text = new ludo.canvas.Text(m, {
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

        this.needleCircle = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: 10,
            css: {
                'fill': this.needleColor
            }
        });
        canvas.append(this.needleCircle);

        this.needleCircleInnerMinutes = new ludo.canvas.Circle({
            cx: this.origo.x, cy: this.origo.y, r: 1,
            css: {
                fill: this.minuteDotColor
            }
        });
        canvas.append(this.needleCircleInnerMinutes);



        this.needleText = new ludo.canvas.Text("", {
            'fill': this.needleTextColor,
            css: styles

        });
        this.needleText.set("text-anchor", "middle");
        this.needleText.set("alignment-baseline", "middle");
        canvas.append(this.needleText);

        this.needleText.applyClipPath(this.clipPath);

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
        return ludo.geometry.degreesToRadians(degrees);
    },

    getMinuteAngle: function (minute) {
        var degrees = 360 / 60 * minute;
        degrees -= 90;
        return ludo.geometry.degreesToRadians(degrees);
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
        var canvas = this.getCanvas();
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
    },

    showHours: function () {
        this.mode = 'hours';
        this.hourGroup.show();
        this.hourGroupInner.show();
        this.minuteGroup.hide();
        this.needleCircleInnerMinutes.hide();
        this.updateNeedle();
    },

    getTimeString:function(){
        return this.hourPrefixed + ":" + this.minutePrefixed;
    }

});