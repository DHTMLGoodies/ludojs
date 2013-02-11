<?php
/**
 *
 * User: Alf Magne
 * Date: 11.02.13
 * Time: 14:46
 */
class GridWithPaging implements LudoDBService
{

    public function __construct(){

    }

    public static function getValidServices(){
        return array('read');
    }

    public function validateService($service, $arguments){
        return true;
    }

    public function cacheEnabled(){
        return false;
    }

    public function read($request){
        $this->addIds();

        $response = array(
            'data' => array(),
            'rows' => count($this->data)
        );
        $offset = $request['_paging']['offset'];
        $end = $request['_paging']['size'] + $offset;

        if(isset($request['_sort'])){
            $this->data = $this->getDataSortedBy($this->data, $request['_sort']);
        }

        for($i=$offset;$i<$end;$i++){
            if(isset($this->data[$i]))$response['data'][] = $this->data[$i];
        }

        return $response;
    }

    function getDataSortedBy($data, $sortedBy){
        usort($data, $this->cmp($sortedBy));
        return $data;
    }

    private function cmp($sortedBy){
        return function($a, $b) use($sortedBy){
            if($sortedBy['order'] == 'asc'){
                return $a[$sortedBy['column']] < $b[$sortedBy['column']] ? -1 : 1;
            }else{
                return $a[$sortedBy['column']] > $b[$sortedBy['column']] ? -1 : 1;
            }
        };

    }

    private function addIds(){
        $i = 0;
        foreach($this->data as &$row){
            $row['id'] = ++$i;
        }
    }

