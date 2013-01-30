<?php
$sub = true;
$pageTitle = 'Relative layout';
require_once("../includes/demo-header.php");
?>
<body>
<style type="text/css">
    div.customView {
        border: 1px solid #C0C0C0;

        padding: 3px;
        background-color: #FFF;
    }
</style>
<script type="text/javascript" class="source-code">
    var d = new Date().getTime();
    var w = new ludo.Window({
        left:20, top:20,
        title:'Relative layout',
        width:600, height:600,
        layout:{
            type:'relative'
        },
        css:{
            border:0
        },
        children:[
            { name:'leftMenu',
                type:'FramedView',
                id:'menuView',
                collapsible:'left',
                title:'Minimizable',

                css:{
                    'background-color' : '#FFF'
                },
                html:"<b>Layout:</b><br>left menu<br>height:'matchParent', width:150, alignParentLeft:true, resize:right",
                layout:{
                    height:200,
                    width:150,
                    alignParentLeft:true,
                    resize:['below','right'],
                    maxHeight:300
                }
            },
            {
               name : 'leftLowerMenu', cls:'customView',
               html : 'Below left menu',

                layout:{
                    below:'leftMenu',
                    sameWidthAs:'leftMenu',
                    alignLeft:'leftMenu',
                    fillDown:true

                }
            },
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

    new ludo.Window({
        left:600, top:100, height:300, width:300,
        title:'Sign In',
        layout:{
            type:'relative'
        },
        css:{
            'background-color':'#FFF'
        },
        children:[
            {
                layout:{
                    type:'linear',
                    orientation:'vertical',
                    centerInParent:true,
                    width:200,
                    height:130
                },
                css:{
                    border:'1px solid #C0C0C0',
                    'background-color':'#f5f5f5',
                    padding:3
                },
                children:[
                    {
                        height:25, html:'Box centered in parent'
                    },
                    {
                        type:'form.Text', label:'Username', name:'username'
                    },
                    {
                        type:'form.Password', label:'Password', name:'password'
                    },
                    {
                        type:'form.Button', value:'Sign In'
                    }
                ]

            }
        ]
    });
    ludo.util.log(new Date().getTime() - d);
</script>
</body>
</html>