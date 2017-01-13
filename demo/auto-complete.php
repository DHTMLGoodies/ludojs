<?php
$sub = false;
$pageTitle = 'Searchable list';
require_once("includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">
    var v = new ludo.View({
        renderTo: document.body,
        layout:{
            width:'matchParent', height:'matchParent'
        }
    });
    var svg = v.svg();

    var circle = svg.$('circle', { cx: 100, cy: 100, r: 50 });
    circle.css('fill', '#ff0000');
    svg.append(circle);
    circle.animate({
        cx:300, cy: 200
    },{
        duration: 1000,
        complete:function(){
            console.log('completed');
        }
    });

</script>
</body>
</html>