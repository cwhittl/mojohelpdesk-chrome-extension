function CB_Mojo_UI() {}
CB_Mojo_UI.create_form = function(response, cb_mojo_ext) {
    var ticket = response.ticket;
    var ticket_id = ticket.id;
    var status_id = ticket.status_id;
    var related_data = ticket.related_data;
    var ticket_type = ticket.ticket_type.name;
    var ticket_type_id = ticket.ticket_type.id;
    var assigned_to_id = ticket.assigned_to_id;
    var queue = related_data.queue;
    var messages = ticket.all_comments;
    var submitter_full_name = related_data.user.full_name;
    var submitter_picture_url = related_data.user.picture_url;
    var submitter_email = related_data.user.email;
    var ticket_queue_id = queue.id;
    var ticket_queue_name = queue.name;
    var ticket_type_id = ticket.ticket_type.id;
    var ticket_description = ticket.description;
    var potential_assignees = ticket.potential_assignees;
    potential_assignees_fixed = Shared.convert_object(potential_assignees);
    var ticket_link = "";
    var extended_style = "";
    if (cb_mojo_ext.is_modal) {
        extended_style = "style='display:none'";
    }
    if (cb_mojo_ext.mojo_domain != "") {
        var ticket_link = "<a id='open_ticket' " + extended_style + " href='https://" + cb_mojo_ext.mojo_domain + "/tech/#" + ticket_id + "' target='_blank'>Open The Ticket<br/></a>"
    }
    var html = ticket_link + "<table class='ticket_form'>";
    html = html + "<tr " + extended_style + "><td>Ticket Type</td><td>" + CB_Mojo_UI.create_select("ticket_type_id", cb_mojo_ext.ticket_options, ticket_type_id, "Please select type", false, null, cb_mojo_ext) + "</td></tr>";
    html = html + "<tr " + extended_style + "><td>Status</td><td>" + CB_Mojo_UI.create_select("status_id", cb_mojo_ext.status_options, status_id, "Please select status", false, null, cb_mojo_ext) + "</td></tr>";
    html = html + "<tr " + extended_style + "><td>Queue</td><td>" + CB_Mojo_UI.create_select("ticket_queue_id", cb_mojo_ext.queues, ticket_queue_id, "Please select queue", false, null, cb_mojo_ext) + "</td></tr>";
    html = html + "<tr " + extended_style + "><td>Assignee</td><td>" + CB_Mojo_UI.create_select("assigned_to_id", potential_assignees_fixed, assigned_to_id, "Please select Assignee", false, null, cb_mojo_ext) + "</td></tr>";
    html = html + "<tr " + extended_style + "><td colspan=2><a id='assign_to_me' href='#'>Assign To Me</a></td></tr>";
    if (cb_mojo_ext.use_custom_fields == true) {
        html = html + CB_Mojo_UI.create_custom_fields(cb_mojo_ext.custom_fields_json, ticket, cb_mojo_ext);
    }
    html = html + "</table>";
    html = html + "<button id='" + cb_mojo_ext.update_button_id + "' data-ticket_id='" + ticket_id + "' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'>Update Ticket</button>";
    if (!cb_mojo_ext.is_modal) {
        html = html + "<div class='info_cat' data-cat='ticket_info'>";
        html = html + "<div class='info_cat_header'>Ticket Information<span class='toggle'>&#43;</span><span class='maximize'>&#8598;</span></div>";
        html = html + "<div class='ticket_info' style='background-image:url(" + submitter_picture_url + ")'>Submitted By " + submitter_full_name + "</div>";
        html = html + "<div class='ticket_info scrollbox'>" + Shared.linkify(Shared.clean_message_body(ticket_description,cb_mojo_ext.mojo_domain)) + "</div>";
        html = html + "</div>";
        html = html + "<div class='info_cat' data-cat='ticket_messages'>";
        html = html + "<div class='info_cat_header'>Messages (" + messages.length + ")<span class='toggle'>&#43;</span><span class='maximize'>&#8598;</span></div>";
        html = html + "<div class='scrollbox ticket_messages'>";
        html = html + "<ul>";
        var associated_users = [];
        var messages_html = "";
        $.each(messages, function(k, v) {
            if (!Shared.isEmpty(v.body)) {
                var messager_email = v.related_data.user.email;
                var is_private = ((v.is_private == true) ? "is_private" : "is_public");
                associated_users.push(messager_email);
                //var message_date = Shared.getLocalTimeFromGMT(v.created_on);
                var message_date = new Date(v.created_on);
                messages_html = "<li class='" + is_private + "'><div class='message_header'><span class='user_pic' data-email='" + messager_email + "'></span><span class='user_info' data-email='" + messager_email + "'></span><span class='time_info'>On " + message_date.toLocaleString() + "</span></div>" + Shared.linkify(Shared.clean_message_body(v.body,cb_mojo_ext.mojo_domain)) + "</li>" + messages_html;
            }
        });
        html = html + messages_html;
        html = html + "</ul></div>";
        html = html + "</div>";
        html = html + "<div class='info_cat' data-cat='ticket_private_message'>";
        html = html + "<div class='info_cat_header' >Send Private Message<span class='toggle'>&#43;</span><span class='maximize'>&#8598;</span></div>";
        html = html + "<div class='ticket_private_message'>"
        html = html + '<div class="ui-widget success_msg" style="display:none;"><div class="ui-state-highlight ui-corner-all" style="margin-top: 20px; padding: 0 .7em;"><p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span><span class="message"></span></p></div></div>';
        html = html + '<div class="ui-widget error_msg" style="display:none;"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><span class="message"></span></p></div></div>';
        html = html + "<textarea></textarea>";
        html = html + "<button class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'>Send Message</button>";
        html = html + "</div>";
        html = html + "</div>";
    }
    if (cb_mojo_ext.debug_mode == true) {
        console.log(ticket.related_data.queue.name);
    }
    cb_mojo_ext.$update_form.find(".ticket_content").html(html);
    cb_mojo_ext.$update_form.trigger("associated_users", [associated_users]);
    cb_mojo_ext.$update_form.find(".ticket_private_message").on("message", CB_Mojo_UI.create_message);
    cb_mojo_ext.$update_form.find(".info_cat[data-cat='ticket_messages']").find(".maximize").on("click", {
        title: "Messages",
        element: jQuery(".ticket_messages")
    }, CB_Mojo_UI.make_me_a_dialog);
    cb_mojo_ext.$update_form.find(".info_cat[data-cat='ticket_info']").find(".maximize").on("click", {
        title: "Ticket Information",
        element: jQuery(".ticket_info.scrollbox")
    }, CB_Mojo_UI.make_me_a_dialog);
    cb_mojo_ext.$update_form.find(".info_cat[data-cat='ticket_private_message']").find(".maximize").on("click", {
        title: "Send Private Message",
        element: jQuery(".ticket_private_message")
    }, CB_Mojo_UI.make_me_a_dialog);
    $(".ticket_private_message button").on("click", {
        ticket_id: ticket_id
    }, cb_mojo_ext.send_private_message);
    $("#" + cb_mojo_ext.update_button_id).click(cb_mojo_ext.send_form);
    cb_mojo_ext.$update_form.find('[data-dependent-to]').on("dependent_change", function() {
        $this = $(this);
        $dependent_to = cb_mojo_ext.$update_form.find("#" + $this.data("dependent-to"));
        $this.find('option').remove();
        var dependent_options = JSON.parse($this.attr('data-dependent-options'));
        if (cb_mojo_ext.debug_mode == true) {
            console.log(dependent_options[$dependent_to.val()]);
        }
        $this.append(CB_Mojo_UI.create_options(dependent_options[$dependent_to.val()], $this.attr("title"), $this.data("orig-value")));
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
        $assignee_select.trigger("change");
    });
    var $form_selects_to_be_sorted = cb_mojo_ext.$update_form.find('#assigned_to_id');
    $form_selects_to_be_sorted.each(function() {
        var $this = $(this);
        $this.find("option").sort(Shared.byTextCaseInsensitive).appendTo(this);
        var $el = $this.find('option[value=""]');
        $this.find('option[value=""]').remove();
        $this.find('option:eq(0)').before($el);
        $this.val(assigned_to_id);
    });
    jQuery("[data-cat] .info_cat_header").on("click", function(e) {
        var neg = "&#8722;";
        var plus = "&#43;";
        $this = jQuery(this);
        my_cat = $this.closest(".info_cat").data("cat");
        jQuery("[data-cat]").each(function() {
            $others = jQuery(this);
            if (my_cat != $others.data("cat")) {
                jQuery("." + $others.data("cat")).hide();
            }
            $others.find(".toggle").html(plus);
        });
        if (jQuery("." + my_cat).is(':visible')) {
            $this.find(".toggle").html(plus);
        } else {
            $this.find(".toggle").html(neg);
        }
        jQuery("." + my_cat).toggle();
    });
}
CB_Mojo_UI.create_custom_fields = function(custom_fields_json, ticket, cb_mojo_ext) {
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
                custom_html = custom_html + "<tr><td>" + fieldInfo.pretty_name + "</td><td>" + CB_Mojo_UI.create_select(fieldName, fieldInfo.options, value, "Please Select " + fieldInfo.pretty_name, true, dependent_to, cb_mojo_ext); + "</td></tr>";
                break;
            case "input":
                custom_html = custom_html + "<tr><td>" + fieldInfo.pretty_name + "</td><td><input type='text' id='" + fieldName + "' name='" + fieldName + "' value='" + value + "' placeholder='Please Enter " + fieldInfo.pretty_name + "' class='" + cb_mojo_ext.custom_class + "' /></td></tr>";
                break;
        }
    });
    return custom_html;
};
CB_Mojo_UI.create_select = function(name, options, value, call_to_action, is_custom, dependent_to, cb_mojo_ext) {
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
    if (typeof(dependent_to) != "undefined" && dependent_to != null) {
        dependent_to = "data-dependent-to='" + dependent_to + "' data-dependent-options=\'" + JSON.stringify(options).replace(/'/g, "\\'") + "'";
        options = "";
    }
    var select_html = '<select title="' + call_to_action + '" id="' + name + '" name="' + name + '" data-orig-value="' + value + '" ' + dependent_to + '  class="selectmenu ' + custom_class + '">';
    select_html = select_html + CB_Mojo_UI.create_options(options, call_to_action, value);
    select_html = select_html + '</select>';
    return select_html;
};
CB_Mojo_UI.update_user = function(user_email, user_name, user_pic) {
    jQuery(".user_pic[data-email='" + user_email + "']").css("background-image", "url(" + user_pic + ")");
    jQuery(".user_info[data-email='" + user_email + "']").html(user_name);
    jQuery(".is_private .user_info[data-email='" + user_email + "']").html(user_name + " (Private)");
};
CB_Mojo_UI.create_options = function(options, call_to_action, value, cb_mojo_ext) {
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
CB_Mojo_UI.make_me_a_dialog = function(event) {
    //event.preventDefault();
    var clone = event.data.element.clone(true, true);
    clone.dialog({
        "title": event.data.title,
        modal: true,
        width: "80%",
        maxHeight: 400,
        minHeight: 400,
        position: {
            my: "center",
            at: "center",
            of: window
        }
    }).dialogExtend({
        "titlebar": "transparent",
        "icons": {
            "close": "ui-icon-circle-close"
        }
    });
    setTimeout(function() {
        clone.show();
    }, 200);
}
CB_Mojo_UI.create_message = function(event, type, message) {
    event.preventDefault();
    var $this = jQuery(this);
    var $error_notification = $this.find('.error_msg');
    var $success_notification = $this.find('.success_msg');
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
};
CB_Mojo_UI.fill_form_container = function(cb_mojo_ext) {
    cb_mojo_ext.$update_form.on("message", CB_Mojo_UI.create_message);
    if (cb_mojo_ext.is_modal) {
        cb_mojo_ext.$update_form.addClass("draggable");
        var dialog_options = {
            title: "Mojo Update",
            create: function() {
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