$(function() {

    var elem_dlg_rules = $("#dlg_rules");
    var elem_dlg_sql = $("#dlg_sql");
    var a_rules;
    var user_prepered_statements = "yes";


    // detect timezone
    $('#tz_info').html('<strong>Detected timezone: </strong>' + getTimezoneName() + ' ' + getTZoffset());

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo_rules1 -------------------------------------------------------------
    $("#demo_rules1_container").resizable();


    $("#demo_rules1").jui_filter_rules({

        filters: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {"type": "text", "value": "Smith", "class": "lastname"}
                    }
                ]
            },
            {
                filterName: "AgeInYears", "filterType": "number", field: "age", filterLabel: "Age (years)",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {type: "text"}
                    }
                ]
            },
            {
                filterName: "GroupMembers", "filterType": "number", field: "group_members", filterLabel: "Group Members",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {
                            type: "text",
                            value: "1"
                        },
                        filter_widget: "spinner",
                        filter_widget_properties: {
                            min: 1,
                            max: 10
                        }
                    }

                ]
            },
            {
                filterName: "PerCentCompleted", "filterType": "number", field: "percent_completed", filterLabel: "PerCent Completed",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {
                            type: "text",
                            disabled: "disabled",
                            "class": "ftl_slider_value"
                        }
                    },
                    {
                        filter_element: "div",
                        filter_element_attributes: {
                            "class": "ftl_slider"
                        },
                        filter_widget: "slider",
                        filter_widget_properties: {
                            min: 0,
                            max: 100,
                            slide: function(event, ui) {
                                $(this).prev("input").val(ui.value);
                            }
                        },
                        returns_no_value: "yes"
                    }
                ]
            },
            {
                filterName: "DateInserted", "filterType": "date", field: "date_inserted", filterLabel: "Date inserted",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {
                            type: "text",
                            title: "Set the date using format: dd/mm/yyyy"
                        },
                        filter_widget: "datepicker",
                        filter_widget_properties: {
                            dateFormat: "dd/mm/yy",
                            changeMonth: true,
                            changeYear: true
                        }
                    }
                ],
                validate_dateformat: ["DD/MM/YYYY"],
                filter_value_conversion_server_side: {
                    function_name: "date_encode",
                    args: ["Europe/Athens", "d/m/Y"]
                }
            },
            {
                filterName: "DateUpdated", "filterType": "date", field: "date_updated", filterLabel: "Datetime updated",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {
                            type: "text",
                            title: "Set the date and time using format: dd/mm/yyyy hh:mm:ss"
                        },
                        filter_widget: "datetimepicker",
                        filter_widget_properties: {
                            dateFormat: "dd/mm/yy",
                            timeFormat: "HH:mm:ss",
                            changeMonth: true,
                            changeYear: true,
                            showSecond: true
                        }
                    }
                ],
                validate_dateformat: ["DD/MM/YYYY HH:mm:ss"],
                filter_value_conversion: {
                    function_name: "local_date_to_UTC_timestamp",
                    args: ["DD/MM/YYYY HH:mm:ss"]
                }
            },
            {
                filterName: "Category", "filterType": "number", field: "category", filterLabel: "Category (ajax data)",
                excluded_operators: ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {type: "checkbox"},
                        vertical_orientation: "yes"
                    }
                ],
                lookup_values_ajax_url: "ajax/ajax_categories.php"
            },
            {
                filterName: "Level", "filterType": "number", field: "level", filterLabel: "Level",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {type: "radio"}
                    }
                ],
                lookup_values: [
                    {lk_option: "Level1", lk_value: "1"},
                    {lk_option: "Level2", lk_value: "2"},
                    {lk_option: "Level3", lk_value: "3", lk_selected: "yes"}
                ]
            },
            {
                filterName: "Language", "filterType": "text", field: "language", filterLabel: "Language code (ajax data)",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "select",
                        filter_element_attributes: {size: "1"}
                    }
                ],
                lookup_values_ajax_url: "ajax/ajax_languages.php"
            },
            {
                filterName: "Company", "filterType": "number", field: "company", filterLabel: "Company",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "select",
                        filter_element_attributes: {size: "1"}
                    }
                ],
                lookup_values: [
                    {lk_option: "Company1", lk_value: "1"},
                    {lk_option: "Company2", lk_value: "2"},
                    {lk_option: "Company3", lk_value: "3", lk_selected: "yes"}
                ]
            },
            {
                filterName: "Country", "filterType": "text", field: "country", filterLabel: "Country code",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {type: "text", disabled: "disabled", "class": "ftl_autocomplete_value"}
                    },
                    {
                        filter_element: "input",
                        filter_element_attributes: {type: "text", "class": "ftl_autocomplete"},
                        filter_widget: "autocomplete",
                        filter_widget_properties: {
                            source: "ajax/ajax_countries.php",
                            minLength: 1,
                            select: function(event, ui) {
                                $(this).prev("input").val(ui.item.id);
                            },
                            // mustMatch implementation
                            change: function(event, ui) {
                                if(ui.item == null) {
                                    $(this).val('');
                                    $(this).prev("input").val('');
                                }
                            }
                        },
                        returns_no_value: "yes"
                    }
                ]
            }
        ],

        filter_widget_locale: "el",
        decimal_separator: ",",

        htmlentities: false,

        onValidationError: function(event, data) {
            alert(data["err_description"] + ' (' + data["err_code"] + ')');
            data.elem_filter.focus();
        }

    });

    elem_dlg_rules.dialog({
        autoOpen: false,
        width: 650,
        height: 250,
        position: {
            my: "top",
            at: "top",
            of: '#demo_rules1'
        },
        title: "Rules",
        open: function() {
            elem_dlg_rules.html('<pre>' + JSON.stringify(a_rules, null, '    ') + '</pre>');
        }
    });

    elem_dlg_sql.dialog({
        autoOpen: false,
        width: 650,
        height: 250,
        position: {
            my: "top",
            at: "top",
            of: '#demo_rules1'
        },
        title: "SQL",
        open: function() {
            $.ajax({
                type: 'POST',
                url: "ajax/ajax_create_sql.php",
                data: {
                    a_rules: a_rules,
                    use_ps: user_prepered_statements
                },
                success: function(data) {
                    elem_dlg_sql.html('<pre>' + data + '</pre>');
                }
            });
        }
    });

    $("#show_rules").click(function() {
        a_rules = $("#demo_rules1").jui_filter_rules("getRules", 0, []);
        if(a_rules !== false) {
            elem_dlg_rules.dialog("open");
            return false;
        }
    });

    $("#mark_rules_as_applied").click(function() {
        $("#demo_rules1").jui_filter_rules("markRulesAsApplied");
    });


    $("#clear_rules").click(function() {
        $("#demo_rules1").jui_filter_rules("clearRules");
    });


    $("#create_sql_ps_php").click(function() {
        user_prepered_statements = "yes";
        a_rules = $("#demo_rules1").jui_filter_rules("getRules", 0, []);
        if(a_rules !== false) {
            if(a_rules.length > 0) {
                elem_dlg_sql.dialog("open");
                return false;
            } else {
                alert('No rules defined...')
            }
        }
    });

    $("#create_sql_php").click(function() {
        user_prepered_statements = "no";
        a_rules = $("#demo_rules1").jui_filter_rules("getRules", 0, []);
        if(a_rules !== false) {
            if(a_rules.length > 0) {
                elem_dlg_sql.dialog("open");
                return false;
            } else {
                alert('No rules defined...')
            }
        }
    });

});

