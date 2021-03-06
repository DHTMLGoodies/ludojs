TestCase("SliderTest", {

    getSlider: function (config) {
        config = config || {};
        config = Object.merge(config, {});
        config.type = 'form.Slider';
        config.id = String.uniqueID();
        new ludo.Window({
            width: 400,
            height: 100,
            layout: 'rows',
            children: [config]
        });
        return ludo.get(config.id);

    },

    getHandlePosition: function (slider) {
        if (slider.getDirection() === 'horizontal') {
            return parseInt(slider.els.sliderHandle.css('left').replace('px', ''));
        }
        return parseInt(slider.els.sliderHandle.css('top').replace('px', ''));
    },
    "test should determine direction automatically": function () {
        // given
        var slider = this.getSlider();

        // then
        assertEquals('horizontal', slider.getDirection());
    },

    
    "test width of slider should be biggest when direction is horizontal": function () {
        // given
        var slider = this.getSlider();

        // when
        var width = slider.els.slider.width();
        var height = slider.els.slider.height();
        // then

        assertTrue(width > height);

    },
    "test should be able to set initial direction": function () {
        // given
        var slider = this.getSlider({
            direction: 'horizontal',
            width: 30,
            height: 200
        });

        // then
        assertEquals('horizontal', slider.getDirection());
    },
    "test should be able to set min value": function () {
        // given
        var slider = this.getSlider({
            minValue: 5
        });

        // then
        assertEquals(5, slider.getMinValue());

    },
    "test should be able to set max value": function () {
        // given
        var slider = this.getSlider({
            maxValue: 5
        });

        // then
        assertEquals(5, slider.getMaxValue());
    },
    "test should choose max value when set value is greater than max": function () {
        // given
        var slider = this.getSlider({
            minValue: 5,
            maxValue: 10
        });

        // when
        slider.val(15);
        // then
        assertEquals(10, parseInt(slider.val()));

    },
    "test should choose min value when set value is less than min": function () {
        // given
        var slider = this.getSlider({
            minValue: 5,
            maxValue: 10
        });

        // when
        slider.val(2);
        // then
        assertEquals(5, parseInt(slider.val()));
    },
    "test should move slider handle when setting value": function () {
        // given
        var slider = this.getSlider({
            direction: 'horizontal',
            minValue: 1,
            maxValue: 10
        });
        slider.sliderSize = 200;

        // when
        slider.val(3);

        // then
        assertTrue('Pos was ' + this.getHandlePosition(slider), this.getHandlePosition(slider) > 0);
    },

    "test should return horizontal slider size": function () {

        // given
        var slider = this.getSlider({
            direction: 'horizontal'
        });

        // when
        var expectedSize = slider.els.slider.width() - slider.handleSize;

        // then
        assertEquals(expectedSize, slider.getSliderSize());
    },
    "test should return vertical slider size": function () {

        // given
        var slider = this.getSlider({
            direction: 'vertical'
        });
        // when
        var expectedSize = slider.els.slider.height() - slider.handleSize - ludo.dom.getMH(slider.els.slider);

        // then
        assertEquals(expectedSize, slider.getSliderSize());
    },
    "test should position handle correctly": function () {
        // given
        var slider = this.getSlider({
            direction: 'vertical',
            minValue: 0,
            maxValue: 10
        });

        slider.sliderSize = 200;
        slider.handleSize = 5;

        // when
        slider.val(0);

        // then
        assertEquals(200, this.getHandlePosition(slider));

        // when
        slider.val(1);
        // then
        assertEquals(180, this.getHandlePosition(slider));

        // when
        slider.val(10);
        // then
        assertEquals(0, this.getHandlePosition(slider));
    },
    "test should position handle correctly when not starting at zero": function () {
        // given
        var slider = this.getSlider({
            direction: 'vertical',
            minValue: 2,
            maxValue: 12,
            reverse: true
        });

        slider.sliderSize = 200;
        slider.handleSize = 5;

        // when
        slider.val(2);

        // then
        assertEquals(0, this.getHandlePosition(slider));

        // when
        slider.val(3);
        // then
        assertEquals(20, this.getHandlePosition(slider));

        // when
        slider.val(12);
        // then
        assertEquals(200, this.getHandlePosition(slider));
    },
    "test should be able to convert pixels to value": function () {
        // given
        var slider = this.getSlider({
            direction: 'horizontal',
            minValue: 2,
            maxValue: 12
        });
        slider.sliderSize = 200;

        // then
        assertEquals(3, slider.pixelToValue(20));
        assertEquals(3, slider.pixelToValue(21));
        assertEquals(12, slider.pixelToValue(200));
    },
    " test should be able to revert axis": function () {
        // given
        var slider = this.getSlider({
            direction: 'vertical',
            minValue: 2,
            maxValue: 12,
            reverse: true
        });

        slider.sliderSize = 200;
        slider.handleSize = 5;

        // when
        slider.val(12);

        // then
        assertEquals(0, this.getHandlePosition(slider));

        // when
        slider.val(11);
        // then
        assertEquals(20, this.getHandlePosition(slider));

        // when
        slider.val(2);
        // then
        assertEquals(200, this.getHandlePosition(slider));

    },
    "test should be able to move slider handle by clicking on bg": function () {
        // given
        var slider = this.getSlider({
            direction: 'horizontal',
            minValue: 0,
            maxValue: 99
        });
        slider.sliderSize = 200;
        slider.val(2);
        var pos = slider.els.slider.position();
        // when
        var e = {
            target: document.body,
            pageX: 100 + pos.left,
            pageY: 20 + pos.top

        };

        slider.sliderClick(e);

        // then
        assertEquals(50, slider.val());
    }


});