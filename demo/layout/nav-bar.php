<?php
$sub = true;
$pageTitle = 'Slide in layout';
require_once("../includes/demo-header.php");
?>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/slide-in.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/effect.js"></script>

<script type="text/javascript" class="source-code">
    var v = new ludo.Window({
        title:'Slide in layout demo',

        layout:{
            left:10, top:10,
            width:600,
            height:400,
            type:'tabs'

        },
        children:[
            {
                title:'Slide In Demo',
                layout:{

                    type:'linear',
                    orientation:'vertical'
                },
                children:[
                    {
                        type:'form.Button',
                        value:'Toggle Menu',
                        size:'l',
                        icon:'../../images/form/menu-icon-large.png',
                        layout:{
                            height:50,
                            width:100
                        },
                        listeners:{
                            'click':function () {
                                ludo.get('navBar').getLayout().toggle();
                            }
                        }
                    },
                    {
                        id:'navBar',
                        css:{
                            'border-top':'1px solid #d7d7d7'
                        },
                        layout:{
                            weight:1,
                            type:'NavBar' // Slide In Layout
                        },
                        children:[
                            {
                                layout:{
                                    width:200,
                                    height:'100%',
                                    type:'Menu',
                                    orientation:'vertical'
                                },
                                elCss:{
                                    border:0,
                                    padding:2,
                                    'border-right':'1px solid #d7d7d7'
                                },
                                children:[
                                    {
                                        html:"Front page",
                                        action:'front-page.php'
                                    },
                                    {
                                        html:"Pages"
                                    },
                                    { html:"Page3", action:'page-3.php' }
                                ]
                            },
                            {

                                type:'grid.Grid',
                                layout:{

                                },
                                columns:{
                                    'country':{
                                        heading:'Country',
                                        sortable:true,
                                        movable:true,
                                        renderer:function (val) {
                                            return '<span style="color:blue">' + val + '</span>';
                                        }
                                    },
                                    'capital':{
                                        heading:'Capital',
                                        sortable:true,
                                        movable:true
                                    },
                                    population:{
                                        heading:'Population',
                                        movable:true
                                    }
                                },

                                dataSource:{
                                    url:'../resources/grid-data.json',
                                    listeners:{
                                        select : function(record){
                                            ludo.util.log(record);
                                        }
                                    }

                                }

                            }
                        ]
                    }

                ]
            },
            { type : 'SourceCodePreview' }

        ]

    })
</script>

</body>
</html>