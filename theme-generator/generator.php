<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 24/11/2016
 * Time: 07:31
 */

/*
 * 500 #2196F3
50#E3F2FD
100#BBDEFB
200#90CAF9
300#64B5F6
400#42A5F5
500#2196F3
600#1E88E5
700#1976D2
800#1565C0
900


500 #009688
50#E0F2F1
100#B2DFDB
200#80CBC4
300#4DB6AC
400#26A69A
500#009688
600#00897B
700#00796B
800#00695C
900 004D40

 */

$colors = array(
    "C100" => "B2DFDB",
    "C200" => "80CBC4",
    "C300" => "80CBC4",
    "C400" => "26A69A",
    "C500" => "26A69A",
    "C600" => "004D40",
    "C700" => "004D40",
    "C800" => "004D40",
    "C900" => "004D40",
    "M100" => "e3e3e3",
    "M400" => "424242",
    "M700" => "151515",
    "M900" => "111111",

);

$data = file_get_contents("template.css");

foreach($colors as $key=>$color){
    $data = str_replace("[".$key."]", "#" . $color, $data);
}


file_put_contents("../css/ludojs-generated.css", $data);