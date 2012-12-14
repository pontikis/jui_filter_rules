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
require_once 'filter_functions.php';
require_once 'demo_functions.php';

$a_rules = $_POST['a_rules'];
$use_ps = ($_POST['use_ps'] == "yes" ? true : false);

if(count($a_rules) == 0) {
	exit;
}

// connect to database
$dsn = $mysql_driver . '://' . $mysql_user . ':' . rawurlencode($mysql_passwd) . '@' . $mysql_server . '/' . $mysql_db . '?fetchmode=' . ADODB_FETCH_ASSOC;
$conn = NewADOConnection($dsn);
$conn->execute('SET NAMES UTF8');

// print result
$result = parse_rules($a_rules, $use_ps);
echo $result['sql'];
if($use_ps) {
	echo '<br /><br />bind params: <br />';
	print_r($result['bind_params']);
}

?>