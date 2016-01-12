function API_Connector() {}
API_Connector.get_messages = function(cb_mojo_ext, success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + "/comments.json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_user = function(user_id, cb_mojo_ext, success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/users/" + user_id + ".json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_ticket = function(cb_mojo_ext, success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + ".json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_queues = function(cb_mojo_ext, success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/ticket_queues.json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_agent_id = function(cb_mojo_ext, success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/users/get_by_email.json?email=" + cb_mojo_ext.email_address + "&access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.send_private_message = function(props) {
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
        jQuery(".ticket_private_message").trigger("message", ["error", "Please enter a message"]);
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
            jQuery(".ticket_private_message").trigger("message", ["error", errorThrown]);
        },
        success: function(data, textStatus, XMLHttpRequest) {
            jQuery(".ticket_private_message").trigger("message", ["info", "Message Sent"]);
            jQuery(".ticket_private_message textarea").val("");
            setTimeout(function() {
                $(".ui-dialog-content").dialog("close");
            }, 1500);
        }
    });
};
API_Connector.send_form = function(react_element, cb_mojo_ext, onsuccess) {
    var state = react_element.state;
    var ticket_id = state.ticket_id;
    var XMLData = "<ticket>";
    XMLData = XMLData + "<ticket_queue_id>" + state.queue_id + "</ticket_queue_id>"
    XMLData = XMLData + "<ticket_type_id>" + state.ticket_type_id + "</ticket_type_id>";
    XMLData = XMLData + "<assigned_to_id>" + state.assigned_to_id + "</assigned_to_id>";
    XMLData = XMLData + "<status_id>" + state.ticket_status_id + "</status_id>";
    $.each(cb_mojo_ext.custom_fields_json, function(fieldName, fieldInfo) {
        var value = "";
        if (state.hasOwnProperty(fieldName)) {
            value = state[fieldName];
            XMLData = XMLData + "<" + fieldName + ">" + value + "</" + fieldName + ">";
        }
    });
    XMLData = XMLData + "</ticket>";
    // console.log(XMLData);
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
            Shared.createMessage({
                type: "error",
                message: errorThrown
            }, react_element);
        },
        success: function(data, textStatus, XMLHttpRequest) {
            Shared.createMessage({
                type: "success",
                message: "Ticket Updated"
            }, react_element);
            if (onsuccess) {
                onsuccess();
            }
        }
    });
};