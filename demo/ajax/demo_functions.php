<?php

/**
 * Convert date (without time) of given format to YYYYMMDD string
 *
 * @param string $str_user_date
 * @param string $str_user_dateformat
 * @return string
 */
function date_encode($str_user_date, $str_user_dateformat) {
	$date = DateTime::createFromFormat($str_user_dateformat, $str_user_date);
	return $date->format("Y") . $date->format("m") . $date->format("d");
}
?>