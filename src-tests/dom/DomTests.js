TestCase("DomTests",{

    "tests should resize properly": function(){


        var v = new ludo.View({
            renderTo:document.body,
            layout:{
                width:100,
                height:100
            }
        });

        // then
        assertEquals(100, v.$b().height())
    },


    "test should resize 2": function(){

        var v = new ludo.View({
            renderTo:document.body,
            css:{
                'padding' : 5
            },
            layout:{
                width:100,
                height:100
            }
        });

        assertEquals('90px', v.$b().css('height'));


        v = new ludo.View({
            renderTo:document.body,
            css:{
                'padding' : 5,
                'padding-bottom' : 0
            },
            layout:{
                width:100,
                height:100
            }
        });

        assertEquals('95px', v.$b().css('height'));
        v = new ludo.View({
            renderTo:document.body,
            css:{
                'padding' : 5,
                'margin-bottom' : 5
            },
            layout:{
                width:100,
                height:100
            }
        });

        assertEquals('85px', v.$b().css('height'));
        
    },

    "test should resize children": function(){
        v = new ludo.FramedView({
            title:'tester',
            renderTo:document.body,
            css:{
                'padding' : 5,
                'margin-bottom' : 5
            },
            layout:{
                width:1000,
                height:1000,
                type:'fill'
            },
            children:[
                {
                    id:'child1'

                }
            ]
        });

        // when
        var child = ludo.$('child1');

        var h = v.$b().height();

        // then
        assertEquals(h + 'px', child.$b().css('height'))


    }

});