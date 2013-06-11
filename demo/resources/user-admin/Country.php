<?php
/**
 *
 * User: Alf Magne
 * Date: 11.06.13
 * Time: 15:25
 */
class Country extends LudoDBModel
{
    protected $config = array(
        'table' => 'country',
        'columns' => array(
            'id' => 'int auto_increment not null primary key',
            'name' => 'varchar(128)'
        ),
        'data' => array(array("id" => "1", "name" => "Afghanistan"), array("id" => "2", "name" => "Albania"), array("id" => "3", "name" => "Algeria"), array("id" => "4", "name" => "Andorra"), array("id" => "5", "name" => "Angola"), array("id" => "6", "name" => "Antigua & Deps"), array("id" => "7", "name" => "Argentina"), array("id" => "8", "name" => "Armenia"), array("id" => "9", "name" => "Australia"), array("id" => "10", "name" => "Austria"), array("id" => "11", "name" => "Azerbaijan"), array("id" => "12", "name" => "Bahamas"), array("id" => "13", "name" => "Bahrain"), array("id" => "14", "name" => "Bangladesh"), array("id" => "15", "name" => "Barbados"), array("id" => "16", "name" => "Belarus"), array("id" => "17", "name" => "Belgium"), array("id" => "18", "name" => "Belize"), array("id" => "19", "name" => "Benin"), array("id" => "20", "name" => "Bhutan"), array("id" => "21", "name" => "Bolivia"), array("id" => "22", "name" => "Bosnia Herzegovina"), array("id" => "23", "name" => "Botswana"), array("id" => "24", "name" => "Brazil"), array("id" => "25", "name" => "Brunei"), array("id" => "26", "name" => "Bulgaria"), array("id" => "27", "name" => "Burkina"), array("id" => "28", "name" => "Burundi"), array("id" => "29", "name" => "Cambodia"), array("id" => "30", "name" => "Cameroon"), array("id" => "31", "name" => "Canada"), array("id" => "32", "name" => "Cape Verde"), array("id" => "33", "name" => "Central African Rep"), array("id" => "34", "name" => "Chad"), array("id" => "35", "name" => "Chile"), array("id" => "36", "name" => "China"), array("id" => "37", "name" => "Colombia"), array("id" => "38", "name" => "Comoros"), array("id" => "39", "name" => "Congo"), array("id" => "40", "name" => "Congo array(Democratic Rep)"), array("id" => "41", "name" => "Costa Rica"), array("id" => "42", "name" => "Croatia"), array("id" => "43", "name" => "Cuba"), array("id" => "44", "name" => "Cyprus"), array("id" => "45", "name" => "Czech Republic"), array("id" => "46", "name" => "Denmark"), array("id" => "47", "name" => "Djibouti"), array("id" => "48", "name" => "Dominica"), array("id" => "49", "name" => "Dominican Republic"), array("id" => "50", "name" => "East Timor"), array("id" => "51", "name" => "Ecuador"), array("id" => "52", "name" => "Egypt"), array("id" => "53", "name" => "El Salvador"), array("id" => "54", "name" => "Equatorial Guinea"), array("id" => "55", "name" => "Eritrea"), array("id" => "56", "name" => "Estonia"), array("id" => "57", "name" => "Ethiopia"), array("id" => "58", "name" => "Fiji"), array("id" => "59", "name" => "Finland"), array("id" => "60", "name" => "France"), array("id" => "61", "name" => "Gabon"), array("id" => "62", "name" => "Gambia"), array("id" => "63", "name" => "Georgia"), array("id" => "64", "name" => "Germany"), array("id" => "65", "name" => "Ghana"), array("id" => "66", "name" => "Greece"), array("id" => "67", "name" => "Grenada"), array("id" => "68", "name" => "Guatemala"), array("id" => "69", "name" => "Guinea"), array("id" => "70", "name" => "Guinea-Bissau"), array("id" => "71", "name" => "Guyana"), array("id" => "72", "name" => "Haiti"), array("id" => "73", "name" => "Honduras"), array("id" => "74", "name" => "Hungary"), array("id" => "75", "name" => "Iceland"), array("id" => "76", "name" => "India"), array("id" => "77", "name" => "Indonesia"), array("id" => "78", "name" => "Iran"), array("id" => "79", "name" => "Iraq"), array("id" => "80", "name" => "Ireland array(Republic)"), array("id" => "81", "name" => "Israel"), array("id" => "82", "name" => "Italy"), array("id" => "83", "name" => "Ivory Coast"), array("id" => "84", "name" => "Jamaica"), array("id" => "85", "name" => "Japan"), array("id" => "86", "name" => "Jordan"), array("id" => "87", "name" => "Kazakhstan"), array("id" => "88", "name" => "Kenya"), array("id" => "89", "name" => "Kiribati"), array("id" => "90", "name" => "Korea North"), array("id" => "91", "name" => "Korea South"), array("id" => "92", "name" => "Kosovo"), array("id" => "93", "name" => "Kuwait"), array("id" => "94", "name" => "Kyrgyzstan"), array("id" => "95", "name" => "Laos"), array("id" => "96", "name" => "Latvia"), array("id" => "97", "name" => "Lebanon"), array("id" => "98", "name" => "Lesotho"), array("id" => "99", "name" => "Liberia"), array("id" => "100", "name" => "Libya"), array("id" => "101", "name" => "Liechtenstein"), array("id" => "102", "name" => "Lithuania"), array("id" => "103", "name" => "Luxembourg"), array("id" => "104", "name" => "Macedonia"), array("id" => "105", "name" => "Madagascar"), array("id" => "106", "name" => "Malawi"), array("id" => "107", "name" => "Malaysia"), array("id" => "108", "name" => "Maldives"), array("id" => "109", "name" => "Mali"), array("id" => "110", "name" => "Malta"), array("id" => "111", "name" => "Marshall Islands"), array("id" => "112", "name" => "Mauritania"), array("id" => "113", "name" => "Mauritius"), array("id" => "114", "name" => "Mexico"), array("id" => "115", "name" => "Micronesia"), array("id" => "116", "name" => "Moldova"), array("id" => "117", "name" => "Monaco"), array("id" => "118", "name" => "Mongolia"), array("id" => "119", "name" => "Montenegro"), array("id" => "120", "name" => "Morocco"), array("id" => "121", "name" => "Mozambique"), array("id" => "122", "name" => "Myanmar"), array("id" => "123", "name" => "Namibia"), array("id" => "124", "name" => "Nauru"), array("id" => "125", "name" => "Nepal"), array("id" => "126", "name" => "Netherlands"), array("id" => "127", "name" => "New Zealand"), array("id" => "128", "name" => "Nicaragua"), array("id" => "129", "name" => "Niger"), array("id" => "130", "name" => "Nigeria"), array("id" => "131", "name" => "Norway"), array("id" => "132", "name" => "Oman"), array("id" => "133", "name" => "Pakistan"), array("id" => "134", "name" => "Palau"), array("id" => "135", "name" => "Panama"), array("id" => "136", "name" => "Papua New Guinea"), array("id" => "137", "name" => "Paraguay"), array("id" => "138", "name" => "Peru"), array("id" => "139", "name" => "Philippines"), array("id" => "140", "name" => "Poland"), array("id" => "141", "name" => "Portugal"), array("id" => "142", "name" => "Qatar"), array("id" => "143", "name" => "Romania"), array("id" => "144", "name" => "Russian Federation"), array("id" => "145", "name" => "Rwanda"), array("id" => "148", "name" => "Saint Vincent & the Grenadines"), array("id" => "149", "name" => "Samoa"), array("id" => "150", "name" => "San Marino"), array("id" => "151", "name" => "Sao Tome & Principe"), array("id" => "152", "name" => "Saudi Arabia"), array("id" => "153", "name" => "Senegal"), array("id" => "154", "name" => "Serbia"), array("id" => "155", "name" => "Seychelles"), array("id" => "156", "name" => "Sierra Leone"), array("id" => "157", "name" => "Singapore"), array("id" => "158", "name" => "Slovakia"), array("id" => "159", "name" => "Slovenia"), array("id" => "160", "name" => "Solomon Islands"), array("id" => "161", "name" => "Somalia"), array("id" => "162", "name" => "South Africa"), array("id" => "163", "name" => "South Sudan"), array("id" => "164", "name" => "Spain"), array("id" => "165", "name" => "Sri Lanka"), array("id" => "146", "name" => "St Kitts & Nevis"), array("id" => "147", "name" => "St Lucia"), array("id" => "166", "name" => "Sudan"), array("id" => "167", "name" => "Suriname"), array("id" => "168", "name" => "Swaziland"), array("id" => "169", "name" => "Sweden"), array("id" => "170", "name" => "Switzerland"), array("id" => "171", "name" => "Syria"), array("id" => "172", "name" => "Taiwan"), array("id" => "173", "name" => "Tajikistan"), array("id" => "174", "name" => "Tanzania"), array("id" => "175", "name" => "Thailand"), array("id" => "176", "name" => "Togo"), array("id" => "177", "name" => "Tonga"), array("id" => "178", "name" => "Trinidad & Tobago"), array("id" => "179", "name" => "Tunisia"), array("id" => "180", "name" => "Turkey"), array("id" => "181", "name" => "Turkmenistan"), array("id" => "182", "name" => "Tuvalu"), array("id" => "183", "name" => "Uganda"), array("id" => "184", "name" => "Ukraine"), array("id" => "185", "name" => "United Arab Emirates"), array("id" => "186", "name" => "United Kingdom"), array("id" => "187", "name" => "United States"), array("id" => "188", "name" => "Uruguay"), array("id" => "189", "name" => "Uzbekistan"), array("id" => "190", "name" => "Vanuatu"), array("id" => "191", "name" => "Vatican City"), array("id" => "192", "name" => "Venezuela"), array("id" => "193", "name" => "Vietnam"), array("id" => "194", "name" => "Yemen"), array("id" => "195", "name" => "Zambia"), array("id" => "196", "name" => "Zimbabwe"))
    );
}
