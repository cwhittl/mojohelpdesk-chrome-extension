function CB_Mojo_Extension(afterLoadFunction) {
    cb_mojo_ext = this; //Helps keep the confusion down in the functions
    cb_mojo_ext.api_key = "";
    cb_mojo_ext.debug_mode = false;
    cb_mojo_ext.use_custom_fields = true;
    cb_mojo_ext.mojo_domain = "";
    cb_mojo_ext.email_domain = "mail.google.com";
    cb_mojo_ext.custom_fields_json = [
        {
            "custom_field_reason_for_hold": {
                "dependent_field_name": "status_id",
                "dependent_field_value": "30"
            }
        }, {
            "custom_field_sub_category": {
                "dependent_field_name": "ticket_type_id",
                "field_type": "select",
                "options": {
                    "66168": [
                        {
                            "key": "enhancement request/feedback",
                            "value": "Enhancement Request/feedback"
                        }, {
                            "key": "how to/training issue",
                            "value": "How To/training Issue"
                        }, {
                            "key": "issue",
                            "value": "Issue"
                        }, {
                            "key": "user error",
                            "value": "User Error"
                        }
                    ],
                    "66169": [
                        {
                            "key": "application issue or failure",
                            "value": "Application Issue or Failure"
                        }, {
                            "key": "hardware issue or failure",
                            "value": "Hardware Issue or Failure"
                        }, {
                            "key": "network issue or failure",
                            "value": "Network Issue or Failure"
                        }
                    ],
                    "66170": [
                        {
                            "key": "bug",
                            "value": "Bug"
                        }, {
                            "key": "duplicate",
                            "value": "Duplicate"
                        }, {
                            "key": "known error",
                            "value": "Known Error"
                        }
                    ],
                    "66171": [
                        {
                            "key": "account/identity management task",
                            "value": "Account/identity Management Task"
                        }, {
                            "key": "enhancement task",
                            "value": "Enhancement Task"
                        }, {
                            "key": "support/training task",
                            "value": "Support/training Task"
                        }
                    ]
                },
                "pretty_name": "Sub Category"
            }
        }
    ];
    cb_mojo_ext.email_address = "";
    cb_mojo_ext.mojo_agent_id = "";
    cb_mojo_ext.optionsUrl = chrome.extension.getURL("options/options.html");
    cb_mojo_ext.ticket_id = "";
    cb_mojo_ext.queues = [];
    cb_mojo_ext.ticket_options = [
        {
            key: 66169,
            value: "Incident"
        }, {
            key: 66170,
            value: "Problem"
        }, {
            key: 66168,
            value: "Question"
        }, {
            key: 66171,
            value: "Task"
        }
    ];
    cb_mojo_ext.status_options = [
        {
            key: 10,
            value: "new"
        }, {
            key: 20,
            value: "in progress"
        }, {
            key: 40,
            value: "information requested"
        }, {
            key: 50,
            value: "solved"
        }, {
            key: 30,
            value: "on hold"
        }, {
            key: 60,
            value: "closed"
        }
    ];
    cb_mojo_ext.priority_options = [
        {
            key: 10,
            value: "emergency"
        }, {
            key: 20,
            value: "urgent"
        }, {
            key: 30,
            value: "normal"
        }, {
            key: 40,
            value: "low"
        }
    ];
    cb_mojo_ext.enforce_slas = true;
    cb_mojo_ext.emergency_scheduled_on_days = 1;
    cb_mojo_ext.emergency_due_on_days = 1;
    cb_mojo_ext.urgent_scheduled_on_days = 2;
    cb_mojo_ext.urgent_due_on_days = 2;
    cb_mojo_ext.normal_scheduled_on_days = 15;
    cb_mojo_ext.normal_due_on_days = 32;
    cb_mojo_ext.low_scheduled_on_days = 30;
    cb_mojo_ext.low_due_on_days = 47;

    Shared.getStorage({
        api_key: cb_mojo_ext.api_key,
        debug_mode: cb_mojo_ext.debug_mode,
        mojo_domain: cb_mojo_ext.mojo_domain,
        email_domain: cb_mojo_ext.email_domain,
        custom_fields_json: cb_mojo_ext.custom_fields_json,
        email_address: cb_mojo_ext.email_address,
        mojo_agent_id: cb_mojo_ext.mojo_agent_id,
        use_custom_fields: cb_mojo_ext.use_custom_fields,
        enforce_slas: cb_mojo_ext.enforce_slas,
        emergency_due_on_days: cb_mojo_ext.emergency_due_on_days,
        emergency_scheduled_on_days: cb_mojo_ext.emergency_scheduled_on_days,
        urgent_due_on_days: cb_mojo_ext.urgent_due_on_days,
        urgent_scheduled_on_days: cb_mojo_ext.urgent_scheduled_on_days,
        normal_due_on_days: cb_mojo_ext.normal_due_on_days,
        normal_scheduled_on_days: cb_mojo_ext.normal_scheduled_on_days,
        low_due_on_days: cb_mojo_ext.low_due_on_days,
        low_scheduled_on_days: cb_mojo_ext.low_scheduled_on_days
    }, function(items) {
        cb_mojo_ext.api_key = items.api_key;
        cb_mojo_ext.debug_mode = items.debug_mode;
        cb_mojo_ext.mojo_domain = items.mojo_domain;
        cb_mojo_ext.email_domain = items.email_domain;
        cb_mojo_ext.email_address = items.email_address;
        cb_mojo_ext.mojo_agent_id = items.mojo_agent_id;
        cb_mojo_ext.custom_fields_json = items.custom_fields_json;
        cb_mojo_ext.use_custom_fields = items.use_custom_fields;
        cb_mojo_ext.baseURI = null;
        cb_mojo_ext.enforce_slas = items.enforce_slas;
        cb_mojo_ext.emergency_due_on_days = items.emergency_due_on_days;
        cb_mojo_ext.emergency_scheduled_on_days = items.emergency_scheduled_on_days;
        cb_mojo_ext.urgent_due_on_days = items.urgent_due_on_days;
        cb_mojo_ext.urgent_scheduled_on_days = items.urgent_scheduled_on_days;
        cb_mojo_ext.normal_due_on_days = items.normal_due_on_days;
        cb_mojo_ext.normal_scheduled_on_days = items.normal_scheduled_on_days;
        cb_mojo_ext.low_due_on_days = items.low_due_on_days;
        cb_mojo_ext.low_scheduled_on_days = items.low_scheduled_on_days;
        Shared.setDebug(cb_mojo_ext.debug_mode);
        debug.info(items);
        afterLoadFunction(cb_mojo_ext);
    });
}
