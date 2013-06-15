<?php
/**
 * Comment pending.
 * User: Alf Magne Kalleland
 * Date: 15.06.13
 * Time: 15:27
 */
class LudoDBEmpty implements LudoDBService
{
    public function getValidServices(){
        return array('save');
    }

    public function save(){
        return array();
    }

    public function validateArguments($service, $arguments){
        return true;
    }

    public function validateServiceData($service, $data){
        return true;
    }

    public function shouldCache($service){
        return false;
    }

    public function getOnSuccessMessageFor($service){
        return "Successful !!!";
    }
}
