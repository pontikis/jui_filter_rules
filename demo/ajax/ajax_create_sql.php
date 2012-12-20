<?php
// prevent direct access
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
	strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}

require_once '../mysql/settings.php';
require_once '../lib/adodb_5.18a/adodb.inc.php';
require_once '../../server_side/php/jui_filter_rules.php';
require_once 'demo_functions.php';

// configuration
define("RDBMS", "ADODB");

$a_rules = $_POST['a_rules'];
$use_ps = ($_POST['use_ps'] == "yes" ? true : false);

if(count($a_rules) == 0) {
	exit;
}

// connect to database
$dsn = $mysql_driver . '://' . $mysql_user . ':' . rawurlencode($mysql_passwd) . '@' . $mysql_server . '/' . $mysql_db . '?fetchmode=' . ADODB_FETCH_ASSOC;
$conn = NewADOConnection($dsn);
if($conn == false) {
	echo 'No database connection...';
	exit;
}
$conn->execute('SET NAMES UTF8');

// print result
$jfr = new jui_filter_rules($conn, $use_ps, RDBMS);
$result = $jfr->parse_rules($a_rules);

echo $result['sql'];
if($use_ps) {
	echo str_repeat(PHP_EOL, 3);
	echo 'bind params: ' . PHP_EOL;
	print_r($result['bind_params']);
}
?>