<?php
$pageTitle = 'Wizard demo';
require_once("includes/demo-header.php");
?>
<body>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        id:'myWindow',
        left:50, top:50,
        width:350, height:320,
        title:'',
        layout:'fill',

        children:[
            {
                type:'View',
                id:'wizardView',
                layout:{
                    type:'card',
                    animate:true
                },
                animate:true,
                animationDuration:250,
                titleBar:false,
                containerCss:{
                    border:0
                },
                form:{
                    url:'resources/wizard.php',
                    name:'user-details'
                },
                name:'deck',
                children:[
                    {
                        name:'personalia',
                        layout:{
                            type:'linear',
                            orientation:'vertical'
                        },
                        children:[
                            { type:'form.Text', name:'firstname', label:'Firstname', required:true},
                            { type:'form.Text', name:'lastname', label:'Lastname', required:true},
                            { type:'form.Spinner', name:'age', label:'Age', stretchField:false, maxLength:3, value: 25, fieldWidth:50,minValue:8,maxValue:120 },
                            { type:'form.Textarea', name:'address', label:'Address', layout:{ weight:1 } },
                            { type:'form.Text', name:'zipcode', label:'Zip code'},
                            { type:'form.Text', name:'city', label:'City'},
                            {
                                label:'Country',
                                name:'country',
                                type:'form.FilterText',
                                emptyItem:{
                                    id:'', title:'Select country'
                                },
                                filterOnServer:false,
                                dataSource:{
                                    url:'resources/auto-complete.php',
                                    query:{
                                        'getAllCountries':1
                                    }
                                }
                            },
                            { height:5 }

                        ]
                    },
                    {
                        name:'contact',
                        children:[
                            { type:'form.Text', name:'mobile', label:'Mobile phone'},
                            { type:'form.Email', name:'email', label:'E-mail'}
                        ]
                    }
                ],
                listeners:{
                    'showcard':function (deck, card) {
                        ludo.get('myWindow').setTitle('Step ' + (deck.getIndexOfVisibleCard() + 1) + ' of ' + deck.getCountCards())
                    }
                }
            }
        ],
        buttonBar:{
            align:'left', children:[
                {
                    type:'card.ProgressBar', weight:1, applyTo:'wizardView'
                },
                {
                    type:'card.PreviousButton'
                },
                {
                    type:'card.NextButton', autoHide:true
                },
                {
                    type:'card.FinishButton'
                }
            ]}
    });
</script>
</body>
</html>