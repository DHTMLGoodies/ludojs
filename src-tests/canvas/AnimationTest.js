TestCase("AnimationTest", {
    startTime: undefined,
    startTimer: function () {
        this.startTime = new Date().getTime();
    },

    assertTime: function (expected) {
        var s = new Date().getTime();
        var elapsed = s - this.startTime;
        assertTrue(expected + " vs " + elapsed, elapsed < expected);
    },

    "test should run animations of basic properties effectively": function () {

        var v = new ludo.View({
            renderTo: document.body,
            layout: {
                width: 'matchParent', height: 'matchParent'
            }
        });

        var svg = v.getCanvas();

        var circle = svg.$('circle', {r: 50, cx: 0, cy: 0});
        svg.append(circle);


        var animation = {
            node: circle,
            properties: {
                cx: 100, cy: 100
            },
            options: {
                duration: 1000
            },
            __finish: function () {
            }
        };

        var animation2 = {
            node: circle,
            properties: {
                cx: 0, cy: 0
            },
            options: {
                duration: 1000
            },
            __finish: function () {
            }
        };


        this.startTimer();

        ludo.svgAnimation.testing = true;
        for (var i = 0; i < 100; i++) {
            ludo.svgAnimation.fn(animation);
            ludo.svgAnimation.fn(animation2);

        }

        this.assertTime(10);
    },

    "test should run animations of translation effectively": function () {

        var v = new ludo.View({
            renderTo: document.body,
            layout: {
                width: 'matchParent', height: 'matchParent'
            }
        });

        var svg = v.getCanvas();

        var circle = svg.$('circle', {r: 50, cx: 0, cy: 0});
        svg.append(circle);


        var animation = {
            node: circle,
            properties: {
                translate:[100,100]
            },
            options: {
                duration: 1000
            },
            __finish: function () {
            }
        };

        var animation2 = {
            node: circle,
            properties: {
                translate:[0,0]
            },
            options: {
                duration: 1000
            },
            __finish: function () {
            }
        };


        this.startTimer();

        ludo.svgAnimation.testing = true;
        for (var i = 0; i < 10000; i++) {
            ludo.svgAnimation.fn(animation);
            ludo.svgAnimation.fn(animation2);

        }

        this.assertTime(10);
    }

});