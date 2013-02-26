TestCase("SelectTest", {
    "test should be able to set options": function(){
        // given
        var s = new ludo.form.Select({
            options:[
                { value:'1', text:'Option a'},
                { value:'2', text:'Option b'}
            ]
        });

        // then
        assertEquals(2, this.getOptions(s).length);
        assertEquals(1, this.getOptions(s)[0].value);
        assertEquals('Option a', this.getOptions(s)[0].text);
    },

    "test should be able to add empty item": function(){
        // given
        var s = new ludo.form.Select({
            emptyItem:{
                value:'',
                text : 'My Text'
            },
            options:[
                { value:'1', text:'Option a'},
                { value:'2', text:'Option b'}
            ]
        });

        // then
        assertEquals(3, this.getOptions(s).length);
        assertEquals(1, this.getOptions(s)[1].value);
        assertEquals('Option a', this.getOptions(s)[1].text);

    },

    "test should be able to use custom fields for value and text": function(){
        // given
        var s = new ludo.form.Select({
            valueKey:'id',
            textKey:'name',
            options:[
                { id:'1', name:'Option a'},
                { id:'2', name:'Option b'}
            ]
        });

        // then
        assertEquals(2, this.getOptions(s).length);
        assertEquals(1, this.getOptions(s)[0].value);
        assertEquals('Option a', this.getOptions(s)[0].text);

    },

    "test should re populate select box when data source is sorted": function(){
        // given
        var s = new ludo.form.Select({
            options:[
                { value:'1', text:'Option a'},
                { value:'2', text:'Option b'}
            ]
        });

        // when
        s.getDataSource().by('text').descending().sort();

        // then
        assertEquals(2, this.getOptions(s).length);
        assertEquals(2, this.getOptions(s)[0].value);
        assertEquals('Option b', this.getOptions(s)[0].text);
    },

    getOptions:function(s){
        return s.getFormEl().getElements('option');
    }

});