<?php

// the following array could be produced from a database query

$categories = array(
	array(
		"lk_value" => "1",
		"lk_option" => "Category 1"
	),
	array(
		"lk_value" => "2",
		"lk_option" => "Category 2"
	),
	array(
		"lk_value" => "3",
		"lk_option" => "Category 3"
	),
	array(
		"lk_value" => "4",
		"lk_option" => "Category 4"
	)
);

echo json_encode($categories);