<?php
// prevent direct access
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND
	strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
if(!$isAjax) {
	print 'Access denied - not an AJAX request...' . ' (' . __FILE__ . ')';
	exit;
}

// configuration
define("RDBMS", "ADODB");
//define("RDBMS", "POSTGRES");

$a_rules = $_POST['a_rules'];
$use_ps = ($_POST['use_ps'] == "yes" ? true : false);

if(count($a_rules) == 0) {
	exit;
}

if(RDBMS == "ADODB") {
	require_once '../mysql/settings.php';
	require_once '../lib/adodb_5.18a/adodb.inc.php';
} else if(RDBMS == "POSTGRES") {
	require_once '../postgresql/settings.php';
}

require_once '../../server_side/php/jui_filter_rules.php';
require_once 'demo_functions.php';


if(!in_array(RDBMS, array("ADODB", "POSTGRES"))) {
	echo 'Database ' . RDBMS . ' not yet supported...';
	exit;
}

if(RDBMS == "ADODB" && !in_array($adodb_driver, array("mysql", "mysqlt", "mysqli", "pdo_mysql", "postgres"))) {
	echo 'ADODB driver ' . $adodb_driver . ' not yet supported';
	exit;
}


// connect to database
if(RDBMS == "ADODB") {

	switch($adodb_driver) {
		case 'mysql':
		case 'mysqlt':
		case 'mysqli':
		case 'pdo_mysql':
			$dsn = $adodb_driver . '://' . $db_user . ':' . rawurlencode($db_passwd) . '@' . $db_server . '/' . $db_name . '?fetchmode=' . ADODB_FETCH_ASSOC;
			$conn = NewADOConnection($dsn);
			if($conn == false) {
				echo 'No database connection using ADODB (with driver ' . $adodb_driver . ')...';
				exit;
			}
			$conn->execute('SET NAMES UTF8');
			break;
		case 'postgres':
			$dsn = $adodb_driver . '://' . $db_user . ':' . rawurlencode($db_passwd) . '@' . $db_server . '/' . $db_name . '?fetchmode=' . ADODB_FETCH_ASSOC;
			$conn = NewADOConnection($dsn);
			if($conn == false) {
				echo 'No database connection using ADODB (with driver ' . $adodb_driver . ')...';
				exit;
			}
			break;
	}

} else if(RDBMS == "POSTGRES") {
	$dsn = 'host=' . $db_server . ' port=' . $db_port . ' dbname=' . $db_name .
		' user=' . $db_user . ' password=' . rawurlencode($db_passwd);
	$conn = pg_connect($dsn);
	if($conn == false) {
		echo 'No database connection using POSTGRES...';
		exit;
	}
}


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