    private $data = array(
        array( 'country' => 'Japan','capital' => 'Tokyo (de facto)','population' => '13,185,502'),
        array( 'country' => 'South Korea','capital' => 'Seoul','population' => '10,464,051'),
        array( 'country' => 'Russia','capital' => 'Moscow','population' => '10,126,424'),
        array( 'country' => 'Iran','capital' => 'Tehran','population' => '9,110,347'),
        array( 'country' => 'Mexico','capital' => 'Mexico City','population' => '8,841,916'),
        array( 'country' => 'Indonesia','capital' => 'Jakarta','population' => '8,489,910'),
        array( 'country' => 'Colombia','capital' => 'Bogotá','population' => '7,866,160'),
        array( 'country' => 'China','capital' => 'Beijing','population' => '7,741,274'),
        array( 'country' => 'Egypt','capital' => 'Cairo','population' => '7,438,376'),
        array( 'country' => 'United Kingdom','capital' => 'London','population' => '7,287,555'),
        array( 'country' => 'Peru','capital' => 'Lima','population' => '7,220,971'),
        array( 'country' => 'Iraq','capital' => 'Baghdad','population' => '7,216,040'),
        array( 'country' => 'Hong Kong (China)','capital' => 'Hong Kong','population' => '6,752,001'),
        array( 'country' => 'Thailand','capital' => 'Bangkok','population' => '6,542,751'),
        array( 'country' => 'Bangladesh','capital' => 'Dhaka','population' => '6,080,671'),
        array( 'country' => 'Saudi Arabia','capital' => 'Riyadh','population' => '5,318,636'),
        array( 'country' => 'Chile','capital' => 'Santiago','population' => '5,012,973'),
        array( 'country' => 'Turkey','capital' => 'Ankara','population' => '4,431,719'),
        array( 'country' => 'Singapore','capital' => 'Singapore','population' => '4,408,220'),
        array( 'country' => 'Democratic Republic of the Congo','capital' => 'Kinshasa','population' => '4,385,264'),
        array( 'country' => 'Syria','capital' => 'Damascus','population' => '3,500,000'),
        array( 'country' => 'Germany','capital' => 'Berlin','population' => '3,405,250'),
        array( 'country' => 'Vietnam','capital' => 'Hanoi','population' => '3,398,889'),
        array( 'country' => 'Spain','capital' => 'Madrid','population' => '3,232,463'),
        array( 'country' => 'North Korea','capital' => 'Pyongyang','population' => '3,144,005'),
        array( 'country' => 'Afghanistan','capital' => 'Kabul','population' => '3,140,853'),
        array( 'country' => 'Argentina','capital' => 'Buenos Aires','population' => '3,021,865'),
        array( 'country' => 'Ethiopia','capital' => 'Addis Ababa','population' => '2,737,479'),
        array( 'country' => 'Kenya','capital' => 'Nairobi','population' => '2,665,657'),
        array( 'country' => 'Republic of China (Taiwan)','capital' => 'Taipei','population' => '2,619,920'),
        array( 'country' => 'Brazil','capital' => 'Brasília','population' => '2,606,885'),
        array( 'country' => 'Jordan','capital' => 'Amman','population' => '2,600,603'),
        array( 'country' => 'Ukraine','capital' => 'Kiev','population' => '2,591,277'),
        array( 'country' => 'Italy','capital' => 'Rome','population' => '2,503,056'),
        array( 'country' => 'Angola','capital' => 'Luanda','population' => '2,453,779'),
        array( 'country' => 'South Africa','capital' => 'Pretoria','population' => '2,345,908'),
        array( 'country' => 'Cuba','capital' => 'Havana','population' => '2,236,837'),
        array( 'country' => 'Uzbekistan','capital' => 'Tashkent','population' => '2,207,850'),
        array( 'country' => 'France','capital' => 'Paris','population' => '2,103,674'),
        array( 'country' => 'Romania','capital' => 'Bucharest','population' => '1,942,254'),
        array( 'country' => 'Azerbaijan','capital' => 'Baku','population' => '1,879,251'),
        array( 'country' => 'Dominican Republic','capital' => 'Santo Domingo','population' => '1,875,453'),
        array( 'country' => 'Venezuela','capital' => 'Caracas','population' => '1,838,939'),
        array( 'country' => 'Morocco','capital' => 'Rabat','population' => '1,789,635'),
        array( 'country' => 'Sudan','capital' => 'Khartoum','population' => '1,740,661'),
        array( 'country' => 'Hungary','capital' => 'Budapest','population' => '1,728,718'),
        array( 'country' => 'Poland','capital' => 'Warsaw','population' => '1,706,724'),
        array( 'country' => 'Belarus','capital' => 'Minsk','population' => '1,702,061'),
        array( 'country' => 'Philippines','capital' => 'Manila','population' => '1,660,714'),
        array( 'country' => 'Uganda','capital' => 'Kampala','population' => '1,659,600'),
        array( 'country' => 'Ghana','capital' => 'Accra','population' => '1,640,507'),
        array( 'country' => 'Cameroon','capital' => 'Yaoundé','population' => '1,616,000'),
        array( 'country' => 'Madagascar','capital' => 'Antananarivo','population' => '1,613,375'),
        array( 'country' => 'Lebanon','capital' => 'Beirut','population' => '1,574,387'),
        array( 'country' => 'Austria','capital' => 'Vienna','population' => '1,552,789'),
        array( 'country' => 'Algeria','capital' => 'Algiers','population' => '1,518,083'),
        array( 'country' => 'Ecuador','capital' => 'Quito','population' => '1,504,991'),
        array( 'country' => 'Zimbabwe','capital' => 'Harare','population' => '1,487,028'),
        array( 'country' => 'Yemen','capital' => 'Sana\'a','population' => '1,431,649'),
        array( 'country' => 'Guinea','capital' => 'Conakry','population' => '1,399,981'),
        array( 'country' => 'Malaysia','capital' => 'Kuala Lumpur','population' => '1,381,830'),
        array( 'country' => 'Uruguay','capital' => 'Montevideo','population' => '1,369,797'),
        array( 'country' => 'Zambia','capital' => 'Lusaka','population' => '1,331,254'),
        array( 'country' => 'Somaliland','capital' => 'Hargeisa','population' => '1,300,000'),
        array( 'country' => 'Mali','capital' => 'Bamako','population' => '1,289,626'),
        array( 'country' => 'Haiti','capital' => 'Port-au-Prince','population' => '1,235,227'),
        array( 'country' => 'Czech Republic','capital' => 'Prague','population' => '1,227,332'),
        array( 'country' => 'Libya','capital' => 'Tripoli','population' => '1,184,045'),
        array( 'country' => 'Kuwait','capital' => 'Kuwait City','population' => '1,171,880'),
        array( 'country' => 'Serbia','capital' => 'Belgrade','population' => '1,154,589'),
        array( 'country' => 'Somalia','capital' => 'Mogadishu','population' => '1,097,133'),
        array( 'country' => 'Bulgaria','capital' => 'Sofia','population' => '1,090,295'),
        array( 'country' => 'Congo','capital' => 'Brazzaville','population' => '1,088,044'),
        array( 'country' => 'Belgium','capital' => 'Brussels','population' => '1,080,790'),
        array( 'country' => 'Armenia','capital' => 'Yerevan','population' => '1,080,487'),
        array( 'country' => 'Mozambique','capital' => 'Maputo','population' => '1,076,689'),
        array( 'country' => 'Sierra Leone','capital' => 'Freetown','population' => '1,070,200'),
        array( 'country' => 'Georgia','capital' => 'Tbilisi','population' => '1,044,993'),
        array( 'country' => 'Senegal','capital' => 'Dakar','population' => '1,030,594'),
        array( 'country' => 'Burkina Faso','capital' => 'Ouagadougou','population' => '1,005,231'),
        array( 'country' => 'Ireland','capital' => 'Dublin','population' => '1,045,769'),
        array( 'country' => 'Liberia','capital' => 'Monrovia','population' => '1,010,970'),
        array( 'country' => 'Guatemala','capital' => 'Guatemala City','population' => '1,103,865'),
        array( 'country' => 'Pakistan','capital' => 'Islamabad','population' => '955,629'),
        array( 'country' => 'Nicaragua','capital' => 'Managua','population' => '926,883'),
        array( 'country' => 'Myanmar','capital' => 'Naypyidaw','population' => '925,000'),
        array( 'country' => 'Mongolia','capital' => 'Ulan Bator','population' => '907,802'),
        array( 'country' => 'Malawi','capital' => 'Lilongwe','population' => '902,388'),
        array( 'country' => 'Canada','capital' => 'Ottawa','population' => '898,150'),
        array( 'country' => 'Bolivia','capital' => 'La Paz','population' => '877,363'),
        array( 'country' => 'Kyrgyzstan','capital' => 'Bishkek','population' => '843,240'),
        array( 'country' => 'Togo','capital' => 'Lomé','population' => '824,738'),
        array( 'country' => 'Panama','capital' => 'Panama City','population' => '813,097'),
        array( 'country' => 'Nepal','capital' => 'Kathmandu','population' => '812,026'),
        array( 'country' => 'Oman','capital' => 'Muscat','population' => '797,000'),
        array( 'country' => 'Niger','capital' => 'Niamey','population' => '794,814'),
        array( 'country' => 'Nigeria','capital' => 'Abuja','population' => '778,567'),
        array( 'country' => 'Sweden','capital' => 'Stockholm','population' => '770,284'),
        array( 'country' => 'Tunisia','capital' => 'Tunis','population' => '767,629'),
        array( 'country' => 'Turkmenistan','capital' => 'Ashgabat','population' => '763,537'),
        array( 'country' => 'Chad','capital' => 'N\'Djamena','population' => '751,288'),
        array( 'country' => 'Israel','capital' => 'Jerusalem','population' => '780,200'),
        array( 'country' => 'Netherlands','capital' => 'Amsterdam','population' => '740,094'),
        array( 'country' => 'Honduras','capital' => 'Tegucigalpa','population' => '735,982'),
        array( 'country' => 'Central African Republic','capital' => 'Bangui','population' => '731,548'),
        array( 'country' => 'Greece','capital' => 'Athens','population' => '721,477'),
        array( 'country' => 'Mauritania','capital' => 'Nouakchott','population' => '719,167'),
        array( 'country' => 'Rwanda','capital' => 'Kigali','population' => '718,414'),
        array( 'country' => 'Latvia','capital' => 'Riga','population' => '713,016'),
        array( 'country' => 'Jamaica','capital' => 'Kingston','population' => '701,063'),
        array( 'country' => 'Kazakhstan','capital' => 'Astana','population' => '700,000'),
        array( 'country' => 'Croatia','capital' => 'Zagreb','population' => '804,200'),
        array( 'country' => 'Cambodia','capital' => 'Phnom Penh','population' => '650,651'),
        array( 'country' => 'United States','capital' => 'Washington, D.C.','population' => '601,723'),
        array( 'country' => 'Finland','capital' => 'Helsinki','population' => '596,661'),
        array( 'country' => 'Moldova','capital' => 'Chişinău','population' => '794,800'),
        array( 'country' => 'United Arab Emirates','capital' => 'Abu Dhabi','population' => '585,097'),
        array( 'country' => 'Tajikistan','capital' => 'Dushanbe','population' => '582,496'),
        array( 'country' => 'Lithuania','capital' => 'Vilnius','population' => '556,723'),
        array( 'country' => 'Gabon','capital' => 'Libreville','population' => '556,425'),
        array( 'country' => 'Eritrea','capital' => 'Asmara','population' => '543,707'),
        array( 'country' => 'Norway','capital' => 'Oslo','population' => '575,475'),
        array( 'country' => 'Portugal','capital' => 'Lisbon','population' => '564,657'),
        array( 'country' => 'El Salvador','capital' => 'San Salvador','population' => '521,366'),
        array( 'country' => 'Paraguay','capital' => 'Asunción','population' => '520,722'),
        array( 'country' => 'Macau (China)','capital' => 'Macau','population' => '520,400'),
        array( 'country' => 'Macedonia','capital' => 'Skopje','population' => '506,926'),
        array( 'country' => 'Denmark','capital' => 'Copenhagen','population' => '506,166'),
        array( 'country' => 'Djibouti','capital' => 'Djibouti (city)','population' => '475,332'),
        array( 'country' => 'Côte d\'Ivoire','capital' => 'Yamoussoukro','population' => '454,929'),
        array( 'country' => 'Guinea-Bissau','capital' => 'Bissau','population' => '452,640'),
        array( 'country' => 'Slovakia','capital' => 'Bratislava','population' => '424,207'),
        array( 'country' => 'Puerto Rico (USA)','capital' => 'San Juan','population' => '421,356'),
        array( 'country' => 'Estonia','capital' => 'Tallinn','population' => '403,547'),
        array( 'country' => 'Burundi','capital' => 'Bujumbura','population' => '384,461'),
        array( 'country' => 'Bosnia and Herzegovina','capital' => 'Sarajevo','population' => '383,604'),
        array( 'country' => 'New Zealand','capital' => 'Wellington','population' => '381,900'),
        array( 'country' => 'Albania','capital' => 'Tirana','population' => '763,634'),
        array( 'country' => 'South Sudan','capital' => 'Juba','population' => '372,410'),
        array( 'country' => 'Australia','capital' => 'Canberra','population' => '354,644'),
        array( 'country' => 'Costa Rica','capital' => 'San José','population' => '328,195'),
        array( 'country' => 'Qatar','capital' => 'Al-Doha','population' => '303,429'),
        array( 'country' => 'India','capital' => 'New Delhi','population' => '292,300'),
        array( 'country' => 'Papua New Guinea','capital' => 'Port Moresby','population' => '299,396'),
        array( 'country' => 'Tanzania','capital' => 'Dodoma','population' => '287,200'),
        array( 'country' => 'Laos','capital' => 'Vientiane','population' => '287,579'),
        array( 'country' => 'Cyprus','capital' => 'Nicosia (south)','population' => '270,000'),
        array( 'country' => 'Lesotho','capital' => 'Maseru','population' => '267,652'),
        array( 'country' => 'Slovenia','capital' => 'Ljubljana','population' => '264,265'),
        array( 'country' => 'Suriname','capital' => 'Paramaribo','population' => '254,147'),
        array( 'country' => 'Namibia','capital' => 'Windhoek','population' => '252,721'),
        array( 'country' => 'Bahamas','capital' => 'Nassau','population' => '248,948'),
        array( 'country' => 'Botswana','capital' => 'Gaborone','population' => '225,656'),
        array( 'country' => 'Benin','capital' => 'Porto-Novo','population' => '223,552'),
        array( 'country' => 'Western Sahara','capital' => 'El Aaiún','population' =>'194,668'),
        array( 'country' => 'Transnistria','capital' => 'Tiraspol','population' => '159,163'),
        array( 'country' => 'Mauritius','capital' => 'Port Louis','population' => '147,251'),
        array( 'country' => 'Montenegro','capital' => 'Podgorica','population' => '141,854'),
        array( 'country' => 'Bahrain','capital' => 'Manama','population' => '140,616'),
        array( 'country' => 'Guyana','capital' => 'Georgetown','population' => '134,599'),
        array( 'country' => 'Cape Verde','capital' => 'Praia','population' => '125,464'),
        array( 'country' => 'Switzerland','capital' => 'Berne (de facto)','population' => '121,631'),
        array( 'country' => 'Sri Lanka','capital' => 'Sri Jayawardenapura Kotte','population' => '118,556'),
        array( 'country' => 'Iceland','capital' => 'Reykjavík','population' => '115,000'),
        array( 'country' => 'Maldives','capital' => 'Malé','population' => '103,693'),
        array( 'country' => 'Bhutan','capital' => 'Thimphu','population' => '101,259'),
        array( 'country' => 'Equatorial Guinea','capital' => 'Malabo','population' => '100,677'),
        array( 'country' => 'Barbados','capital' => 'Bridgetown','population' => '96,578'),
        array( 'country' => 'New Caledonia (France)','capital' => 'Nouméa','population' => '89,207'),
        array( 'country' => 'Northern Cyprus','capital' => 'Nicosia (north)','population' => '84,893'),
        array( 'country' => 'Fiji','capital' => 'Suva','population' => '84,410'),
        array( 'country' => 'Swaziland','capital' => 'Mbabane','population' => '81,594'),
        array( 'country' => 'Luxembourg','capital' => 'Luxembourg','population' => '76,420'),
        array( 'country' => 'Northern Mariana Islands (USA)','capital' => 'Saipan','population' => '62,392'),
        array( 'country' => 'Comoros','capital' => 'Moroni','population' => '60,200'),
        array( 'country' => 'Solomon Islands','capital' => 'Honiara','population' => '59,288'),
        array( 'country' => 'East Timor','capital' => 'Dili','population' => '59,069'),
        array( 'country' => 'Saint Lucia','capital' => 'Castries','population' => '57,000'),
        array( 'country' => 'São Tomé and Príncipe','capital' => 'Sao Tome','population' => '56,166'),
        array( 'country' => 'American Samoa (USA)','capital' => 'Pago Pago','population' =>'52,000'),
        array( 'country' => 'Trinidad and Tobago','capital' => 'Port of Spain','population' => '50,479'),
        array( 'country' => 'Nagorno-Karabakh Republic','capital' => 'Stepanakert','population' => '49,986'),
        array( 'country' => 'Curaçao (Netherlands)','capital' => 'Willemstad','population' => '49,885'),
        array( 'country' => 'Abkhazia','capital' => 'Sukhumi','population' => '43,700'),
        array( 'country' => 'Samoa','capital' => 'Apia','population' => '39,813'),
        array( 'country' => 'Vanuatu','capital' => 'Port Vila','population' => '38,000'),
        array( 'country' => 'Monaco','capital' => 'Monaco','population' =>'35,986'),
        array( 'country' => 'Gambia','capital' => 'Banjul','population' => '34,828'),
        array( 'country' => 'Kiribati','capital' => 'Tarawa','population' => '30,000'),
        array( 'country' => 'Aruba (Netherlands)','capital' => 'Oranjestad','population' => '29,998'),
        array( 'country' => 'Seychelles','capital' => 'Victoria','population' => '29,298'),
        array( 'country' => 'Gibraltar (UK)','capital' => 'Gibraltar','population' => '29,286'),
        array( 'country' => 'Jersey (UK)','capital' => 'Saint Helier','population' => '28,380'),
        array( 'country' => 'Brunei','capital' => 'Bandar Seri Begawan','population' => '28,135'),
        array( 'country' => 'Cayman Islands (UK)','capital' => 'George Town','population' => '26,798'),
        array( 'country' => 'Isle of Man (UK)','capital' => 'Douglas','population' => '26,600'),
        array( 'country' => 'French Polynesia (France)','capital' => 'Papeete','population' => '26,200'),
        array( 'country' => 'West Bank (Israel/PNA)','capital' => 'Ramallah (de facto)','population' => '25,500'),
        array( 'country' => 'Marshall Islands','capital' => 'Majuro','population' => '25,400'),
        array( 'country' => 'Andorra','capital' => 'Andorra la Vella','population' => '22,884'),
        array( 'country' => 'Antigua and Barbuda','capital' => 'St. John\'s','population' => '22,679'),
        array( 'country' => 'Tonga','capital' => 'Nuku\ʻalofa','population' => '22,400'),
        array( 'country' => 'Faroe Islands (Denmark)','capital' => 'Tórshavn','population' => '18,573'),
        array( 'country' => 'Guernsey (UK)','capital' => 'St. Peter Port','population' => '16,701'),
        array( 'country' => 'Saint Vincent and the Grenadines','capital' => 'Kingstown','population' => '16,031'),
        array( 'country' => 'Greenland (Denmark)','capital' => 'Nuuk (Godthåb)','population' => '15,469'),
        array( 'country' => 'South Ossetia','capital' => 'Tskhinvali','population' => '15,000'),
        array( 'country' => 'Dominica','capital' => 'Roseau','population' => '14,847'),
        array( 'country' => 'Saint Kitts and Nevis','capital' => 'Basseterre','population' => '13,043'),
        array( 'country' => 'Belize','capital' => 'Belmopan','population' => '12,300'),
        array( 'country' =>'Åland (Finland)','capital' => 'Mariehamn','population' => '11,296'),
        array( 'country' => 'United States Virgin Islands (US)','capital' => 'Charlotte Amalie','population' => '10,817'),
        array( 'country' => 'Federated States of Micronesia','capital' => 'Palikir','population' => '9,900'),
        array( 'country' => 'British Virgin Islands (UK)','capital' => 'Road Town','population' => '9,400'),
        array( 'country' => 'Grenada','capital' => 'St. George\'s','population' => '7,500'),
        array( 'country' => 'Malta','capital' => 'Valletta','population' => '6,315'),
        array( 'country' => 'Collectivity of Saint Martin (France)','capital' => 'Marigot','population' => '5,700'),
        array( 'country' => 'Saint Pierre and Miquelon (France)','capital' => 'Saint-Pierre','population' => '5,509'),
        array( 'country' => 'Cook Islands (NZ)','capital' => 'Avarua','population' => '5,445'),
        array( 'country' => 'Liechtenstein','capital' => 'Vaduz','population' => '5,248'),
        array( 'country' => 'San Marino','capital' => 'City of San Marino','population' => '4,493'),
        array( 'country' => 'Tuvalu','capital' => 'Funafuti','population' => '4,492'),
        array( 'country' => 'Turks and Caicos Islands (UK)','capital' => 'Cockburn Town','population' => '3,700'),
        array( 'country' => 'Saint Barthélemy (France)','capital' => 'Gustavia','population' => '3,000'),
        array( 'country' => 'Falkland Islands (UK)','capital' => 'Stanley','population' => '2,115'),
        array( 'country' => 'Svalbard (Norway)','capital' => 'Longyearbyen','population' => '2,075'),
        array( 'country' => 'Christmas Island (Australia)','capital' => 'Flying Fish Cove','population' => '1,493'),
        array( 'country' => 'Sint Maarten (Netherlands)','capital' => 'Philipsburg','population' => '1,338'),
        array( 'country' => 'Wallis and Futuna (France)','capital' => 'Mata-Utu','population' => '1,191'),
        array( 'country' => 'Anguilla (UK)','capital' => 'The Valley','population' => '1,169'),
        array( 'country' => 'Nauru','capital' => 'Yaren (de facto)','population' => '1,100'),
        array( 'country' => 'Guam (USA)','capital' => 'Hagåtña','population' => '1,100'),
        array( 'country' => 'Montserrat (UK)','capital' => 'Brades (de facto)','population' => '1,000'),
        array( 'country' => 'Bermuda (UK)','capital' => 'Hamilton','population' => '969'),
        array( 'country' => 'Norfolk Island (Australia)','capital' => 'Kingston','population' => '880'),
        array( 'country' => 'Holy See','capital' => 'The Vatican','population' =>'826'),
        array( 'country' => 'Saint Helena, Ascension and Tristan da Cunha (UK)','capital' => 'Jamestown','population' => '714'),
        array( 'country' => 'Niue (NZ)','capital' => 'Alofi','population' => '616'),
        array( 'country' => 'Tokelau (NZ)','capital' => 'Nukunonu (de facto)','population' => '426'),
        array( 'country' => 'Palau','capital' => 'Ngerulmud','population' => '391'),
        array( 'country' => 'Cocos (Keeling) Islands (Australia)','capital' => 'West Island','population' => '120'),
        array( 'country' => 'Pitcairn Islands (UK)','capital' => 'Adamstown','population' => '45'),
        array( 'country' => 'South Georgia and the South Sandwich Islands (UK)','capital' => 'King Edward Point','population' => '18')
    );
}
