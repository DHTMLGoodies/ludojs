<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Alf Magne
 * Date: 21.09.12
 * Time: 20:50
 * To change this template use File | Settings | File Templates.
 */

function http_request(
        $verb = 'GET',             /* HTTP Request Method (GET and POST supported) */
        $ip,                       /* Target IP/Hostname */
        $port = 80,                /* Target TCP port */
        $uri = '/',                /* Target URI */
        $getdata = array(),        /* HTTP GET Data ie. array('var1' => 'val1', 'var2' => 'val2') */
        $postdata = array(),       /* HTTP POST Data ie. array('var1' => 'val1', 'var2' => 'val2') */
        $cookie = array(),         /* HTTP Cookie Data ie. array('var1' => 'val1', 'var2' => 'val2') */
        $custom_headers = array(), /* Custom HTTP headers ie. array('Referer: http://localhost/ */
        $timeout = 4,           /* Socket timeout in seconds */
        $req_hdr = false,          /* Include HTTP request headers */
        $res_hdr = false           /* Include HTTP response headers */
        )
    {

        echo $ip.$uri;


        $ret = '';
        $verb = strtoupper($verb);
        $cookie_str = '';
        $getdata_str = count($getdata) ? '?' : '';
        $postdata_str = '';

        foreach ($getdata as $k => $v)
                    $getdata_str .= urlencode($k) .'='. urlencode($v) . '&';

        foreach ($postdata as $k => $v)
            $postdata_str .= urlencode($k) .'='. urlencode($v) .'&';

        foreach ($cookie as $k => $v)
            $cookie_str .= urlencode($k) .'='. urlencode($v) .'; ';

        $crlf = "\r\n";
        $req = $verb .' '. $uri . $getdata_str .' HTTP/1.1' . $crlf;
        $req .= 'Host: '. $ip . $crlf;
        $req .= 'User-Agent: Mozilla/5.0 Firefox/3.6.12' . $crlf;
        $req .= 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' . $crlf;
        $req .= 'Accept-Language: en-us,en;q=0.5' . $crlf;
        $req .= 'Accept-Encoding: deflate' . $crlf;
        $req .= 'Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7' . $crlf;

        foreach ($custom_headers as $k => $v)
            $req .= $k .': '. $v . $crlf;

        if (!empty($cookie_str))
            $req .= 'Cookie: '. substr($cookie_str, 0, -2) . $crlf;

        if ($verb == 'POST' && !empty($postdata_str))
        {
            $postdata_str = substr($postdata_str, 0, -1);
            $req .= 'Content-Type: application/x-www-form-urlencoded' . $crlf;
            $req .= 'Content-Length: '. strlen($postdata_str) . $crlf . $crlf;
            $req .= $postdata_str;
        }
        else $req .= $crlf;

        if ($req_hdr)
            $ret .= $req;

        if (($fp = @fsockopen($ip, $port, $errno, $errstr)) == false)
            return "Error $errno: $errstr\n";

        stream_set_timeout($fp, 0, $timeout * 1000);

        fputs($fp, $req);
        while ($line = fgets($fp)) $ret .= $line;
        fclose($fp);

        if (!$res_hdr)
            $ret = substr($ret, strpos($ret, "\r\n\r\n") + 4);

        return $ret;
    }
error_reporting(E_ALL);
ini_set('display_errors','on');
$url = 'http://livegames.fide.com/london2012';
$urlParts = parse_url($url);
$contents =  http_request('GET', $urlParts['host'], 80, '/london2012/tocks.txt');

echo $contents."<br><br>";

if (function_exists('curl_init')) {
    echo "CURL<br>";
   // initialize a new curl resource
   $ch = curl_init();

   // set the url to fetch
   curl_setopt($ch, CURLOPT_URL, $url.'/tocks.txt');

   // don't give me the headers just the content
   curl_setopt($ch, CURLOPT_HEADER, 0);

   // return the value instead of printing the response to browser
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
    curl_setopt($ch, CURLOPT_LOW_SPEED_LIMIT, 1);

   // use a user agent to mimic a browser
   curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5) Gecko/20041107 Firefox/1.0');

    $contents = curl_exec($ch);

   // remember to always close the session and free all resources
   curl_close($ch);
} else {
    echo('No CURL');
   // curl library is not installed so we better use something else
}


echo $contents;
