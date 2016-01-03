function CB_Mojo_Extension() {
    console.log("Loading Mojo HelpDesk Extension by Collective Bias");
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
        mojo_domain: '',
        custom_fields_json: {},
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
        cb_mojo_ext.baseURI = null;
        if (cb_mojo_ext.debug_mode == true) {
            console.log(items);
        }
        // set up an observer for the title element
        //If you wanted to get more serious you could look at this https://github.com/kartiktalwar/gmail.js
        cb_mojo_ext.target = document.querySelector('head > title');
        cb_mojo_ext.observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (cb_mojo_ext.baseURI == mutation.target.baseURI) {
                    return;
                }
                cb_mojo_ext.baseURI = mutation.target.baseURI;
                console.log(mutation);
                if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
                    cb_mojo_ext.is_modal = true
                    var ticket_id = window.location.href.split("/").slice(-1)[0].split("?").slice(0)[0];
                    cb_mojo_ext.ticket_id = ticket_id;
                    cb_mojo_ext.enhance_mojo_ui(cb_mojo_ext);
                } else {
                    var title = mutation.target.textContent;
                    cb_mojo_ext.title_selector = items.title_selector;
                    if (title.indexOf(cb_mojo_ext.title_selector) > 0 && title.indexOf("(#") > 0) {
                        var ticket_id = title.substring(title.indexOf("(#") + 2, title.lastIndexOf(")")).trim();
                        console.log(title);
                        console.log("|" + ticket_id + "| vs |" + cb_mojo_ext.ticket_id + "|");
                        cb_mojo_ext.ticket_id = ticket_id;
                        cb_mojo_ext.create_form_container();
                    } else {
                        if (cb_mojo_ext.$update_form != null) {
                            cb_mojo_ext.$update_form.remove();
                        }
                    }
                }
            });
        });
        if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
            cb_mojo_ext.enhance_mojo_ui(cb_mojo_ext);
        }
        cb_mojo_ext.observer.observe(cb_mojo_ext.target, {
            subtree: true,
            characterData: true,
            childList: true
        });
    });
    cb_mojo_ext.enhance_mojo_ui = function() {
        setTimeout(function(e) {
            if (!$.isNumeric(cb_mojo_ext.ticket_id)) {
                return;
            }
            jQuery("#ticket-form-info table tr").on("click", function() {
                cb_mojo_ext.create_form_container();
            });
            jQuery('a[ng-click="onEditAssigneeQueueType()"]').on("click", function() {
                setTimeout(function() {
                    jQuery('a[ng-click="onSaveAssigneeQueueType()"]').on("click", function() {
                        cb_mojo_ext.create_form_container();
                    });
                }, 1000)
            });
            jQuery(".ticket-side-options a").on("click", function() {
                $btn = jQuery(this);
                $subcategory_field = $btn.closest("#ticket-form-info").find("label:contains('Sub Category')").nextAll('input').first();
                $subcategory_field.prop('disabled', true);
                $subcategory_field_change = jQuery("<button>Change Sub Category</button>");
                $subcategory_field_change.on("click", function() {
                    cb_mojo_ext.create_form_container();
                });
                $subcategory_field_change.insertAfter($subcategory_field);
            });
        }, 1000);
    };
    cb_mojo_ext.create_form_container = function() {
        if ($("#" + cb_mojo_ext.popup_id).length > 0) {
            return;
        }
        var html = "<div id='" + cb_mojo_ext.popup_id + "' class='scrollbox'>";
        if (!cb_mojo_ext.is_modal) {
            html = html + "<div class='title'>Mojo Update <img src='" + chrome.extension.getURL("icons/icon19.png") + "'></div>";
        }
        html = html + '<div class="ui-widget success_msg" style="display:none;"><div class="ui-state-highlight ui-corner-all" style="margin-top: 20px; padding: 0 .7em;"><p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span><span class="message"></span></p></div></div>';
        html = html + '<div class="ui-widget error_msg" style="display:none;"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><span class="message"></span></p></div></div>';
        html = html + "<div class='ticket_content'></div>";
        html = html + "</div>";
        if (cb_mojo_ext.is_modal) {
            $("body").append(html);
        } else {
            $('div[role="complementary"] .u5').append(html);
        }
        cb_mojo_ext.$update_form = $("#" + cb_mojo_ext.popup_id);
        cb_mojo_ext.$update_form.on("associated_users", cb_mojo_ext.get_associated_users);
        CB_Mojo_UI.fill_form_container(cb_mojo_ext);
        cb_mojo_ext.get_queues();
    }
    cb_mojo_ext.get_associated_users = function(event, associated_users) {
        associated_users = Shared.unique(associated_users);
        console.log(associated_users);
        if (!cb_mojo_ext.access_key) {
            cb_mojo_ext.$update_form.trigger("message", ["error", "Missing API Key <br/>" + cb_mojo_ext.option_page_url]);
            return;
        }
        for (var i in associated_users) {
            var email = associated_users[i];
            if (typeof(email) == "undefined" || email == "undefined") {
                CB_Mojo_UI.update_user("undefined", "Automated", cb_mojo_ext.automated_avatar_url);
            } else {
                $.ajax({
                    url: "https://mysupport.mojohelpdesk.com/api/users/get_by_email.json?email=" + encodeURIComponent(email) + "&access_key=" + cb_mojo_ext.access_key,
                    // The name of the callback parameter, as specified by the YQL service
                    jsonp: "callback",
                    // Tell jQuery we're expecting JSONP
                    dataType: "json",
                    success: function(response) {
                        var email = response.user.email;
                        var full_name = response.user.first_name + " " + response.user.last_name;
                        var picture_url = response.user.picture_url;
                        if (typeof(picture_url) == "undefined" || picture_url == "undefined" || picture_url == null || picture_url == "null") {
                            picture_url = cb_mojo_ext.default_user_avatar_url;
                        }
                        CB_Mojo_UI.update_user(email, full_name, picture_url);
                    },
                    error: function(response) {
                        //if (cb_mojo_ext.debug_mode == true) {
                        console.log(response);
                        //}
                    }
                });
            }
        }
    };
    cb_mojo_ext.get_queues = function() {
        if (!cb_mojo_ext.access_key) {
            cb_mojo_ext.$update_form.trigger("message", ["error", "Missing API Key <br/>" + cb_mojo_ext.option_page_url]);
            return;
        }
        $.ajax({
            url: "https://mysupport.mojohelpdesk.com/api/ticket_queues.json?access_key=" + cb_mojo_ext.access_key,
            // The name of the callback parameter, as specified by the YQL service
            jsonp: "callback",
            // Tell jQuery we're expecting JSONP
            dataType: "json",
            success: function(response) {
                if (cb_mojo_ext.debug_mode == true) {
                    console.log(response);
                } // server response
                var queues = {};
                $.each(response, function() {
                    $.each(this, function(k, v) {
                        queues[v.id] = v.name;
                    });
                });
                cb_mojo_ext.queues = queues;
                cb_mojo_ext.get_agent_id();
            },
            error: function(response) {
                if (cb_mojo_ext.debug_mode == true) {
                    console.log(response);
                }
            }
        });
    };
    cb_mojo_ext.get_agent_id = function() {
        if (cb_mojo_ext.access_key != "" && cb_mojo_ext.email_address != "") {
            $.ajax({
                url: "https://mysupport.mojohelpdesk.com/api/users/get_by_email.json?email=" + cb_mojo_ext.email_address + "&access_key=" + cb_mojo_ext.access_key,
                jsonp: "callback",
                dataType: "json",
                success: function(response) {
                    if (cb_mojo_ext.debug_mode == true) {
                        console.log(response.user.id);
                    }
                    cb_mojo_ext.mojo_agent_id = response.user.id;
                    chrome.storage.sync.set({
                        mojo_agent_id: cb_mojo_ext.mojo_agent_id
                    }, function() {
                        cb_mojo_ext.get_ticket();
                    });
                },
                error: function(response) {
                    if (cb_mojo_ext.debug_mode == true) {
                        console.log(response);
                    }
                }
            });
        }
    };
    cb_mojo_ext.send_private_message = function(event) {
        var ticket_id = event.data.ticket_id;
        //var ticket_id = event.data("ticket_id");
        var XMLData = "<comment>";
        var value = "";
        jQuery(".ticket_private_message textarea").each(function() {
            var $this = $(this);
            if ($(this).val()) {
                value = $(this).val();
                return false;
            }
        });
        if (value == "") {
            cb_mojo_ext.$update_form.trigger("message", ["error", "Please enter a message"]);
            return;
        }
        XMLData = XMLData + "<body>" + value + "</body>";
        XMLData = XMLData + "<is_private>true</is_private>";
        XMLData = XMLData + "</comment>";
        if (cb_mojo_ext.debug_mode == true) {
            console.log(XMLData);
        }
        $.ajax({
            url: "https://mysupport.mojohelpdesk.com/api/tickets/" + ticket_id + "/comments?access_key=" + cb_mojo_ext.access_key,
            type: "POST",
            contentType: 'application/xml',
            processData: false,
            data: XMLData,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                jQuery(".ticket_messages").trigger("message", ["error", errorThrown]);
            },
            success: function(data, textStatus, XMLHttpRequest) {
                jQuery(".ticket_messages").trigger("message", ["info", "Message Sent"]);
                $(".ui-dialog-content").dialog("close");
                jQuery(".ticket_private_message textarea").val("");
                if (cb_mojo_ext.is_modal) {
                    setTimeout(function() {
                        location.reload();
                    }, 750);
                }
            }
        });
    };
    cb_mojo_ext.send_form = function(event) {
        var ticket_id = $(this).data("ticket_id");
        var XMLData = "<ticket>";
        XMLData = XMLData + "<ticket_queue_id>" + cb_mojo_ext.$update_form.find("#ticket_queue_id").val() + "</ticket_queue_id>"
        XMLData = XMLData + "<ticket_type_id>" + cb_mojo_ext.$update_form.find("#ticket_type_id").val() + "</ticket_type_id>";
        XMLData = XMLData + "<assigned_to_id>" + cb_mojo_ext.$update_form.find("#assigned_to_id").val() + "</assigned_to_id>";
        XMLData = XMLData + "<status_id>" + cb_mojo_ext.$update_form.find("#status_id").val() + "</status_id>";
        cb_mojo_ext.$update_form.find("." + cb_mojo_ext.custom_class).each(function() {
            var $this = $(this);
            XMLData = XMLData + "<" + $this.attr("id") + ">" + $(this).val() + "</" + $this.attr("id") + ">";
        });
        XMLData = XMLData + "</ticket>";
        console.log(XMLData);
        if (cb_mojo_ext.debug_mode == true) {
            console.log(XMLData);
        }
        $.ajax({
            url: "https://mysupport.mojohelpdesk.com/api/tickets/" + ticket_id + "?access_key=" + cb_mojo_ext.access_key,
            type: "PUT",
            contentType: 'application/xml',
            processData: false,
            data: XMLData,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                cb_mojo_ext.$update_form.trigger("message", ["error", errorThrown]);
            },
            success: function(data, textStatus, XMLHttpRequest) {
                cb_mojo_ext.$update_form.trigger("message", ["info", "Ticket Updated"]);
                if (cb_mojo_ext.is_modal) {
                    setTimeout(function() {
                        location.reload();
                    }, 750);
                }
            }
        });
    };
    cb_mojo_ext.get_ticket = function() {
        cb_mojo_ext.$update_form.find(".ticket_content").html("Loading Ticket #" + cb_mojo_ext.ticket_id + "<br/> Please Wait...");
        $.ajax({
            url: "https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + ".json?access_key=" + cb_mojo_ext.access_key,
            // The name of the callback parameter, as specified by the YQL service
            jsonp: "callback",
            // Tell jQuery we're expecting JSONP
            dataType: "json",
            // Work with the response
            success: function(response) {
                if (cb_mojo_ext.debug_mode == true) {
                    console.log(response);
                }
                if (response.ticket) {
                    CB_Mojo_UI.create_form(response, cb_mojo_ext);
                }
            },
            error: function(response) {
                if (cb_mojo_ext.debug_mode == true) {
                    console.log(response);
                }
            }
        });
    };
    console.log("Finished Loading Mojo HelpDesk Extension by Collective Bias");
}