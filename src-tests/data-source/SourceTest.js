/**
 * Created with JetBrains PhpStorm.
 * User: xait0020
 * Date: 23.04.13
 * Time: 00:18
 * To change this template use File | Settings | File Templates.
 */

TestCase("SourceTest", {


    "test should be able to define shim to show when sending requests":function () {
        // given
        var v = new ludo.View({
            renderTo:document.body,
            dataSource:{
                type:'dataSource.JSON',
                resource:'TestResource',
                autoload:false,
                shim:{
                    'txt' : 'Loading content'
                }
            }
        });

        // when
        v.getDataSource().loadUrl('myPage.php');
        var el = $(document.body).find('.ludo-loader-shim').first();
        // then
        assertNotNull(document.body.innerHTML,el);
        assertEquals( 'div', el.prop("tagName").toLowerCase());
    },

    "test should be able to add custom function ": function(){

        
    }

});