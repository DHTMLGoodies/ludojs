<?php
$pageTitle = 'Components using singleton JSON data-source';
require_once("includes/demo-header.php");
?>


<script type="text/javascript" class="source-code">
/** Custom dataSource class used by windows below */
ludo.dataSource.MySource = new Class({
    Extends: ludo.dataSource.JSON,
    type: 'dataSource.MySource',
    /** Register dataSource as singleton in order to have only one remote request */
    singleton:true,
    url : 'resources/singleton-dataSource.php',
    query : {
        getData : 1
    }
});

var win1 = new ludo.Window({
    left : 20,
    top : 40,
    maxHeight:500,
    title : 'Window 1',
    tpl: '<h3>{title}</h3>{body}',
    /** Refering to dataSource below*/
    dataSource : { type: 'dataSource.MySource' }
});

var win2 = new ludo.Window({
    left: 200,
    top:160,
    title : 'Window 2',
    tpl: '<h3>{title}</h3>{body}',
    dataSource : { type: 'dataSource.MySource' }
});

/** The server returns content in this format
 *
 * {"success":true,"message":"","data":{"title":"Components using the same dataSource","body":"Data from server at time: 2012-04-12 21:37:47"}}
 *
 */
</script>
<a href="#" onclick="win1.getDataSource().load();return false">Reload dataSource</a>
</body>
</html>