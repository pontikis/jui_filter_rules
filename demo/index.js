$(function() {

    var elem_dlg_rules = $("#dlg_rules");
    var elem_dlg_sql = $("#dlg_sql");

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
                    filter_element_properties: {type: "text", "class": "test1"}, // id, name will be ignored (non input text value, checked, selected)
                    vertical_orientation: "no", // default
                    filter_widget: "datepicker",
                    filter_widget_properties: {dateformat: "yy-mm-dd", changeMonth: true, changeYear: true},
                    filter_widget_locale: "",
                    returns_no_value: ""
                }
            ],
            lookup_values: [], lookup_values_ajax_url: ""

        }
    ];
    // N O T E S

    // demo_rules1 -------------------------------------------------------------
    $("#demo_rules1").jui_filter_rules({

        filters: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname", filterLabel: "Last name",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input", filter_element_properties: {"type": "text", "value": "Smith", "class": "lastname"}
                    }
                ]
            },
            {
                filterName: "AgeInYears", "filterType": "number", field: "age", filterLabel: "Age (years)",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input", filter_element_properties: {type: "text"}
                    }
                ]
            },
            {
                filterName: "DateInserted", "filterType": "date", field: "date_inserted", filterLabel: "Date inserted",
                excluded_operators: ["in", "not_in"],
                filter_interface: [
                    {
                        filter_element: "input", filter_element_properties: {type: "text"},
                        filter_widget: "datepicker",
                        filter_widget_properties: {
                            dateformat: "yy-mm-dd",
                            changeMonth: true,
                            changeYear: true
                        }
                    }
                ]
            },
            {
                filterName: "Category", "filterType": "number", field: "category", filterLabel: "Category (ajax data)",
                excluded_operators: ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "input",
                        filter_element_properties: {type: "checkbox"},
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
                        filter_element_properties: {type: "radio"}
                    }
                ],
                lookup_values: [
                    {lk_option: "Level1", lk_value: 1},
                    {lk_option: "Level2", lk_value: 2},
                    {lk_option: "Level3", lk_value: 3, lk_selected: "yes"}
                ]
            },
            {
                filterName: "Language", "filterType": "number", field: "language", filterLabel: "Language (ajax data)",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "select", filter_element_properties: {size: "1"}
                    }
                ],
                lookup_values_ajax_url: "ajax/ajax_languages.php"
            },
            {
                filterName: "Company", "filterType": "number", field: "company", filterLabel: "Company",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "select", filter_element_properties: {size: "1"}
                    }
                ],
                lookup_values: [
                    {lk_option: "Company1", lk_value: 1},
                    {lk_option: "Company2", lk_value: 2},
                    {lk_option: "Company3", lk_value: 3, lk_selected: "yes"}
                ]
            },
            {
                filterName: "Country", "filterType": "text", field: "country", filterLabel: "Country",
                excluded_operators: ["in", "not_in", "less", "less_or_equal", "greater", "greater_or_equal"],
                filter_interface: [
                    {
                        filter_element: "input", filter_element_properties: {type: "text"}
                    },
                    {
                        filter_element: "input", filter_element_properties: {type: "text", "class": "ftl_autocomplete"},
                        filter_widget: "autocomplete",
                        filter_widget_properties: {
                            source: "ajax/ajax_countries.php",
                            minLength: 2
                        },
                        filter_widget_locale: "",
                        returns_no_value: "yes"
                    }
                ]
            }
        ],

        containerClass: "rules1_container"

    }).resizable();

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
            elem_dlg_rules.html('<pre>' + JSON.stringify($("#demo_rules1").jui_filter_rules("getRules", 0, []), null, '    ') + '</pre>');
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
            var a_rules = $("#demo_rules1").jui_filter_rules("getRules", 0, []);

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
        elem_dlg_rules.dialog("open");
        return false;
    });

    $("#create_sql_php").click(function() {
        elem_dlg_sql.dialog("open");
        return false;
    });

});