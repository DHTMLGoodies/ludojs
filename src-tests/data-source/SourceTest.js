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
            dataSource:{
                url:'mySource',
                resource:'TestResource',
                autoload:false,
                shim:{
                    'txt' : 'Loading content'
                }
            }
        });

        // when
        v.getDataSource().load();
        var el = document.getElement('.ludo-loader-shim');
        // then
        assertNotNull(el);
        assertEquals('div', el.tagName);
    }

});