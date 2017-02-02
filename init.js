var cb_mojo_ext = new CB_Mojo_Extension(function(cb_mojo_ext) {
    if (document.URL.indexOf(cb_mojo_ext.mojo_domain) == -1 && document.URL.indexOf("ma/#/tickets/") == -1 && document.URL.indexOf(cb_mojo_ext.email_domain) == -1) {} else {
        console.log("Loading Mojo HelpDesk Extension by Collective Bias");
        chrome.runtime.sendMessage({from: 'mojohelpdesk', cb_mojo_ext: cb_mojo_ext});
    }
});
