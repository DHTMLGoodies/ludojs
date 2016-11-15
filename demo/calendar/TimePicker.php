<?php
$sub = true;
$pageTitle = 'Time Picker demo';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var time = {
        hour: new Date().getHours(),
        minute: new Date().getMinutes()
    };

    time.timeString = (time.hour < 10 ? "0" : "") + time.hour + ":" + (time.minute<10 ? "0" : "") + time.minute;

    function showTimePicker() {
        ludo.get('timePickerWindow').show();
        ludo.get('timePickerWidget').val(time.timeString);

    }

    var view = new ludo.View({
        renderTo: document.body,
        layout:{
            type:'tabs'
        },
        children:[
            {
                title: "Time Picker Demo",
                layout: {
                    type: 'linear', orientation: 'horizontal'
                },
                children: [
                    {
                        type: 'form.DisplayField', id: 'time', label: 'Time', value: time.timeString,
                        layout: {width: 150}
                    },
                    {
                        type: 'form.Button',
                        value: 'Select Time',
                        listeners: {
                            'click': showTimePicker
                        }
                    }
                ]
            },
            {
                type: 'SourceCodePreview',
                css:{ padding: 10 }
            }

        ]


    });

    var w = new ludo.Window({
        hidden: false,
        id: 'timePickerWindow',
        alwaysInFront:true,
        left: 50, top: 50,
        title: 'Time Picker',
        width: 300, height: 480,
        layout: {
            type: 'linear', orientation: 'vertical'
        },
        children: [
            {
                id: 'TheTime',
                css: {
                    "font-size": 50,
                    "text-align": "center",
                    "line-height": "95px", color: "#fff",
                    '-webkit-user-select': 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                },
                elCss: {"background-color": "#669900"},
                layout: {height: 100}
            },
            {
                type: 'calendar.TimePicker',
                id: 'timePickerWidget',
                hour: 17,
                minute: 35,
                css: {
                    padding: 5 // Spacing
                },
                layout: {weight: 1},
                listeners: {
                    'time': function (hour, minutes, hourString) {
                        ludo.get('timePickerWindow').updateTime(hour, minutes, hourString);
                    }
                }
            },
            {
                height: 30,
                layout: {
                    type: 'linear', orientation: 'horizontal'
                },
                children: [
                    {weight: 1},
                    {
                        type: 'form.Button',
                        value: 'CANCEL',
                        listeners:{
                            'click': function(){
                                ludo.get('timePickerWindow').hide();
                            }
                        }
                    },
                    {
                        type: 'form.Button',
                        value: 'OK',
                        elCss: {
                            'margin-right': 5
                        },
                        listeners: {
                            'click': function () {
                                var view = ludo.get('timePickerWidget');
                                time.hour = view.hour;
                                time.minute = view.minute;
                                time.timeString = view.getTimeString();
                                ludo.get('time').val(time.timeString);
                                ludo.get('timePickerWindow').hide();
                            }
                        }
                    }
                ]
            }
        ],
        // A custom function which will be a member of the Window and can be called using
        // ludo.get('timePickerWindow').updateTime(hour, minutes);
        updateTime: function (hour, minutes, hourString) {
            ludo.get('TheTime').html(hourString);
        }
    });
</script>
</body>
</html>