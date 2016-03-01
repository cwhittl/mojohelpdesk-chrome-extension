function API_Connector() {}
API_Connector.get_attachment_url = function(attachment_id) {
  return "https://mysupport.mojohelpdesk.com/api/v3/attachments/" + attachment_id; //+ "?access_key=" + cb_mojo_ext.api_key;
}
API_Connector.get_messages = function(cb_mojo_ext, success_function) {
  $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + "/comments.json?access_key=" + cb_mojo_ext.api_key, success_function).fail(function(e) {
    if (error_function != null && typeof error_function == "function") {
      error_function(e);
    }
  });
}
API_Connector.get_user = function(user_id, cb_mojo_ext, success_function) {
  $.getJSON("https://mysupport.mojohelpdesk.com/api/users/" + user_id + ".json?access_key=" + cb_mojo_ext.api_key, success_function).fail(function(e) {
    if (error_function != null && typeof error_function == "function") {
      error_function(e);
    }
  });
}
API_Connector.get_ticket = function(cb_mojo_ext, success_function, error_function) {
  $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + ".json?access_key=" + cb_mojo_ext.api_key, success_function).fail(function(e) {
    if (error_function != null && typeof error_function == "function") {
      error_function(e);
    }
  });
}
API_Connector.get_queues = function(cb_mojo_ext, success_function, error_function) {
  $.getJSON("https://mysupport.mojohelpdesk.com/api/ticket_queues.json?access_key=" + cb_mojo_ext.api_key, success_function).fail(function(e) {
    if (error_function != null && typeof error_function == "function") {
      error_function(e);
    }
  });
}
API_Connector.get_agent_id = function(cb_mojo_ext, success_function) {
  $.getJSON("https://mysupport.mojohelpdesk.com/api/users/get_by_email.json?email=" + cb_mojo_ext.email_address + "&access_key=" + cb_mojo_ext.api_key, success_function).fail(function(e) {
    if (error_function != null && typeof error_function == "function") {
      error_function(e);
    }
  });
}
API_Connector.send_message = function(react_element, is_private, cb_mojo_ext, onsuccess) {
  var state = react_element.state;
  //var ticket_id = event.data("ticket_id");
  var XMLData = "<comment>";
  XMLData = XMLData + "<body>" + state.message + "</body>";
  if (is_private == true) {
    XMLData = XMLData + "<is_private>true</is_private>";
  }
  XMLData = XMLData + "</comment>";

  debug.info(XMLData);
  $.ajax({
    url: "https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + "/comments?access_key=" + cb_mojo_ext.access_key,
    type: "POST",
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
        message: "Message Sent"
      }, react_element);
      if (onsuccess) {
        onsuccess();
      }
    }
  });
};
API_Connector.send_form = function(react_element, cb_mojo_ext, onsuccess) {
  var state = react_element.state;
  var ticket_id = state.ticket_id;
  var XMLData = "<ticket>";
  if (state.queue_id && state.queue_id != "") {
    XMLData = XMLData + "<ticket_queue_id>" + state.queue_id + "</ticket_queue_id>";
  }
  if (state.ticket_priority_id && state.ticket_priority_id != "") {
    XMLData = XMLData + "<priority_id>" + state.ticket_priority_id + "</priority_id>";
  }
  if (state.scheduled_on && state.scheduled_on != "") {
    XMLData = XMLData + "<scheduled_on>" + state.scheduled_on + "T00:00:00Z</scheduled_on>";
  }
  if (state.due_on && state.due_on != "") {
    XMLData = XMLData + "<due_on>" + state.due_on + "T00:00:00Z</due_on>";
  }
  if (state.ticket_type_id && state.ticket_type_id != "") {
    XMLData = XMLData + "<ticket_type_id>" + state.ticket_type_id + "</ticket_type_id>";
  }
  if (state.assigned_to_id && state.assigned_to_id != "") {
    XMLData = XMLData + "<assigned_to_id>" + state.assigned_to_id + "</assigned_to_id>";
  }
  if (state.status_id && state.status_id != "") {
    XMLData = XMLData + "<status_id>" + state.status_id + "</status_id>";
  }
  XMLData = XMLData + Shared.get_custom_fields_xml(cb_mojo_ext, state);
  XMLData = XMLData + "</ticket>";
  debug.info(XMLData);
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
