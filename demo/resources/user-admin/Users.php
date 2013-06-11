<?php
/**
 *
 * User: Alf Magne
 * Date: 11.06.13
 * Time: 15:19
 */
class Users extends LudoDBCollection implements LudoDBService
{
    protected $config = array(
        'sql' => 'select u.*, c.name as country_name from user u,country c where u.country = c.ID order by lastname, firstname'
    );

    public function getValidServices(){
        return array("read");
    }

    public function validateServiceData($service, $data){
        return empty($data);
    }

    public function validateArguments($service, $arguments){
        return empty($arguments);
    }
}
