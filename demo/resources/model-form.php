<?php
var_dump($_POST);

if (isset($_POST['request'])) {
    $data = $_POST['request']['data'];

    $tokens = explode("/", $_POST['request']);
    $recordId = $tokens[1];
    $service = count($tokens) == 3 ? $tokens[2] : 'read';

    switch ($service) {
        case 'read':
            switch ($recordId) {
                case '100':
                    $response = array(
                        'id' => 100,
                        'lastname' => 'Doe',
                        'firstname' => 'John',
                        'address' => 'My street 27',
                        'zipcode' => '4330',
                        'city' => 'Springfield',
                        'phone' => '+00 12 23 23 43',
                        'email' => 'john.doe@example-domain.com',
                        'picture' => 'john.psd');


                    break;
                case 101:
                    $response = array(
                        'id' => 100,
                        'lastname' => 'Doe',
                        'firstname' => 'Jane',
                        'address' => 'Other street 51',
                        'zipcode' => '4025',
                        'city' => 'Springfield',
                        'phone' => '+00 43 23 23 43',
                        'email' => 'jane.doe@example-domain.com',
                        'picture' => 'jane.psd');

                    break;

                    break;
            }

            $response = array('success' => true, 'message' => '', 'data' => $response);

            echo utf8_encode(json_encode($response));

            break;
        case 'save':
            $response = array('success' => true, 'message' => '', 'data' => array());
            echo utf8_encode(json_encode($response));
            break;

    }
}