/**
 * Convert local timezone date string to UTC timestamp
 *
 * Alternative syntax using jquery (instead of moment.js):
 *     var date = $.datepicker.parseDateTime(dateformat, timeformat, date_str);
 *
 * @see http://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
 * @param dateformat
 * @param date_str
 * @return {String}
 */
function local_date_to_UTC_timestamp(dateformat, date_str) {

    // avoid date overflow in user input (moment("14/14/2005", "DD/MM/YYYY") => Tue Feb 14 2006)
    if(moment(date_str, dateformat).isValid() == false) {
        throw new Error("Invalid date");
    }

    // parse date string using givn dateformat and create a javascript date object
    var date = moment(date_str, dateformat).toDate();

    // use javascript getUTC* functions to conv ert to UTC
    return  date.getUTCFullYear() +
        PadDigits(date.getUTCMonth() + 1, 2) +
        PadDigits(date.getUTCDate(), 2) +
        PadDigits(date.getUTCHours(), 2) +
        PadDigits(date.getUTCMinutes(), 2) +
        PadDigits(date.getUTCSeconds(), 2);

}


/**
 * Add leading zeros
 * @param n
 * @param totalDigits
 * @return {String}
 */
function PadDigits(n, totalDigits) {
    n = n.toString();
    var pd = '';
    if(totalDigits > n.length) {
        for(i = 0; i < (totalDigits - n.length); i++) {
            pd += '0';
        }
    }
    return pd + n.toString();
}

/**
 * @see http://stackoverflow.com/questions/2853474/can-i-get-the-browser-time-zone-in-asp-net-or-do-i-have-to-rely-on-js-operations
 * @return {String}
 */
