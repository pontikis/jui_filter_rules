jui_filter_rules
================

jui_filter_rules is a jQuery plugin, useful to create or set filter rules as JSON object and get the relevant WHERE SQL.

Project page: [https://pontikis.net/labs/jui_filter_rules][HOME]
[HOME]: http://pontikis.net/labs/jui_filter_rules

Copyright Christos Pontikis [http://pontikis.net][copyright]
[copyright]: http://pontikis.net

License [MIT][mit]
[mit]: https://raw.github.com/pontikis/jui_filter_rules/master/MIT_LICENSE

Release 1.0.5 (27 May 2014)
--------------------------
* Set Rules functionality: If you define `filter_rules` option, `jui_filter_rules` will display default filters on startup. You can also apply a filter_rules set, using `setRules` method.
* `onSetRules` event
* bowser.js removed from dependencies (a CSS hack for IE8 added instead)
* Default `filter_interface`
* `filter_element_attributes` cannot missing
* php class: is_empty BUG FIX (is_empty returned null instead of '')

Release 1.0.4 (09 May 2014)
--------------------------
* Twitter Bootstrap support (bootstarp_version option, one of: false, "2", "3"). The default is:  false
* php class: [Da Capo database wrapper][dacapo] is used (so MYSQLi and POSTGRES are supported at this time)
[dacapo]: https://github.com/pontikis/dacapo

Release 1.0.3 (19 Oct 2013)
--------------------------
* php class: Set type of each bind param (prepared statements). One of string, int, float, null
* php class: ajax_create_sql.dist.php, jui_filter_rules ajax creating sql template script

Release 1.0.2 (16 Oct 2013)
--------------------------
* Filter numberType property (number filters numberType: integer, double - required only for MySQLi with prepared statements)
* php class: MYSQL support (use of this driver is not recommended in PHP - use MYSQLi or MYSQL_PDO instead)
* php class: MYSQL_PDO support

Release 1.0.1 (05 Oct 2013)
--------------------------
* $.browser is not used anymore, as it removed in jQuery >= 1.9, so latest jquery can be used. Browser detection using bowser (https://github.com/ded/bowser). In next version browser detection will be probaly replaced by feature detection using Modernizr
* php class: MySQLi support

Release 1.00 (24 Jan 2013)
--------------------------
* Create rules as JSON object
* Create WHERE SQL from rules using prepared statements or not (available in php)
* Support nested filter groups
* Restrict operators per filter
* Filter types: text, number, date
* Supported form elements: input (text, radio, checkbox), select
* Supported widgets: jquery ui autocomplete, slider, spinner, datepicker (and timepicker by Trent Richardson)
* Filter default value supported
* Filter value validation
* Filter value conversion using javascript (or server side) function
* Localization