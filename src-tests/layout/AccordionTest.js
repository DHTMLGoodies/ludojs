/**
 * Created by alfmagne1 on 07/11/2016.
 */
TestCase("layout.Accordion", {

    "test should not show hidden views": function(){
        var v = this.getAccordion();

        var children = v.getBody().find('.ludo-body');

        assertEquals(v.getBody()[0].innerHTML, 3, children.length);

    },

    "test should by default expand first visible child": function(){
        // given
        var v = this.getAccordion();

        var titles = v.getBody().find('.ludo-framed-view-titlebar');

        var child = $(titles[0]);
        // when
        var title = child.find('.ludo-accordion-expanded');

        // then
        assertEquals(child[0].innerHTML, 0, title.length);

        child = $(titles[1]);
        // when
        title = child.find('.ludo-accordion-expanded');

        // then
        assertEquals(1, child.find('.ludo-accordion-collapsed').length);
        assertEquals(0, title.length);

    },

    getAccordion:function(){

        if(!ludo.get('accordion')){
            new ludo.View({
                id:'accordion',
                renderTo:document.body,
                layout:{
                    width:500,height:800, type:'accordion'
                },
                children:[
                    {
                        id:'firstHidden',
                        hidden:true,
                        title:'Hidden',
                        html:'Hidden body'
                    },
                    {
                        id:'second',
                        title:'Second',
                        html:'Second body'
                    },
                    {
                        id:'third',
                        title:'Second',
                        html:'Second body'
                    },
                    {
                        id:'fourthHidden',
                        hidden:true,
                        title:'Fourth',
                        html:'Fourth body'
                    },
                    {
                        id:'fifth',
                        title:'Fifth',
                        html:'Fifth body'
                    }
                ]
            })

        }

        return ludo.get('accordion');

    }

});