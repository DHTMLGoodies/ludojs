TestCase("MenuTest", {

    "test should be able to specify menu layout": function(){
        // given
        var cmp = this.getMenuComponent();

    },

    getMenuComponent:function(){
        return new ludo.View({
           layout:{
               type:'Menu',
               orientation:'vertical',
               children:[
                   { name:'a', html : 'A'},
                   { name:'b', html : 'B'},
                   { name:'c', html : 'C'},
                   { name:'d', html : 'D'},
                   { name:'e', html : 'E'}
               ]
           }
        });
    }

});