function API_Connector() {}
API_Connector.get_messages = function(cb_mojo_ext,success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/"+cb_mojo_ext.ticket_id+"/comments.json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_user = function(user_id,cb_mojo_ext,success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/users/"+user_id+".json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_ticket = function(cb_mojo_ext,success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/" + cb_mojo_ext.ticket_id + ".json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_queues = function(cb_mojo_ext,success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/ticket_queues.json?access_key=" + cb_mojo_ext.api_key, success_function);
}
API_Connector.get_agent_id = function(cb_mojo_ext,success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/users/get_by_email.json?email=" + cb_mojo_ext.email_address + "&access_key=" + cb_mojo_ext.api_key, success_function);
}