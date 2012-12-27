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


// connect to database
$dsn = $adodb_driver . '://' . $db_user . ':' . rawurlencode($db_passwd) . '@' . $db_server . '/' . $db_name . '?fetchmode=' . ADODB_FETCH_ASSOC;
$conn = NewADOConnection($dsn);
$conn->execute('SET NAMES UTF8');

// get params
$term = trim($_GET['term']);

$pos = mb_strpos($term, "%");
if($pos === false) {

	$sql = 'SELECT iso_code as id, country as value FROM lk_countries WHERE country LIKE ' . $conn->qstr($term . '%') . ' ORDER BY country';

	$rs = $conn->Execute($sql);
	if($rs === false) {
		trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->ErrorMsg(), E_USER_ERROR);
	} else {
		$res = $rs->GetRows();
	}
}

echo json_encode($res);