<?php
$sub = true;
$pageTitle = 'Popup layout';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<h1>Click button to see the popup layout in action</h1>
<script type="text/javascript">
    ludo.factory.createNamespace('PopupDemo');
    PopupDemo.UserWindow = new Class({
        Extends:ludo.Window,
        minimizable:false,
        closable:false,
        resizable:false,
        children:[
            { type:'form.Text', label:'Username', id:'username', name:'username', value:'Mike' },
            { type:'form.Password', label:'Password' },
            { type:'form.Button', value:'Sign in', name:'loginButton'
            }
        ],
        formConfig:{
            fieldWidth:100
        },
        layout:{
            type:'linear',
            orientation:'vertical'
        },
        ludoEvents:function () {
            this.parent();
            this.child['loginButton'].addEvent('click', this.login.bind(this));
        },

        login:function () {
            new ludo.Notification({
                html:'You have successfully signed in',
                autoDispose:true
            });
            this.fireEvent('login', this.child['username'].getValue());
        }
    });
    PopupDemo.UserInfo = new Class({
        Extends:ludo.View,
        css:{
            'background-color':'#FFF',
            'border':'1px solid #d7d7d7',
            'padding':5
        },
        setUsername:function (username) {
            this.setHtml('Logged in as ' + username);
        }
    });
    PopupDemo.PopupLayoutDemo = new Class({
        Extends:ludo.form.Button,
        value:'Sign in',
        layout:{
            type:'popup'
        },

        children:[
            {
                id:'myWindow',
                type:'PopupDemo.UserWindow',
                title:'Sign in',
                name:'loginWindow',
                layout:{
                    alignRight:'parent',
                    below:'parent',
                    width:300,
                    height:'wrap',
                    offsetY:5,
                    offsetHeight:5
                }
            },
            {
                name:'userInfo',
                type:'PopupDemo.UserInfo',
                layout:{
                    alignRight:"parent",
                    alignTop:"parent",
                    width:200,
                    height:50
                }
            }
        ],

        __rendered:function () {
            this.parent();
            this.addEvent('click', this.toggleView.bind(this));
            this.child['loginWindow'].addEvent('login', this.showUserInfo.bind(this));
        },

        showUserInfo:function (userName) {
            this.child['userInfo'].show();
            this.child['userInfo'].setUsername(userName);
            this.child['loginWindow'].hide();
            this.hide();
        },

        toggleView:function () {
            if (this.child['loginWindow'].isHidden()) {
                this.child['loginWindow'].show();
            } else {
                this.child['loginWindow'].hide();
            }
        }
    });

    var v = new PopupDemo.PopupLayoutDemo({
        id:'myView',
        renderTo:document.body,
        layout:{
            alignTop:document.body,
            alignRight:document.body,
            width:100,
            height:25,
            offsetX:-5,
            offsetY:5
        }
    });
</script>
</body>
</html>