function getTimezoneName() {
    var tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
    var so = -1 * tmSummer.getTimezoneOffset();
    var tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
    var wo = -1 * tmWinter.getTimezoneOffset();

    if(-660 == so && -660 == wo) return 'Pacific/Midway';
    if(-600 == so && -600 == wo) return 'Pacific/Tahiti';
    if(-570 == so && -570 == wo) return 'Pacific/Marquesas';
    if(-540 == so && -600 == wo) return 'America/Adak';
    if(-540 == so && -540 == wo) return 'Pacific/Gambier';
    if(-480 == so && -540 == wo) return 'US/Alaska';
    if(-480 == so && -480 == wo) return 'Pacific/Pitcairn';
    if(-420 == so && -480 == wo) return 'US/Pacific';
    if(-420 == so && -420 == wo) return 'US/Arizona';
    if(-360 == so && -420 == wo) return 'US/Mountain';
    if(-360 == so && -360 == wo) return 'America/Guatemala';
    if(-360 == so && -300 == wo) return 'Pacific/Easter';
    if(-300 == so && -360 == wo) return 'US/Central';
    if(-300 == so && -300 == wo) return 'America/Bogota';
    if(-240 == so && -300 == wo) return 'US/Eastern';
    if(-240 == so && -240 == wo) return 'America/Caracas';
    if(-240 == so && -180 == wo) return 'America/Santiago';
    if(-180 == so && -240 == wo) return 'Canada/Atlantic';
    if(-180 == so && -180 == wo) return 'America/Montevideo';
    if(-180 == so && -120 == wo) return 'America/Sao_Paulo';
    if(-150 == so && -210 == wo) return 'America/St_Johns';
    if(-120 == so && -180 == wo) return 'America/Godthab';
    if(-120 == so && -120 == wo) return 'America/Noronha';
    if(-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
    if(0 == so && -60 == wo) return 'Atlantic/Azores';
    if(0 == so && 0 == wo) return 'Africa/Casablanca';
    if(60 == so && 0 == wo) return 'Europe/London';
    if(60 == so && 60 == wo) return 'Africa/Algiers';
    if(60 == so && 120 == wo) return 'Africa/Windhoek';
    if(120 == so && 60 == wo) return 'Europe/Amsterdam';
    if(120 == so && 120 == wo) return 'Africa/Harare';
    if(180 == so && 120 == wo) return 'Europe/Athens';
    if(180 == so && 180 == wo) return 'Africa/Nairobi';
    if(240 == so && 180 == wo) return 'Europe/Moscow';
    if(240 == so && 240 == wo) return 'Asia/Dubai';
    if(270 == so && 210 == wo) return 'Asia/Tehran';
    if(270 == so && 270 == wo) return 'Asia/Kabul';
    if(300 == so && 240 == wo) return 'Asia/Baku';
    if(300 == so && 300 == wo) return 'Asia/Karachi';
    if(330 == so && 330 == wo) return 'Asia/Calcutta';
    if(345 == so && 345 == wo) return 'Asia/Katmandu';
    if(360 == so && 300 == wo) return 'Asia/Yekaterinburg';
    if(360 == so && 360 == wo) return 'Asia/Colombo';
    if(390 == so && 390 == wo) return 'Asia/Rangoon';
    if(420 == so && 360 == wo) return 'Asia/Almaty';
    if(420 == so && 420 == wo) return 'Asia/Bangkok';
    if(480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
    if(480 == so && 480 == wo) return 'Australia/Perth';
    if(540 == so && 480 == wo) return 'Asia/Irkutsk';
    if(540 == so && 540 == wo) return 'Asia/Tokyo';
    if(570 == so && 570 == wo) return 'Australia/Darwin';
    if(570 == so && 630 == wo) return 'Australia/Adelaide';
    if(600 == so && 540 == wo) return 'Asia/Yakutsk';
    if(600 == so && 600 == wo) return 'Australia/Brisbane';
    if(600 == so && 660 == wo) return 'Australia/Sydney';
    if(630 == so && 660 == wo) return 'Australia/Lord_Howe';
    if(660 == so && 600 == wo) return 'Asia/Vladivostok';
    if(660 == so && 660 == wo) return 'Pacific/Guadalcanal';
    if(690 == so && 690 == wo) return 'Pacific/Norfolk';
    if(720 == so && 660 == wo) return 'Asia/Magadan';
    if(720 == so && 720 == wo) return 'Pacific/Fiji';
    if(720 == so && 780 == wo) return 'Pacific/Auckland';
    if(765 == so && 825 == wo) return 'Pacific/Chatham';
    if(780 == so && 780 == wo) return 'Pacific/Enderbury'
    if(840 == so && 840 == wo) return 'Pacific/Kiritimati';
    return 'US/Pacific';
}

/**
 *
 * @return {String}
 */
function getTZoffset() {
    var today = new Date();
    var offset = -(today.getTimezoneOffset() / 60);
    if(parseInt(offset) < 0) {
        return 'GMT ' + offset;
    } else {
        return 'GMT +' + offset;
    }

}
