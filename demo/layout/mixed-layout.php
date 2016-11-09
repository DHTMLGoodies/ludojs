<?php
$sub = true;
$pageTitle = 'Relative layout';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-vertical.js"></script>
<body>
<style type="text/css">
    div.customView {
        border: 1px solid #C0C0C0;
        padding: 3px;
        background-color: #FFF;
    }

</style>
<link rel="stylesheet" type="text/css" href="<?php echo $prefix; ?>../css-source/layout/collapse-bar.css">
<script type="text/javascript" class="source-code">
    var d = new Date().getTime();
    var w = new ludo.Window({
        left:20, top:20,
        id:'myWindow',
        title:'Relative layout',
        width:600, height:600,
        layout:{
            type:'relative',
            collapseBar : ['left']
        },
        css:{
            border:0
        },
        children:[
            { name:'leftMenu',
                type:'View',
                id:'menuView',
                css:{
                    'background-color':'#d7d7d7',
                    'border-top' : '1px solid #d7d7d7'
                },
                children:[
                    {
                        title:'View 1',
                        type:'FramedView',
                        layout:{
                            weight:1,
                            collapsible:'left',
                            collapseTo:'myWindow'
                        },
                        css:{
                          'background-color' : '#FFF'
                        },
                        elCss:{
                            'border-top' : 0
                        }
                    },
                    {
                        title : 'View 2',
                        type:'FramedView',
                        layout:{
                            weight:1,
                            collapsible:'left',
                            collapseTo:'myWindow'
                        },
                        css:{
                          'background-color' : '#FFF'
                        },
                        elCss:{
                            'border-top' : 0
                        }
                    },
                    {
                        title:'View 3',
                        type:'FramedView',
                        minimizable:false,
                        html:'I am not collapsible',
                        layout:{
                            weight:1
                        },
                        css:{
                            padding:5,
                            'background-color' : '#fff'
                        },
                        elCss:{
                            'border-bottom' : 0,
                            'border-top' : 0
                        }
                    }

                ],
                layout:{
                    height:'matchParent',
                    type:'linear',
                    orientation:'vertical',
                    width:150,
                    alignParentTop:true,
                    alignParentLeft:true,
                    resize:['right'],
                    maxWidth:200
                }},
            { name:'rightMenu', cls:'customView', html:"Item 1<br>Item 2<br>Item 3<br>Item 4<br>Item 5<br><br><b>Layout:</b><br>alignParentTop:true, alignParentRight:true, width:150, above:'bottomMenu', fillUp:true",
                layout:{ alignParentTop:true, alignParentRight:true, width:150, above:'bottomMenu', fillUp:true, resize:['left'] }},
            { name:'bottomMenu', cls:'customView', html:"Bottom menu box<br><b>Layout:</b> height:50, alignParentBottom:true,rightOf:'leftMenu',fillRight:true,resize:above", layout:{
                height:50, alignParentBottom:true, rightOf:'leftMenu', fillRight:true, resize:['above'], maxHeight:100
            }},
            {
                name:'c', html:"Main view<br><br><b>Layout:</b><br>leftOf:'rightMenu',above:'bottomMenu',rightOf:'leftMenu', fillUp:true", cls:'customView',
                layout:{
                    leftOf:'rightMenu', above:'bottomMenu', rightOf:'leftMenu', fillUp:true
                }
            }

        ],
        buttonBar:{
            children:[
                { type:'form.Button', value:'OK', name:'ok', layout:{ leftOf:'cancel'} },
                { type:'form.Button', value:'Cancel', name:'cancel', layout:{ 'alignParentRight':true} }
            ]
        }
    });

    ludo.util.log(new Date().getTime() - d);
</script>
</body>
</html>