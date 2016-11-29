TestCase("LabelElementTest", {

    "test should render label and field": function(){
        // given
        var labelElement = new ludo.form.LabelElement({
            label:{
                label:'myLabel'  
            },
            field:{
                type:'form.Number',
                name:'myField'
            },
            renderTo:document.body,
            layout:{
                width:200,
                height:50
            }
        });

        // then
        assertEquals(2, labelElement.children.length);
        assertEquals('form.Label', labelElement.children[0].type);
        assertEquals('form.Number', labelElement.children[1].type);


    },

    "test label should be label for field": function(){
        // given
        var labelElement = new ludo.form.LabelElement({
            label:{
                label:'myLabel',
                type:'form.Label'
            },
            field:{
                type:'form.Number',
                name:'myField'
            },
            renderTo:document.body,
            layout:{
                width:200,
                height:50
            }
        });

        // when
        var label = labelElement.children[0];

        assertEquals('el-myField', label.els.label.attr("for"));

    }

});