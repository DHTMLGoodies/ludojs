<?php
/**
 * Comment pending.
 * User: Alf Magne Kalleland
 * Date: 12.02.13
 * Time: 20:26
 */
class User implements LudoDBService
{
    private $id;

    public function __construct($userId)
    {
        $this->id = $userId;

    }

    public function read()
    {
        switch ($this->id) {
            case "100":
                return array('id' => 100,
                    'lastname' => 'Doe',
                    'firstname' => 'John',
                    'address' => 'My street 27',
                    'zipcode' => '4330',
                    'city' => 'Springfield',
                    'phone' => '+00 12 23 23 43',
                    'email' => 'john.doe@example-domain.com',
                    'picture' => 'john.psd'
                );
            case "101":
                return array(
                    'id' => 100,
                    'lastname' => 'Doe',
                    'firstname' => 'Jane',
                    'address' => 'Other street 51',
                    'zipcode' => '4025',
                    'city' => 'Springfield',
                    'phone' => '+00 43 23 23 43',
                    'email' => 'jane.doe@example-domain.com',
                    'picture' => 'jane.psd');
            default:
                return array();

        }
    }

    public function save($data){
        return $data;
    }

    public function shouldCache($service)
    {
        return false;
    }

    public function getOnSuccessMessageFor($service){
        return "";
    }

    public function getValidServices()
    {
        return array('save', 'read');
    }

    public function validateArguments($service, $arguments)
    {
        switch ($service) {
            case "read":
                return count($arguments) === 1;
            case "save":
                return count($arguments) === 1;
        }
        return false;
    }

    public function validateServiceData($service, $arguments){
        return true;
    }
}
