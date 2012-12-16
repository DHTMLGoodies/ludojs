<?php
require_once("../../jsonwrapper/jsonwrapper.php");

$data = array('success' => true, 'message' => '', 'data' => array());
echo utf8_encode(json_encode($data));