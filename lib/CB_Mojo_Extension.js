function CB_Mojo_Extension() {
    cb_mojo_ext = this; //Helps keep the confusion down in the functions
    cb_mojo_ext.ticket_id = "";
    cb_mojo_ext.queues = {};
    cb_mojo_ext.access_key = "";
    cb_mojo_ext.debug_mode = false;
    cb_mojo_ext.use_custom_fields = true;
    cb_mojo_ext.mojo_domain = "";
    cb_mojo_ext.custom_fields_json = "";
    cb_mojo_ext.email_address = "";
    cb_mojo_ext.mojo_agent_id = "";
    cb_mojo_ext.optionsUrl = chrome.extension.getURL("src/options/options.html");
    cb_mojo_ext.automated_avatar_url = chrome.extension.getURL("icons/optimus.gif");
    cb_mojo_ext.default_user_avatar_url = chrome.extension.getURL("icons/default_user.png");
    cb_mojo_ext.$update_form = null;
    cb_mojo_ext.popup_id = "cb_mojo_display";
    cb_mojo_ext.title_selector = "";
    cb_mojo_ext.custom_class = "custom_field";
    cb_mojo_ext.update_button_id = "cb_mojo_update_ticket";
    cb_mojo_ext.is_modal = false;
    cb_mojo_ext.option_page_url = '<center><a href="' + cb_mojo_ext.optionsUrl + '" target="_blank">click here to set it</a></center>';
    cb_mojo_ext.ticket_options = {
        66168: "Question",
        66169: "Incident",
        66170: "Problem",
        66171: "Task"
    };
    cb_mojo_ext.status_options = {
        10: "new",
        20: "in progress",
        30: "on hold",
        40: "information requested",
        50: "solved",
        60: "closed"
    };
    chrome.storage.sync.get({
        api_key: '',
        debug_mode: false,
        mojo_domain: 'collectivebias.mojohelpdesk.com',
        custom_fields_json: {
            "custom_field_sub_category": {
                "dependent_to": "ticket_type_id",
                "field_type": "select",
                "options": {
                    "66168": {
                        "enhancement request/feedback": "Enhancement Request/feedback",
                        "how to/training issue": "How To/training Issue",
                        "issue": "Issue",
                        "user error": "User Error"
                    },
                    "66169": {
                        "application issue or failure": "Application Issue or Failure",
                        "hardware issue or failure": "Hardware Issue or Failure",
                        "network issue or failure": "Network Issue or Failure"
                    },
                    "66170": {
                        "bug": "Bug",
                        "duplicate": "Duplicate",
                        "known error": "Known Error"
                    },
                    "66171": {
                        "account/identity management task": "Account/identity Management Task",
                        "enhancement task": "Enhancement Task",
                        "support/training task": "Support/training Task"
                    }
                },
                "pretty_name": "Sub Category"
            }
        },
        email_address: "",
        mojo_agent_id: "",
        use_custom_fields: true,
        title_selector: "Collective Bias Helpdesk"
    }, function(items) {
        cb_mojo_ext.access_key = items.api_key;
        cb_mojo_ext.debug_mode = items.debug_mode;
        cb_mojo_ext.mojo_domain = items.mojo_domain;
        cb_mojo_ext.email_address = items.email_address;
        cb_mojo_ext.mojo_agent_id = items.mojo_agent_id;
        cb_mojo_ext.custom_fields_json = items.custom_fields_json;
        cb_mojo_ext.use_custom_fields = items.use_custom_fields;
        cb_mojo_ext.title_selector = items.title_selector;
        cb_mojo_ext.baseURI = null;
        if (cb_mojo_ext.debug_mode == true) {
            console.log(items);
        }
    });
}