<?php
$sub = true;
$pageTitle = 'Grid demo';
require_once("../includes/demo-header.php");
?>
<body>

<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        left: 50, top: 50,
        title: 'Grid - capital and population',
        width: 500, height: 370,
        layout: 'fill',
        children: [
            {

                type: 'grid.Grid',
                weight: 1,

                columns: {
                    'country': {
                        heading: 'Country',
                        sortable: true,
                        movable: true,
                        renderer: function (val) {
                            return '<span style="color:blue">' + val + '</span>';
                        }
                    },
                    'capital': {
                        heading: 'Capital',
                        sortable: true,
                        movable: true
                    },
                    population: {
                        heading: 'Population',
                        movable: true
                    }
                }
                ,
                dataSource: {
                    url: '../resources/grid-data.json',
                    listeners: {
                        select: function (record) {
                            console.log(record);
                        }
                    }

                }

            }
        ]
    });
</script>
</body>
</html>