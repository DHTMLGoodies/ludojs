<?php
/**
 * Controller for Ajax requests
 * User: Alf Magne
 * Date: 11.02.13
 * Time: 14:44
 */

require_once __DIR__."/autoload.php";
ini_set('display_errors','on');

if(file_exists("connect.php")){
    require("connect.php");

    $user = new User();
    if(!$user->exists()){
        $util = new LudoDBUtility();
        $util->dropAndCreate(array("Country","User"));
    }
}


$handler = new LudoDBRequestHandler();
$request = array(
    "request" => $_POST['request'],
    "data" => isset($_POST['data']) ? $_POST['data'] : null
);
echo $handler->handle($request);