$(function() {

    var elem_dlg_log1 = $("#dlg_demo_rules1_log"),
        log;

    // theme switcher ----------------------------------------------------------
    $("#ui-theme-switcher").change(function() {
        var theme_url = $(this).val();
        $("#ui-theme").attr("href", theme_url);
    });

    // demo_rules1 -------------------------------------------------------------
    $("#demo_rules1").jui_filter_rules({


        filters: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname",filterLabel: "Last name",
                html: [
                    {element: "input",type: "text"}
                ]
            },
            {
                filterName: "Firstname", "filterType": "text", field: "firstname",filterLabel: "First name",
                html: [
                    {element: "input",type: "text"}
                ]
            }
        ],

        filter_rules: [],

        filters1: [
            {
                filterName: "Lastname", "filterType": "text", field: "lastname",
                html: [
                    {
                        element: "",
                        type: "text",
                        label: "aaa"
                    }
                ],
                widgets: [
                    {
                        type: "datepicker",
                        dateformat: "aaaa",
                        timeformat: ""
                    }
                ],
                repeat: 0, // a number or 'auto' according to values_predefined or values_ajax_url (0 = no repeat)
                values_predefined: [
                    {
                        option: "aaaa",
                        value: ""
                    }
                ],
                values_ajax_url: ""
            }
        ],

        filter_rules1: [
            {filterName: "Lastname", operator: "", value: []},
            {filterName: "Lastname", operator: "", value: []},
            {filterName: "Firstname", operator: "", value: []}
        ]

    });



    elem_dlg_log1.dialog({
        autoOpen: true,
        width: 250,
        height: 200,
        position: {
            my: "left",
            at: "right",
            of: '#demo_rules1'
        },
        title: "Log demo_rules1"
    });

    $("#log_show").click(function() {
        elem_dlg_log1.dialog("open");
        return false;
    });

    $("#log_hide").click(function() {
        elem_dlg_log1.dialog("close");
        return false;
    });

    $("#log_clear").click(function() {
        elem_dlg_log1.html('');
    });


});

function create_log(elem_log, log_line) {
    var line_number = parseInt(elem_log.find("p").length) + 1;
    elem_log.prepend('<p>' + line_number + ') ' + log_line);
}