<?php
/**
 * Comment pending.
 * User: Alf Magne Kalleland
 * Date: 12.02.13
 * Time: 20:26
 */
class StaticUser implements LudoDBService
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
                    'picture' => 'john.psd',
                    'country' => 131,
                    'birth' => '1973-06-09',
                    'gender' => 'male'
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
                    'country' => 33,
                    'gender' => 'female',
                    'birth' => '1977-06-14',
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
