TestCase("LayoutWrapTest", {

    "test should find wrap height when there are children": function () {

        // given
        var view = new ludo.View({
            id:'mainView',
            renderTo: document.body,
            layout: {
                type: 'linear',
                orientation: 'vertical',
                height: 'wrap'
            },
            children: [
                {
                    layout: {
                        height: 200
                    }
                }
            ]
        });

        // when
        var height = view.getBody().height();

        // then
        assertEquals(200, height);


    }


});