chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.from == 'mojohelpdesk') {
    var js_libs = ["lib/jquery/jquery-2.1.4.min.js","lib/react-0.14.5/react.js",
    "lib/react-0.14.5/react-dom.js","lib/react_plugins/classnames.js","lib/Dates.js",
    "services/API_Connector.js","lib/CB_Mojo_Extension_Loader.js",
    "components/Modal.js","components/Portlet/Portlet.js",
    "components/Forms/Ticket_Send_Message_Form.js","components/Forms/Ticket_Attachments_Form.js",
    "components/Forms/Ticket_Update_Form.js","components/Forms/Ticket_Description_Form.js",
    "components/Forms/Ticket_Messages_Form.js","components/Forms/Mojo_Custom_Fields_Form.js",
    "components/Gmail_Sidebar.js"];

    for (i = 0; i < js_libs.length; i++) {
      chrome.tabs.executeScript(sender.tab.id, {file: js_libs[i] });
    }
    var css_libs = ["components/Portlet/Portlet.css","components/Forms/forms.css"];
    for (i = 0; i < css_libs.length; i++) {
      chrome.tabs.insertCSS(sender.tab.id, {file: css_libs[i] });
    }
    console.log("Loading Mojo HelpDesk Extension by Collective Bias");
    chrome.tabs.executeScript(sender.tab.id, {code:"CB_Mojo_Extension_Loader();"});
  }
});