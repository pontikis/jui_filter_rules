$(function() {

    var elem_dlg_rules = $("#dlg_rules");
    var elem_dlg_sql = $("#dlg_sql");
    var a_rules;

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // N O T E S
    var operators_tmpl = ["equal", "not_equal", "in", "not_in",
        "less", "less_or_equal", "greater", "greater_or_equal",
        "begins_with", "not_begins_with", "contains", "not_contains", "ends_with", "not_ends_with", "is_empty", "is_not_empty",
        "is_null", "is_not_null"];

    var filters_template = [
        {
            filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
            excluded_operators: ["in", "not_in"],
            filter_interface: [
                {
                    filter_element: "input",
                    filter_element_attributes: {type: "text", "class": "test1"}, // id, name will be ignored (non input text value, checked, selected)
                    vertical_orientation: "no", // default
                    filter_widget: "datepicker",
                    filter_widget_properties: {dateFormat: "yy-mm-dd", changeMonth: true, changeYear: true},
                    returns_no_value: ""
                }
            ],
            lookup_values: [], lookup_values_ajax_url: ""

        }
    ];
    // N O T E S

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
                        filter_element_attributes: {type: "text"},
                        filter_widget: "spinner",
                        filter_widget_properties: {
                            min: 0,
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
                        filter_element_attributes: {type: "text", disabled: "disabled", "class": "ftl_slider_value"}
                    },
                    {
                        filter_element: "div",
                        filter_element_attributes: {"class": "ftl_slider"},
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
                validate_dateformat: ["dd/MM/yyyy"],
                filter_value_conversion: {
                    function_name: "toUTCtimestamp",
                    args: ["dd/mm/yy", ""]
                }
            },
            {
                filterName: "DateUpdated", "filterType": "date", field: "date_updated", filterLabel: "Datetime updated",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_attributes: {type: "text"},
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
                validate_dateformat: ["dd/MM/yyyy HH:mm:ss"],
                format_value: ""

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
                filterName: "Language", "filterType": "number", field: "language", filterLabel: "Language (ajax data)",
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
                filterName: "Country", "filterType": "number", field: "country", filterLabel: "Country",
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
        decimal_separator: ',',

        htmlentities: false,

        onValidationError: function(event, data) {
            alert(data["err_description"] + ' (error: ' + data["err_num"] + ')');
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
                    a_rules: a_rules
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

    $("#create_sql_php").click(function() {
        a_rules = $("#demo_rules1").jui_filter_rules("getRules", 0, []);
        if(a_rules !== false) {
            elem_dlg_sql.dialog("open");
            return false;
        }
    });

});

/**
 * Convert local timezone date string to UTC timestamp
 * @param dateformat
 * @param timeformat
 * @param date_str
 */
function toUTCtimestamp(dateformat, timeformat, date_str) {
    var date = $.datepicker.parseDateTime(dateformat, timeformat, date_str);

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
 * @constructor
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
