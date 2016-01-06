function API_Connector() {}
API_Connector.get_messages = function(cb_mojo_ext,success_function) {
    $.getJSON("https://mysupport.mojohelpdesk.com/api/tickets/11720081/comments.json?access_key=ab0f5fd27c0d2a5af3e33b902e1c239ac01b8616", success_function);
}