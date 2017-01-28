<?php
$pageTitle = 'Drag and Drop demo';
require_once("includes/demo-header.php");
?>



















<style type="text/css">
.ludo-shim {
    border: 15px solid #AAA;
    background-color: #DEF;
    margin: 5;
    opacity: .5;
    border-radius: 5px;
}
.box{
    position:absolute;
    border-radius:5px;
    z-index:100;
    padding:5px;
}
</style>
<div id="myDiv" style="position:absolute;z-index:5000;width:100px;height:100px;border:1px solid #000;background-color:#DEF;left:50px;top:50px"></div>
<script type="text/javascript">
new ludo.effect.Effect().fly({
	el: 'myDiv',
	duration:1,
	to:{ x:500, y: 300 },
    onComplete:function(){
        new ludo.effect.Effect().fly({
        	el: 'myDiv',
        	duration:1,
        	to:{ x:600, y: 50 }
        });
    }
});
</script>
<script type="text/javascript" class="source-code skip-copy">
	var zIndex = 200;
	function getZIndex() {
		return ++zIndex;
	}


	function getColor(offset) {
		return '#' + getColorValue(offset) + getColorValue(offset) + getColorValue(offset);
	}
	function getColorValue(offset) {
		var multiplier = 255 - offset;
		var color = (offset + Math.round(Math.random() * multiplier)).toString(16);
		if (color.length == 1)color = '0' + color;
		return color;
	}


	var dragDrop = new ludo.effect.DragDrop({
		useShim:true,
        autoHideShim:false
	});

	dragDrop.addEvent('before', function (dragged, dragDrop) {
		jQuery(dragged.el).css('z-index', getZIndex());
        dragDrop.setShimText(dragged.txt);
	});
    dragDrop.addEvent('end', function(dragged, dragDrop){
        if(dragged.shouldFlyBack){
            dragDrop.flyBack();
        }else{
            dragDrop.flyToShim();
        }

    });
    dragDrop.addEvent('animationComplete', function(dr){
		console.log("complete");
		console.log(dragDrop);
        dragDrop.hideShim();
    });
	for (var i = 0; i < 10; i++) {
		var el = jQuery('<div>');
        el.addClass('box');
		el.css({
			width:100 + Math.round(Math.random() * 200),
			height:100 + Math.round(Math.random() * 200),
			left:20 + Math.round(Math.random() * 400),
			top:20 + Math.round(Math.random() * 400),
			border:'1px solid ' + getColor(1),
			'background-color':getColor(200)
		});
        if(i%2==0){
            el.html('I will fly back');
        }
		jQuery(document.body).append(el);
		dragDrop.add({
			el:el,
			txt:'Box number ' + (i + 1),
            shouldFlyBack:(i%2==0)
		});
	}


</script>


</body>
</html>