var cb_mojo_ext = new CB_Mojo_Extension();
if (document.URL.indexOf(cb_mojo_ext.mojo_domain) == -1
  && document.URL.indexOf("ma/#/tickets/") == -1
  && document.URL.indexOf(cb_mojo_ext.email_domain) == -1) {
  }else{
    chrome.runtime.sendMessage({ from: 'mojohelpdesk', message: 'N/A' });
}