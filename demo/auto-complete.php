<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>ludo Web Tools - Filter Text demo</title>

    <script type="text/javascript" src="../mootools/mootools-core-1.4.1.js"></script>
    <script type="text/javascript" src="../mootools/mootools-more-1.4.0.1.js"></script>
    <script type="text/javascript" src="../js/ludo-all.js"></script>

    <script type="text/javascript" src="code-highlight/code-highlight.js"></script>
    <link rel="stylesheet" href="../css/ludo-all.css" type="text/css">
    <link rel="stylesheet" href="../css/ludo-all-blue-skin.css" type="text/css">
    <style type="text/css">
        input, textarea, body {
            font-family: arial;
            font-size: 12px;
        }
    </style>
</head>

<script type="text/javascript" class="source-code">

new ludo.Window({
    width : 400,
    height: 120,
    left:200,
    title: 'Auto Complete demo',
    layout : 'rows',
    children:[
        {
            height:30,
            html : 'Loading initial data from server and filter on client'
        },
        {
            type:'form.FilterText',
            name:'country',
            label:'Country',
            stretchField:true,
            height:30,
            emptyItem:{
                id:'',
                title:'Select country'
            },
            filterOnServer:false,
            dataSource:{
                url:'resources/auto-complete.php',
                query : {
                    'getAllCountries' : 1
                }
            }
        }
    ]
});

new ludo.Window({
    width : 400,
    height: 120,
    left:250,
    top:200,
    title: 'Auto Complete demo - filter on server',
    layout : 'rows',
    children:[
        {
            type:'form.FilterText',
            name:'country2',
            label:'Country',
            value:1,
            stretchField:true,
            height:30,
            emptyItem:{
                id:'',
                title:'Select country'
            },
            filterOnServer:true,
            remote:{
                url:'resources/auto-complete.php',
                queryParam:'query',
                queryParamRecord:'getCountry'
            }
        }
    ]
});

</script>
</body>
</html>