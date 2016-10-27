/**
 * Created by alfmagne1 on 27/10/2016.
 */
TestCase("TableLayoutTest", {

    setUp: function () {
        document.body.innerHTML = '';
    },

    getTableLayoutViews: function () {
        return new ludo.View({
            renderTo: document.body,
            layout: {
                type: 'table',
                width: 600,
                columns: [
                    {width: 100}, {width: 200}, {weight: 1}, { weight: 2 }
                ]
            },
            children: [
                // First row
                {id: "child1_1", html: "Child 1 "},
                {id: "child1_2", html: "Child 2 "},
                {id: "child1_3", html: "Child 2 ", layout: {height: 100}},
                {id: "child1_4", html: "Child 2 ", layout: {height: 100, rowspan : 3 }},
                // second row
                {id: "child2_1", html: "Child 2 ", layout: { row: true, colspan : 2 }},
                {id: "child2_3", html: "Child 2 "},
                // third row
                {id: "child3_1", html: "Child 2 ", layout: { row: true }},
                {id: "child3_2", html: "Child 2 "},
                {id: "child3_3", html: "Child 2 "},
                {id: "child3_4", html: "Child 2 ", layout: { rowspan : 2 }},
                // third row
                {id: "child4_1", html: "Child 2 ", layout: { row: true }},
                {id: "child4_2", html: "Child 2 "},
                {id: "child4_3", html: "Child 2 "}

            ]
        });
    },

    "test should find width of colspan columns": function(){
        // given
        var v = this.getTableLayoutViews();

        // when
        var view = ludo.get('child2_1');

        // then
        assertEquals(300, view.getEl().outerWidth());

    },

    "test should find width of main view": function(){
        // given
        var v = this.getTableLayoutViews();

        // then
        assertEquals(600, v.getEl().outerWidth());

    },

    "test should find columns": function(){
        // given
        var v = this.getTableLayoutViews();

        // then
        assertEquals(4, v.getLayout().cols.length);
    },

    "test should find total weight": function(){
        // given
        var v = this.getTableLayoutViews();

        // then
        assertEquals(3, v.getLayout().totalWeight);
    },

    "test should find fixed width": function(){
        // given
        var v = this.getTableLayoutViews();

        // then
        assertEquals(300, v.getLayout().fixedWidth);
    },

    "test should put children inside table": function () {
        // given
        var v = this.getTableLayoutViews();

        // when
        var view = ludo.get("child1_1");

        // then
        assertNotUndefined(view);
        assertEquals("td", view.getEl().parent().prop("tagName").toLowerCase());
    },

    "test shold resize children": function(){
        // given
        var v = this.getTableLayoutViews();

        /**
         width: 600,
         columns: [
         {width: 100}, {width: 200}, {weight: 1}, { weight: 2 }
         ]

         */
        // then
        assertEquals(100, ludo.get("child1_1").getEl().outerWidth());
        assertEquals(200, ludo.get("child1_2").getEl().outerWidth());
        assertEquals(100, ludo.get("child1_3").getEl().outerWidth());
        assertEquals(200, ludo.get("child1_4").getEl().outerWidth());

    },

    "test should be able to set rowspan": function(){


    }

});