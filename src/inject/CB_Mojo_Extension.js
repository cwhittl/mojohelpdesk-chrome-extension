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
        if (cb_mojo_ext.debug_mode == true) {
            console.log(items);
        }
        // set up an observer for the title element
        //If you wanted to get more serious you could look at this https://github.com/kartiktalwar/gmail.js
        cb_mojo_ext.target = document.querySelector('head > title');
        cb_mojo_ext.observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
                    cb_mojo_ext.enhance_mojo_ui();
                } else {
                    var title = mutation.target.textContent;
                    cb_mojo_ext.title_selector = items.title_selector;
                    if (title.indexOf(cb_mojo_ext.title_selector) > 0 && title.indexOf("(#") > 0) {
                        cb_mojo_ext.ticket_id = title.substring(title.indexOf("(#") + 2, title.lastIndexOf(")")).trim();
                        cb_mojo_ext.create_form(false);
                        cb_mojo_ext.get_queues();
                    } else {
                        if (cb_mojo_ext.$update_form != null) {
                            cb_mojo_ext.$update_form.remove();
                        }
                    }
                }
            });
        });
        if (document.URL.indexOf(cb_mojo_ext.mojo_domain) > -1 && document.URL.indexOf("ma/#/tickets/") > -1) {
            cb_mojo_ext.enhance_mojo_ui();
        }
        cb_mojo_ext.observer.observe(cb_mojo_ext.target, {
            subtree: true,
            characterData: true,
            childList: true
        });
    });
    cb_mojo_ext.enhance_mojo_ui = function() {
        setTimeout(function(e) {
            cb_mojo_ext.is_modal = true
            cb_mojo_ext.ticket_id = window.location.href.split("/").slice(-1)[0].split("?").slice(0)[0];
            if (!$.isNumeric(cb_mojo_ext.ticket_id)) {
                return;
            }
            //alert(jQuery(".ticket-side-options a").length);
            //var $type_read_field = jQuery(".ng-binding:contains('Type')").closest('div').nextAll('div').first().find('span.ng-binding').first();
            jQuery("#ticket-form-info table tr").on("click", function() {
                cb_mojo_ext.create_form();
                cb_mojo_ext.get_queues();
            });
            //var current_question_type = $.trim($type_read_field.text()).toLowerCase();
            //alert(current_question_type);
            jQuery('a[ng-click="onEditAssigneeQueueType()"]').on("click", function() {
                setTimeout(function() {
                    jQuery('a[ng-click="onSaveAssigneeQueueType()"]').on("click", function() {
                        cb_mojo_ext.create_form();
                        cb_mojo_ext.get_queues();
                    });
                }, 1000)
            });
            jQuery(".ticket-side-options a").on("click", function() {
                $btn = jQuery(this);
                //setTimeout(function(e) {
                $subcategory_field = $btn.closest("#ticket-form-info").find("label:contains('Sub Category')").nextAll('input').first();
                $subcategory_field.prop('disabled', true);
                $subcategory_field_change = jQuery("<button>Change Sub Category</button>");
                $subcategory_field_change.on("click", function() {
                    cb_mojo_ext.create_form();
                    cb_mojo_ext.get_queues();
                });
                $subcategory_field_change.insertAfter($subcategory_field);
                //console.log(cb_mojo_ext.custom_fields_json["custom_field_sub_category"]["options"]);
                //jQuery(cb_mojo_ext.create_select("custom_field_sub_category", cb_mojo_ext.custom_fields_json["custom_field_sub_category"]["options"], $subcategory_field.val(), "Please Select Sub Category", true, "type")).insertAfter($subcategory_field);
                /*jQuery('[data-dependent-to]').on("dependent_change", function() {
                    $this = $(this);
                    $dependent_to = cb_mojo_ext.$update_form.find("#" + $this.data("dependent-to"));
                    $this.find('option').remove();
                    var dependent_options = JSON.parse($this.attr('data-dependent-options'));
                    if (cb_mojo_ext.debug_mode == true) {
                        console.log(dependent_options[$dependent_to.val()]);
                    }
                    $this.append(cb_mojo_ext.create_options(dependent_options[$dependent_to.val()], $this.attr("title"), $this.data("orig-value")));
                }).trigger("dependent_change");*/
                //}, 1000);
            });
            /*setInterval(function(){
                
            },3000);*/
        }, 1000);
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
                // The name of the callback parameter, as specified by the YQL service
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
    cb_mojo_ext.send_form = function() {
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
        //XMLData = XMLData + "<custom_field_sub_category>" + cb_mojo_ext.$update_form.find("#custom_field_sub_category").val() + "</custom_field_sub_category>";
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
    cb_mojo_ext.convert_object = function(mojo_object) {
        if (cb_mojo_ext.debug_mode == true) {
            console.log(mojo_object);
        }
        var return_obj = {};
        $.each(mojo_object, function() {
            return_obj[this.id] = this.name;
        });
        if (cb_mojo_ext.debug_mode == true) {
            console.log(return_obj);
        }
        return return_obj;
    };
    cb_mojo_ext.get_ticket = function() {
        cb_mojo_ext.$update_form.find(".content").html("Loading Ticket #" + cb_mojo_ext.ticket_id + "<br/> Please Wait...");
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
                    var ticket = response.ticket;
                    var ticket_id = ticket.id;
                    var status_id = ticket.status_id;
                    var related_data = ticket.related_data;
                    var ticket_type = ticket.ticket_type.name;
                    var ticket_type_id = ticket.ticket_type.id;
                    var assigned_to_id = ticket.assigned_to_id;
                    var queue = related_data.queue;
                    var ticket_queue_id = queue.id;
                    var ticket_queue_name = queue.name;
                    var ticket_type_id = ticket.ticket_type.id;
                    var potential_assignees = ticket.potential_assignees;
                    potential_assignees_fixed = cb_mojo_ext.convert_object(potential_assignees);
                    var ticket_link = "";
                    var extended_style = "";
                    if (cb_mojo_ext.is_modal) {
                        extended_style = "style='display:none'";
                    }
                    if (cb_mojo_ext.mojo_domain != "") {
                        var ticket_link = "<a id='open_ticket' " + extended_style + " href='https://" + cb_mojo_ext.mojo_domain + "/tech/#" + ticket_id + "' target='_blank'>Open The Ticket<br/></a>"
                    }
                    var html = ticket_link + "<table>";
                    html = html + "<tr " + extended_style + "><td>Ticket Type</td><td>" + cb_mojo_ext.create_select("ticket_type_id", cb_mojo_ext.ticket_options, ticket_type_id, "Please select type", false) + "</td></tr>";
                    html = html + "<tr " + extended_style + "><td>Status</td><td>" + cb_mojo_ext.create_select("status_id", cb_mojo_ext.status_options, status_id, "Please select status", false) + "</td></tr>";
                    html = html + "<tr " + extended_style + "><td>Queue</td><td>" + cb_mojo_ext.create_select("ticket_queue_id", cb_mojo_ext.queues, ticket_queue_id, "Please select queue", false) + "</td></tr>";
                    html = html + "<tr " + extended_style + "><td>Assignee</td><td>" + cb_mojo_ext.create_select("assigned_to_id", potential_assignees_fixed, assigned_to_id, "Please select Assignee", false) + "</td></tr>";
                    html = html + "<tr " + extended_style + "><td colspan=2><a id='assign_to_me' href='#'>Assign To Me</a></td></tr>";
                    if (cb_mojo_ext.use_custom_fields == true) {
                        html = html + cb_mojo_ext.create_custom_fields(cb_mojo_ext.custom_fields_json, ticket);
                    }
                    html = html + "</table>";
                    html = html + "<button id='" + cb_mojo_ext.update_button_id + "' data-ticket_id='" + ticket_id + "' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'>Update Ticket</button>";
                    if (cb_mojo_ext.debug_mode == true) {
                        console.log(ticket.related_data.queue.name);
                    }
                    cb_mojo_ext.$update_form.find(".content").html(html);
                    $("#" + cb_mojo_ext.update_button_id).click(cb_mojo_ext.send_form);
                    cb_mojo_ext.$update_form.find('[data-dependent-to]').on("dependent_change", function() {
                        $this = $(this);
                        $dependent_to = cb_mojo_ext.$update_form.find("#" + $this.data("dependent-to"));
                        $this.find('option').remove();
                        var dependent_options = JSON.parse($this.attr('data-dependent-options'));
                        if (cb_mojo_ext.debug_mode == true) {
                            console.log(dependent_options[$dependent_to.val()]);
                        }
                        $this.append(cb_mojo_ext.create_options(dependent_options[$dependent_to.val()], $this.attr("title"), $this.data("orig-value")));
                    });
                    cb_mojo_ext.$update_form.find('[data-dependent-to]').each(function() {
                        $this = $(this);
                        $dependent_to = cb_mojo_ext.$update_form.find("#" + $this.data("dependent-to"));
                        if ($dependent_to.length > 0) {
                            $dependent_to.on("change", function() {
                                $this.trigger("dependent_change");
                            });
                        }
                    })
                    cb_mojo_ext.$update_form.find('[data-dependent-to]').trigger("dependent_change");
                    $assignee_select = cb_mojo_ext.$update_form.find("#assigned_to_id");
                    $assignee_select.change(function() {
                        if (!$(this).val()) {
                            $(this).css("background-color", "red");
                        } else {
                            $(this).css("background-color", "");
                        }
                    }).change();
                    cb_mojo_ext.$update_form.find('#assign_to_me').click(function(e) {
                        e.preventDefault();
                        $assignee_select.val(cb_mojo_ext.mojo_agent_id);
                        $assignee_select.change.trigger("change");
                    });

                    function byTextCaseInsensitive(a, b) {
                        var ta = a.text.toUpperCase(),
                            tb = b.text.toUpperCase();
                        return ta === tb ? 0 : ta < tb ? -1 : 1;
                    }
                    var $form_selects_to_be_sorted = cb_mojo_ext.$update_form.find('#assigned_to_id');
                    $form_selects_to_be_sorted.each(function() {
                        var $this = $(this);
                        $this.find("option").sort(byTextCaseInsensitive).appendTo(this);
                        var $el = $this.find('option[value=""]');
                        $this.find('option[value=""]').remove();
                        $this.find('option:eq(0)').before($el);
                        $this.val(assigned_to_id);
                    });
                }
            },
            error: function(response) {
                if (cb_mojo_ext.debug_mode == true) {
                    console.log(response);
                }
            }
        });
    };
    cb_mojo_ext.create_custom_fields = function(custom_fields_json, ticket) {
        if (cb_mojo_ext.debug_mode == true) {
            console.log(custom_fields_json);
        }
        var custom_html = "";
        $.each(custom_fields_json, function(fieldName, fieldInfo) {
            var value = "";
            if (cb_mojo_ext.debug_mode == true) {
                console.log(fieldInfo);
            }
            if (ticket.hasOwnProperty(fieldName)) {
                value = ticket[fieldName];
            }
            switch (fieldInfo.field_type) {
                case "select":
                    if (cb_mojo_ext.debug_mode == true) {
                        console.log(fieldInfo);
                    }
                    var dependent_to = ""
                    if (fieldInfo.hasOwnProperty("dependent_to") && fieldInfo["dependent_to"] != "") {
                        dependent_to = fieldInfo.dependent_to;
                    }
                    custom_html = custom_html + "<tr><td>" + fieldInfo.pretty_name + "</td><td>" + cb_mojo_ext.create_select(fieldName, fieldInfo.options, value, "Please Select " + fieldInfo.pretty_name, true, dependent_to); + "</td></tr>";
                    break;
                case "input":
                    custom_html = custom_html + "<tr><td>" + fieldInfo.pretty_name + "</td><td><input type='text' id='" + fieldName + "' name='" + fieldName + "' value='" + value + "' placeholder='Please Enter " + fieldInfo.pretty_name + "' class='" + cb_mojo_ext.custom_class + "' /></td></tr>";
                    break;
            }
        });
        return custom_html;
    };
    cb_mojo_ext.create_select = function(name, options, value, call_to_action, is_custom, dependent_to) {
        var custom_class = "";
        if (cb_mojo_ext.debug_mode == true) {
            console.log(value);
        }
        if (cb_mojo_ext.debug_mode == true) {
            console.log(options);
        }
        if (is_custom == true) {
            custom_class = cb_mojo_ext.custom_class;
        }
        var dependent_options = "";
        if (typeof(dependent_to) != "undefined") {
            dependent_to = "data-dependent-to='" + dependent_to + "' data-dependent-options=\'" + JSON.stringify(options).replace(/'/g, "\\'") + "'";
            options = "";
        }
        var select_html = '<select title="' + call_to_action + '" id="' + name + '" name="' + name + '" data-orig-value="' + value + '" ' + dependent_to + '  class="selectmenu ' + custom_class + '">';
        select_html = select_html + cb_mojo_ext.create_options(options, call_to_action, value);
        select_html = select_html + '</select>';
        return select_html;
    };
    cb_mojo_ext.create_options = function(options, call_to_action, value) {
        var options_html = '<option value="">' + call_to_action + '</option>';
        $.each(options, function(k, v) {
            selected = ""
            if (value == k) {
                selected = "selected='selected'"
            }
            options_html = options_html + '<option value="' + k + '" ' + selected + '>' + v + '</option>'
        });
        return options_html;
    };
    cb_mojo_ext.create_form = function() {
        var html = "<div id='" + cb_mojo_ext.popup_id + "'>";
        if (!cb_mojo_ext.is_modal) {
            html = html + "<div class='title'>Mojo Update <img src='" + chrome.extension.getURL("icons/icon19.png") + "'></div>";
        }
        html = html + '<div class="ui-widget success_msg" style="display:none;"><div class="ui-state-highlight ui-corner-all" style="margin-top: 20px; padding: 0 .7em;"><p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span><span class="message"></span></p></div></div>';
        html = html + '<div class="ui-widget error_msg" style="display:none;"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><span class="message"></span></p></div></div>';
        html = html + "<div class='content'></div>";
        html = html + "</div>";
        if (cb_mojo_ext.is_modal) {
            $("body").append(html);
        } else {
            $('div[role="complementary"] .u5').append(html);
        }
        cb_mojo_ext.$update_form = $("#" + cb_mojo_ext.popup_id);
        cb_mojo_ext.$update_form.on("message", function(event, type, message) {
            var $error_notification = cb_mojo_ext.$update_form.find('.error_msg');
            var $success_notification = cb_mojo_ext.$update_form.find('.success_msg');
            $error_notification.hide();
            $success_notification.hide();
            if (type == "error") {
                $error_notification.find('.message').html(message);
                $error_notification.show();
            } else if (type == "info") {
                $success_notification.find('.message').html(message);
                $success_notification.show();
                setTimeout(function() {
                    $success_notification.hide();
                }, 5000);
            } else if (type == "clear") {
                //Do Nothing
            }
        });
        if (cb_mojo_ext.is_modal) {
            cb_mojo_ext.$update_form.addClass("draggable");
            var dialog_options = {
                title: "Mojo Update",
                create: function() { ///// CREATE FUNCTION TO ADD CUSTOM BUTTON
                    $(this).prev('.ui-dialog-titlebar').find('.ui-dialog-title').after("<img src='" + chrome.extension.getURL("icons/icon19.png") + "'>");
                },
                draggable: true,
                modal: true,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }
            };
            var dialog_options_extended = {
                "closable": true,
                "titlebar": "transparent",
                "icons": {
                    "close": "ui-icon-circle-close"
                }
            };
            cb_mojo_ext.$update_form.dialog(dialog_options).dialogExtend(dialog_options_extended);
        } else {
            cb_mojo_ext.$update_form.addClass("sbar");
        }
    };
    console.log("Finished Loading Mojo HelpDesk Extension by Collective Bias");
}