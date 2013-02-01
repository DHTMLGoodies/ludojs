<?php
error_reporting(E_ALL);
ini_set('display_errors', 'on');
require_once("../php-progress-bar/progress-bar.class.php");
require_once("../db-config.php");

$request = $_POST['request'];


if(isset($request['saveForm'])){

    ProgressBar::setCurrentProgressBarId($_POST['progressBarId']);
    ProgressBar::setTotalSteps(20);
    $data = array('success' => true, 'message' => '', 'data' => array());
    echo utf8_encode(json_encode($data));
}

if(isset($request['id']) && $request['id'] == 'getProgress'){

    ProgressBar::setCurrentProgressBarId($request['data']['progressBarId']);

    ProgressBar::increment('Dummy text '. date("H:i:s"), 5);

    $data = array('success' => true, 'message' => '', 'data' => ProgressBar::getStatus());
    echo utf8_encode(json_encode($data));


}